import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userSession';
import { createGrievance, listGrievances } from '@/lib/db/grievances';
import { CATEGORIES, WING_PREFIX, normalizeDistrict } from '@/lib/ticket';
import { INDIAN_STATES } from '@/lib/locations';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { getAdmin, allowedWings } from '@/lib/adminSession';
import { isOtpEnabled, checkOtpToken, cleanEmail, isValidEmail } from '@/lib/otp';
import { smsEnabled, whatsappEnabled } from '@/lib/notify/providers';
import { notifyCitizen } from '@/lib/notify';

// GET is admin-only; officers only receive the wings their role covers.
export async function GET(req) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await listGrievances(allowedWings(admin.role)));
}

// POST is public — anyone can file a problem.
export async function POST(req) {
  if (!rateLimit(`grv:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again in a few minutes.' }, { status: 429 });
  }

  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  // Honeypot: real users never fill this hidden field.
  if (b?.website) return NextResponse.json({ ticketId: 'OK' }, { status: 201 });

  const wing = String(b?.wing || '');
  if (!WING_PREFIX[wing]) return NextResponse.json({ error: 'Please choose a wing' }, { status: 400 });
  if (!CATEGORIES[wing].includes(b.category)) return NextResponse.json({ error: 'Please choose a valid category' }, { status: 400 });
  if (!INDIAN_STATES.includes(b.state)) return NextResponse.json({ error: 'Please choose your state' }, { status: 400 });

  const district = normalizeDistrict(b.district);
  if (district.length < 2) return NextResponse.json({ error: 'Please enter your district' }, { status: 400 });

  const description = String(b.description || '').trim();
  if (description.length < 20 || description.length > 3000) {
    return NextResponse.json({ error: 'Please describe the problem in 20–3000 characters' }, { status: 400 });
  }

  // Email is the main contact (updates, OTP, tracking). Mobile is optional.
  const email = cleanEmail(b.email);
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });

  const phone = String(b.contactPhone || '').replace(/\D/g, '').slice(-10);
  if (phone && !/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: 'Enter a valid 10-digit mobile number, or leave it empty' }, { status: 400 });

  if (isOtpEnabled() && !(await checkOtpToken(b.otpToken, email, 'file'))) {
    return NextResponse.json({ error: 'Please verify your email with the OTP first' }, { status: 400 });
  }

  if (b.consent !== true) return NextResponse.json({ error: 'Please accept the consent to continue' }, { status: 400 });

  // Only the sensitive women's pathway can be marked sensitive, and it takes no file uploads.
  const isSensitive = wing === 'women' && b.isSensitive === true;
  const attachments = isSensitive
    ? []
    : (Array.isArray(b.attachments) ? b.attachments : [])
        .filter((u) => typeof u === 'string' && u.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`))
        .slice(0, 3);

  const data = {
    wing, category: b.category, isSensitive, state: b.state, district, description,
    attachments, contactPhone: phone || undefined, email,
    name: String(b.name || '').trim().slice(0, 80) || undefined,
    consent: true,
    emailVerified: isOtpEnabled(),
    // Explicit opt-in per channel; confidential cases get nothing unless the citizen ticks it.
    notify: {
      email: b.notify?.email === true,
      // SMS / WhatsApp stay switched off until SMS_ENABLED / WHATSAPP_ENABLED are set.
      sms: smsEnabled() && !!phone && b.notify?.sms === true,
      whatsapp: whatsappEnabled() && !!phone && b.notify?.whatsapp === true,
    },
  };
  const session = await getUserSession(req);
  if (session?.sub) data.userId = String(session.sub);

  try {
    const g = await createGrievance(data);
    await notifyCitizen(g, 'created'); // never throws
    return NextResponse.json({ ticketId: g.ticketId }, { status: 201 });
  } catch (err) {
    console.error('createGrievance failed', err);
    return NextResponse.json({ error: 'Could not save your problem. Please try again.' }, { status: 500 });
  }
}
