import { NextResponse } from 'next/server';
import { requireAdmin, SUPER_ONLY } from '@/lib/adminSession';
import { getUserSession } from '@/lib/userSession';
import { getVolunteers, createVolunteer } from '@/lib/db/volunteers';
import { readNames } from '@/lib/personName';
import { ID_PROOF_TYPES, ID_PROOF_FOLDER } from '@/lib/idProof';
import { checkWords } from '@/lib/wordLimit';
import { notifySubmission } from '@/lib/notify/submissions';

export async function GET(req) {
  const auth = await requireAdmin(req, SUPER_ONLY);
  if (auth.error) return auth.error;
  const items = await getVolunteers();
  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const names = readNames(body);
  if (!names.firstName || !body?.phone || !body?.email) {
    return NextResponse.json({ error: 'First name, phone and email are required' }, { status: 400 });
  }

  const words = checkWords(body.message);
  if (words.error) return NextResponse.json({ error: words.error }, { status: 400 });

  // 18+ declaration and age / ID proof are required.
  if (body.isAdult !== true) {
    return NextResponse.json({ error: 'Please confirm that you are 18 or above' }, { status: 400 });
  }
  if (!ID_PROOF_TYPES.includes(body.idProofType)) {
    return NextResponse.json({ error: 'Please choose the type of ID proof' }, { status: 400 });
  }
  const proof = body.idProof;
  const proofOk =
    proof &&
    typeof proof.publicId === 'string' &&
    proof.publicId.startsWith(ID_PROOF_FOLDER) &&
    proof.publicId.length < 300 &&
    ['image', 'raw'].includes(proof.resourceType);
  if (!proofOk) {
    return NextResponse.json({ error: 'Please upload your 18+ ID proof' }, { status: 400 });
  }

  // Only known fields are saved (the client cannot add its own).
  const data = {
    ...names,
    phone: String(body.phone).trim().slice(0, 15),
    email: String(body.email).trim().toLowerCase().slice(0, 120),
    constituency: String(body.constituency || '').trim().slice(0, 120),
    interests: (Array.isArray(body.interests) ? body.interests : []).map((i) => String(i).slice(0, 60)).slice(0, 12),
    message: words.text,
    isAdult: true,
    idProofType: body.idProofType,
    idProof: {
      publicId: proof.publicId,
      resourceType: proof.resourceType,
      format: typeof proof.format === 'string' ? proof.format.slice(0, 10) : undefined,
    },
  };

  // Link this submission to the logged-in member (if any) so it shows on their
  // dashboard. userId always comes from the verified cookie, never from the client.
  const session = await getUserSession(req);
  if (session?.sub) {
    data.userId = String(session.sub);
  }
  const item = await createVolunteer(data);
  await notifySubmission('volunteer', item); // confirmation mail to the volunteer; never throws
  return NextResponse.json(item, { status: 201 });
}
