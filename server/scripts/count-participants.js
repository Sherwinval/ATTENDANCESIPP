import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Participant from '../models/Participant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance-system';

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const count = await Participant.countDocuments();
  const sample = await Participant.findOne({ studentId: '2025-11183' });

  await mongoose.disconnect();

  console.log(`Participants in database: ${count}`);
  console.log(`Sample: ${sample?.fullName || 'not found'} (${sample?.studentId || 'n/a'})`);
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => {});
  console.error(error.message);
  process.exit(1);
});
