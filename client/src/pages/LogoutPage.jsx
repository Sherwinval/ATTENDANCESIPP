import { useState } from 'react';
import { Link } from 'react-router-dom';
import { checkParticipant, logAttendanceLogout } from '../api/index.js';
import ActionPanel from '../components/ActionPanel.jsx';
import EventShell from '../components/EventShell.jsx';

const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;

export default function LogoutPage() {
  const [studentId, setStudentId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!STUDENT_ID_REGEX.test(studentId)) {
      setError('Student ID must match YYYY-NNNNN, for example 2023-12345.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkParticipant(studentId);

      if (!result.exists) {
        setError('This Student ID is not registered yet.');
        return;
      }

      await logAttendanceLogout(studentId);
      setSuccess(`${result.participant.fullName} is now logged out.`);
      setStudentId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EventShell
      badge="Enterprise Event Operations"
      intro="Use the exit desk to capture departures cleanly, maintain an accurate headcount, and keep attendance logs ready for audit."
      meta={['Exit control', 'Attendance audit trail', 'Queue-ready processing']}
      title="Attendance Logout"
    >
      <ActionPanel
        footer="Corporate attendance control"
        subtitle="Enter a registered student ID to record participant departure."
        title="Participant Check-Out"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-3 text-center">
            <label className="field-label" htmlFor="studentId">
              Student ID
            </label>
            <input
              autoFocus
              className="field"
              id="studentId"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) => setStudentId(event.target.value)}
              placeholder="2023-12345"
              value={studentId}
            />
            <p className="text-xs text-slate-500">Format: YYYY-NNNNN</p>
          </div>

          {success ? <p className="feedback-success">{success}</p> : null}
          {error ? <p className="feedback-error">{error}</p> : null}

          <button className="button-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Recording logout...' : 'Record Logout'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Unregistered participant?{' '}
            <Link className="font-semibold text-accent hover:underline" to="/register">
              Open registration
            </Link>
          </p>
        </form>
      </ActionPanel>
    </EventShell>
  );
}
