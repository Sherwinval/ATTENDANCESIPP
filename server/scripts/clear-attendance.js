import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance-system';

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const result = await Attendance.deleteMany({});

  await mongoose.disconnect();

  console.log(`Deleted attendance records: ${result.deletedCount}`);
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => {});
  console.error(error.message);
  process.exit(1);
});
