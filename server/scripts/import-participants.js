import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Participant from '../models/Participant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;
const defaultFilePath =
  'C:\\Users\\My Pc\\OneDrive - lpulaguna.edu.ph\\Desktop\\message.txt';

function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function parseName(rawName) {
  const name = normalizeWhitespace(rawName.replace(/\s*,\s*/g, ', '));
  const commaIndex = name.indexOf(',');

  if (commaIndex !== -1) {
    return {
      lastName: normalizeWhitespace(name.slice(0, commaIndex)),
      firstName: normalizeWhitespace(name.slice(commaIndex + 1)),
    };
  }

  const parts = name.split(' ');
  const lastName = parts.pop();

  return {
    firstName: normalizeWhitespace(parts.join(' ')),
    lastName,
  };
}

function parseLine(line) {
  const columns = line.split('\t').map((column) => column.trim());

  if (columns.length < 3) return null;

  const rawName = columns[1];
  const studentId = columns[2];

  if (!rawName || !STUDENT_ID_REGEX.test(studentId)) return null;

  const { firstName, lastName } = parseName(rawName);

  if (!firstName || !lastName) return null;

  return { firstName, lastName, studentId };
}

async function main() {
  const filePath = process.argv[2] || defaultFilePath;
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance-system';

  const content = await fs.readFile(filePath, 'utf8');
  const participants = content
    .split(/\r?\n/)
    .map(parseLine)
    .filter(Boolean);

  if (participants.length === 0) {
    throw new Error('No valid participant rows found.');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const result = await Participant.bulkWrite(
    participants.map((participant) => ({
      updateOne: {
        filter: { studentId: participant.studentId },
        update: { $setOnInsert: participant },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  await mongoose.disconnect();

  console.log(`Valid rows: ${participants.length}`);
  console.log(`Inserted: ${result.upsertedCount}`);
  console.log(`Already existed: ${participants.length - result.upsertedCount}`);
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => {});
  console.error(error.message);
  process.exit(1);
});
