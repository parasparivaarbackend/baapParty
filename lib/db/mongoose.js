// lib/db/mongoose.js
//
// Single shared MongoDB connection, cached on `global` so that Next.js's
// dev-mode hot reloading doesn't open a fresh connection on every file save.
// Every function in lib/db/*.js calls connectDB() before touching a model.

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Add it to .env.local (see .env.local.example).'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

/** Turns a lean() Mongoose doc (or array) into the plain { id, ...fields } shape the app expects. */
export function serialize(doc) {
  if (!doc) return null;
  if (Array.isArray(doc)) return doc.map(serialize);
  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest };
}
