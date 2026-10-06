import { connectDB, serialize } from './mongoose';
import User from '@/models/User';

export async function getUsers() {
  await connectDB();
  const list = await User.find().select('-passwordHash').lean();
  const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return serialize(sorted);
}

export async function getUserByEmail(email) {
  await connectDB();
  return User.findOne({ email: email.toLowerCase().trim() }).lean();
}

export async function getUserById(id) {
  await connectDB();
  try {
    const doc = await User.findById(id).select('-passwordHash').lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function createUser(data) {
  await connectDB();
  const doc = await User.create(data);
  const plain = doc.toObject();
  delete plain.passwordHash;
  return serialize(plain);
}

export async function deleteUser(id) {
  await connectDB();
  try {
    const res = await User.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
