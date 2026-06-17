import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import Participant from '../models/Participant.js';

const router = Router();
const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;

async function recordAttendance(req, res, next, type) {
  try {
    const studentId = req.body.studentId?.trim();

    if (!STUDENT_ID_REGEX.test(studentId || '')) {
      return res.status(400).json({
        message: 'Student ID must match YYYY-NNNNN, for example 2023-12345.',
      });
    }

    const participant = await Participant.findOne({ studentId });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found.' });
    }

    const lastAttendance = await Attendance.findOne({ participant: participant._id })
      .sort({ recordedAt: -1, createdAt: -1 })
      .lean();

    if (type === 'login' && lastAttendance?.type === 'login') {
      return res.status(409).json({
        message: 'Student is already logged in. Please log out before logging in again.',
      });
    }

    if (type === 'logout') {
      if (!lastAttendance) {
        return res.status(409).json({
          message: 'Student has no active login session to log out from.',
        });
      }

      if (lastAttendance.type === 'logout') {
        return res.status(409).json({
          message: 'Student is already logged out. Please log in before logging out again.',
        });
      }
    }

    const attendance = await Attendance.create({
      participant: participant._id,
      studentId,
      type,
    });

    return res.status(201).json({
      message: `Attendance ${type} recorded.`,
      attendanceId: attendance.id,
      recordedAt: attendance.recordedAt,
    });
  } catch (error) {
    return next(error);
  }
}

router.get('/attendance', async (req, res, next) => {
  try {
    const type = req.query.type?.trim();
    const filter = {};

    if (type) {
      if (!['login', 'logout'].includes(type)) {
        return res.status(400).json({ message: 'Attendance type must be login or logout.' });
      }

      filter.type = type;
    }

    const attendance = await Attendance.find(filter)
      .populate('participant', 'firstName lastName studentId')
      .sort({ recordedAt: -1, createdAt: -1 })
      .lean();

    return res.json({
      records: attendance.map((record) => ({
        id: record._id.toString(),
        type: record.type,
        studentId: record.studentId,
        recordedAt: record.recordedAt,
        participant: record.participant
          ? {
              firstName: record.participant.firstName,
              lastName: record.participant.lastName,
              fullName: `${record.participant.firstName} ${record.participant.lastName}`,
              studentId: record.participant.studentId,
            }
          : null,
      })),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', (req, res, next) => recordAttendance(req, res, next, 'login'));
router.post('/logout', (req, res, next) => recordAttendance(req, res, next, 'logout'));

export default router;
