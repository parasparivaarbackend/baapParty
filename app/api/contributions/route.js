import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getContributions, createContribution } from '@/lib/db/contributions';
import { readNames } from '@/lib/personName';
import { notifySubmission } from '@/lib/notify/submissions';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getContributions();
  return NextResponse.json(items);
}

const METHODS = new Set(['upi', 'bank', 'card', 'netbanking']);
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export async function POST(req) {
  const raw = await req.json().catch(() => ({}));
  const names = readNames(raw);
  const amount = Number(raw?.amount);
  if (!names.firstName) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
    return NextResponse.json({ error: 'Enter a valid amount' }, { status: 400 });
  }
  const method = METHODS.has(raw?.method) ? raw.method : null;
  if (!method) return NextResponse.json({ error: 'Choose the payment method you used' }, { status: 400 });

  // Only these fields are accepted from the client (the model is schema-less, so never spread the body).
  const body = { ...names, amount, method };

  const email = clip(raw?.email, 120).toLowerCase();
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    body.email = email;
  }
  if (raw?.phone) body.phone = clip(raw.phone, 20);
  if (raw?.message) body.message = clip(raw.message, 500);
  if (raw?.transactionId) body.transactionId = clip(raw.transactionId, 60);

  if (raw?.paymentDate) {
    const d = new Date(raw.paymentDate);
    if (Number.isNaN(d.getTime()) || d.getTime() > Date.now() + 24 * 3600 * 1000) {
      return NextResponse.json({ error: 'Enter a valid payment date' }, { status: 400 });
    }
    body.paymentDate = d;
  }

  const sc = raw?.screenshot;
  if (!sc?.publicId || !String(sc.publicId).startsWith('bharatiya-avijit-aawaz-party/contribution-proof/')) {
    return NextResponse.json({ error: 'Please upload your payment screenshot' }, { status: 400 });
  }
  body.screenshot = {
    publicId: String(sc.publicId),
    resourceType: sc.resourceType === 'raw' ? 'raw' : sc.resourceType === 'video' ? 'video' : 'image',
    format: clip(sc.format, 10),
  };

  // Link this submission to the logged-in member (if any) so it shows on their dashboard.
  // userId always comes from the verified cookie, never from the client.
  const session = await getUserSession(req);
  if (session?.sub) {
    body.userId = String(session.sub);
    if (!body.email && session.email) body.email = session.email;
  }
  const item = await createContribution(body);
  await notifySubmission('contribution', item); // thank-you mail; never throws
  return NextResponse.json(item, { status: 201 });
}
