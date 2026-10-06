import { connectDB, serialize } from './mongoose';
import Event from '@/models/Event';
import { events as seedEvents } from '@/data/content';

async function ensureSeeded() {
  const count = await Event.estimatedDocumentCount();
  if (count === 0 && seedEvents?.length) {
    await Event.insertMany(seedEvents.map((e) => ({ ...e })));
  }
}

export async function getEvents() {
  await connectDB();
  await ensureSeeded();
  const list = await Event.find().lean();
  // const sorted = list.sort((a, b) => new Date(a.date) - new Date(b.date));
  const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return serialize(sorted);
}

export async function getEvent(id) {
  await connectDB();
  try {
    const doc = await Event.findById(id).lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function createEvent(data) {
  await connectDB();
  const doc = await Event.create(data);
  return serialize(doc.toObject());
}

export async function updateEvent(id, data) {
  await connectDB();
  try {
    const doc = await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function deleteEvent(id) {
  await connectDB();
  try {
    const res = await Event.findByIdAndDelete(id);
    return !!res;
  } catch {
    return false;
  }
}
