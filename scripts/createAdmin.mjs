// scripts/createAdmin.mjs
//
// Creates (or updates the password of) the admin account used to log into
// /admin. Run this once after setting up MongoDB:
//
//   ADMIN_USERNAME=youradmin ADMIN_PASSWORD=yourpassword npm run seed:admin
//
// Or just set ADMIN_USERNAME / ADMIN_PASSWORD in .env.local and run:
//
//   npm run seed:admin

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const username = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Add it to .env.local first.');
  process.exit(1);
}
if (!username || !password) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD (in .env.local or as env vars) before running this script.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD should be at least 8 characters.');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin user "${admin.username}" is ready. You can now log in at /admin/login.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
