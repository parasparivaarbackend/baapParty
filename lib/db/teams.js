import { connectDB, serialize } from './mongoose';
import TeamMember from '@/models/TeamMember';

const sortSpec = { state: 1, district: 1, order: 1, name: 1 };

/** Admin: every member, active or not. */
export async function listTeamMembers() {
  await connectDB();
  return serialize(await TeamMember.find().sort(sortSpec).lean());
}

/** Public: only active members; contact details are stripped unless the admin allowed them. */
export async function publicTeamMembers(wing) {
  await connectDB();
  const list = await TeamMember.find({ wing, isActive: true }).sort(sortSpec).lean();
  return serialize(
    list.map((m) => ({
      _id: m._id, wing: m.wing, state: m.state, district: m.district, name: m.name, designation: m.designation,
      photo: m.photo || '', facebook: m.facebook || '', instagram: m.instagram || '', twitter: m.twitter || '',
      phone: m.showContact ? m.phone || '' : '', email: m.showContact ? m.email || '' : '',
    }))
  );
}

export async function createTeamMember(data) {
  await connectDB();
  return serialize((await TeamMember.create(data)).toObject());
}

export async function updateTeamMember(id, data) {
  await connectDB();
  try {
    return serialize(await TeamMember.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean());
  } catch {
    return null;
  }
}

export async function deleteTeamMember(id) {
  await connectDB();
  try {
    return !!(await TeamMember.findByIdAndDelete(id));
  } catch {
    return false;
  }
}
