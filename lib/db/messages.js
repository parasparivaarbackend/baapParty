import { connectDB, serialize } from './mongoose';
import Message from '@/models/Message';

export async function getMessages() {
  await connectDB();
  const list = await Message.find().lean();
  const sorted = list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  return serialize(sorted);
}

export async function createMessage(data) {
  await connectDB();
  const doc = await Message.create({ read: false, ...data });
  return serialize(doc.toObject());
}

export async function updateMessage(id, data) {
  await connectDB();
  try {
    const doc = await Message.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function deleteMessage(id) {
  await connectDB();
  try {
    const res = await Message.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
