import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerParticipant } from '../api/index.js';
import ActionPanel from '../components/ActionPanel.jsx';
import EventShell from '../components/EventShell.jsx';

const STUDENT_ID_REGEX = /^\d{4}-\d{5}$/;

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    studentId: location.state?.studentId || '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return 'First name and last name are required.';
    }

    if (!STUDENT_ID_REGEX.test(form.studentId)) {
      return 'Student ID must match YYYY-NNNNN, for example 2023-12345.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    setError(validationError);

    if (validationError) return;

    setIsSubmitting(true);

    try {
      await registerParticipant({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        studentId: form.studentId,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EventShell
      badge="Enterprise Event Operations"
      intro="Create a participant record directly from the front desk when a guest is not yet in the system, then return them to the attendance flow."
      meta={['On-site registration', 'Validated identity capture', 'Duplicate protection']}
      title="Participant Registration"
    >
      <ActionPanel
        footer="Corporate attendance control"
        subtitle="New participants are stored immediately and can proceed to login after registration."
        title="Register a Participant"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3 text-center">
              <label className="field-label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="field text-left text-base"
                id="firstName"
                onChange={(event) => updateField('firstName', event.target.value)}
                value={form.firstName}
              />
            </div>

            <div className="space-y-3 text-center">
              <label className="field-label" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="field text-left text-base"
                id="lastName"
                onChange={(event) => updateField('lastName', event.target.value)}
                value={form.lastName}
              />
            </div>
          </div>

          <div className="space-y-3 text-center">
            <label className="field-label" htmlFor="studentId">
              Student ID
            </label>
            <input
              className="field"
              id="studentId"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) => updateField('studentId', event.target.value)}
              placeholder="2023-12345"
              value={form.studentId}
            />
            <p className="text-xs text-slate-500">Format: YYYY-NNNNN</p>
          </div>

          {error ? <p className="feedback-error">{error}</p> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <button className="button-primary w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Registering...' : 'Register Participant'}
            </button>

            <Link className="button-secondary w-full" to="/login">
              Back to Login
            </Link>
          </div>
        </form>
      </ActionPanel>
    </EventShell>
  );
}
