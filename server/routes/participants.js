import { Router } from 'express';
import Participant from '../models/Participant.js';

const router = Router();
const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;

function normalizeParticipant(participant) {
  return {
    id: participant.id,
    firstName: participant.firstName,
    lastName: participant.lastName,
    studentId: participant.studentId,
    fullName: participant.fullName,
  };
}

router.post('/check', async (req, res, next) => {
  try {
    const { studentId } = req.body;

    if (!STUDENT_ID_REGEX.test(studentId || '')) {
      return res.status(400).json({
        message: 'Student ID must match YYYY-NNNNN, for example 2023-12345.',
      });
    }

    const participant = await Participant.findOne({ studentId });

    if (!participant) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      participant: normalizeParticipant(participant),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const studentId = req.body.studentId?.trim();

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required.' });
    }

    if (!STUDENT_ID_REGEX.test(studentId || '')) {
      return res.status(400).json({
        message: 'Student ID must match YYYY-NNNNN, for example 2023-12345.',
      });
    }

    const existing = await Participant.findOne({ studentId });

    if (existing) {
      return res.status(409).json({ message: 'That Student ID is already registered.' });
    }

    const participant = await Participant.create({ firstName, lastName, studentId });

    return res.status(201).json({ participant: normalizeParticipant(participant) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'That Student ID is already registered.' });
    }

    return next(error);
  }
});

export default router;
