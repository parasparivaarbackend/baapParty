import { connectDB, serialize } from './mongoose';
import Contribution from '@/models/Contribution';

export async function getContributions() {
  await connectDB();
  const list = await Contribution.find().lean();
  const sorted = list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return serialize(sorted);
}

export async function getTotalContributions() {
  const list = await getContributions();
  return list.reduce((sum, c) => sum + Number(c.amount || 0), 0);
}

export async function createContribution(data) {
  await connectDB();
  const doc = await Contribution.create(data);
  return serialize(doc.toObject());
}

export async function deleteContribution(id) {
  await connectDB();
  try {
    const res = await Contribution.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
