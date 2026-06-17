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
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Names are required.';
    if (!STUDENT_ID_REGEX.test(form.studentId)) return 'Must match YYYY-NNNNN.';
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
      badge="Computer Programming Society"
      intro="Add your profile to the web before checking in."
      title="CREATE PROFILE"
    >
      <ActionPanel
        footer="With Great Data Comes Great Responsibility"
        title="Register Identity"
      >
        <form className="space-y-6 w-full max-w-5xl mx-auto" onSubmit={handleSubmit}>
          
          {/* Feedback messages moved to the top */}
          <div className="empty:hidden">
            {error ? <p className="feedback-error">{error}</p> : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="text-center">
              <label className="field-label" htmlFor="firstName">First Name</label>
              <input
                className="field text-xl"
                id="firstName"
                onChange={(event) => updateField('firstName', event.target.value)}
                value={form.firstName}
              />
            </div>
            <div className="text-center">
              <label className="field-label" htmlFor="lastName">Last Name</label>
              <input
                className="field text-xl"
                id="lastName"
                onChange={(event) => updateField('lastName', event.target.value)}
                value={form.lastName}
              />
            </div>
          </div>

          <div className="text-center">
            <label className="field-label" htmlFor="studentId">Student ID Number</label>
            <input
              className="field text-3xl tracking-widest"
              id="studentId"
              inputMode="numeric"
              maxLength={10}
              onChange={(event) => updateField('studentId', event.target.value)}
              placeholder="YYYY-NNNNN"
              value={form.studentId}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <button className="button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
            <Link className="button-secondary" to="/login">
              Cancel
            </Link>
          </div>
        </form>
      </ActionPanel>
    </EventShell>
  );
}