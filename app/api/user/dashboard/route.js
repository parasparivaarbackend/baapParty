import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userSession';
import { getUserById } from '@/lib/db/users';
import { connectDB, serialize } from '@/lib/db/mongoose';
import Contribution from '@/models/Contribution';
import Message from '@/models/Message';
import Volunteer from '@/models/Volunteer';
import { getMembershipId } from '@/lib/membership';
import { userGrievances } from '@/lib/db/grievances';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const session = await getUserSession(req);
  if (!session?.sub) {
    return NextResponse.json({ error: 'Please log in' }, { status: 401 });
  }

  const user = await getUserById(session.sub);
  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  await connectDB();
  const userId = String(session.sub);
  const bySubmitted = { submittedAt: -1 };

  // Show records linked to this account (userId) AND older records that were
  // submitted with the same email before the account/login existed.
  const escaped = user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mine = { $or: [{ userId }, { email: new RegExp(`^${escaped}$`, 'i') }] };

  const [contributions, messages, volunteers, tickets] = await Promise.all([
    Contribution.find(mine).sort(bySubmitted).lean(),
    Message.find(mine).sort(bySubmitted).lean(),
    Volunteer.find(mine).sort(bySubmitted).lean(),
    userGrievances(userId),
  ]);

  const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const typeOf = (m) => (m.type || 'Query').toLowerCase();

  return NextResponse.json(
    {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        joinedAt: user.createdAt,
      },
      membership: {
        id: getMembershipId(user),
        status: 'Active',
        since: user.createdAt,
      },
      stats: {
        totalContributed,
        contributionCount: contributions.length,
        complaintCount: messages.filter((m) => typeOf(m) === 'complaint').length,
        queryCount: messages.filter((m) => typeOf(m) !== 'complaint').length,
        volunteerCount: volunteers.length,
      },
      contributions: serialize(contributions),
      messages: serialize(messages),
      volunteers: serialize(volunteers),
      tickets,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
