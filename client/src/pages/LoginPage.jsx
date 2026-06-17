import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkParticipant, logAttendanceLogin } from '../api/index.js';
import ActionPanel from '../components/ActionPanel.jsx';
import EventShell from '../components/EventShell.jsx';

const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;

function formatStudentIdInput(value, previousValue = '') {
  const cleaned = value.replace(/[^\d-]/g, '');
  const digits = cleaned.replace(/-/g, '');

  if (digits.length <= 4) {
    if (
      digits.length === 4 &&
      (value.length > previousValue.length || (cleaned.length > 4 && cleaned[4] === '-'))
    ) {
      return `${digits}-`;
    }

    return digits;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 9)}`;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!STUDENT_ID_REGEX.test(studentId)) {
      setError('Use YYYY-NNNNN format.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await checkParticipant(studentId);

      if (!result.exists) {
        setError('Invalid Student ID!');
        return;
      }

      await logAttendanceLogin(studentId);
      setSuccess(`Welcome🕷, ${result.participant.fullName}!`);
      setStudentId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EventShell
      badge="Computer Programming Society"
      intro="Protecting Your Digital identity in the Next Generation"
      title="BEHIND THE MASK CYBERSECURITY"
    >
      <ActionPanel
        footer="With Great Data Comes Great Responsibility"
        title="Student Check-In"
        subtitle="Enter your credentials to swing into the seminar."
      >
        <form className="space-y-8 w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
          
          {/* Feedback messages moved ABOVE the input field */}
          <div className="empty:hidden">
            {success ? <p className="feedback-success">{success}</p> : null}
            {error ? <p className="feedback-error">{error}</p> : null}
          </div>

          <div className="text-center">
            <label className="field-label" htmlFor="studentId">
              Student ID Number
            </label>
            <input
              autoFocus
              className="field text-3xl tracking-widest"
              id="studentId"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) =>
                setStudentId((currentValue) => formatStudentIdInput(event.target.value, currentValue))
              }
              placeholder="YYYY-NNNNN"
              value={studentId}
            />
          </div>

          <button className="button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Scanning...' : 'Access Network'}
          </button>

          <p className="text-center text-sm font-semibold text-slate-400">
            Not registered in the database?{' '}
            <Link className="text-[#ED1D24] hover:text-[#FF007F] transition underline underline-offset-4" to="/register">
              Create Profile
            </Link>
          </p>
        </form>
      </ActionPanel>
    </EventShell>
  );
}
