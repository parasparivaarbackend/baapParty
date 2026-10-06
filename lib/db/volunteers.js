import { connectDB, serialize } from './mongoose';
import Volunteer from '@/models/Volunteer';

export async function getVolunteers() {
  await connectDB();
  const list = await Volunteer.find().lean();
  const sorted = list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return serialize(sorted);
}

export async function createVolunteer(data) {
  await connectDB();
  const doc = await Volunteer.create(data);
  return serialize(doc.toObject());
}

export async function deleteVolunteer(id) {
  await connectDB();
  try {
    const res = await Volunteer.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
