import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAttendanceRecords } from '../api/index.js';
import ActionPanel from '../components/ActionPanel.jsx';
import EventShell from '../components/EventShell.jsx';

const FILTERS = [
  { label: 'All activity', value: '' },
  { label: 'Logins', value: 'login' },
  { label: 'Logouts', value: 'logout' },
];

function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const filter = searchParams.get('type') || '';

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setIsLoading(true);
      setError('');

      try {
        const result = await getAttendanceRecords(filter);
        if (!cancelled) setRecords(result.records);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadRecords();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  function updateFilter(nextFilter) {
    if (!nextFilter) {
      setSearchParams({});
      return;
    }

    setSearchParams({ type: nextFilter });
  }

  return (
    <EventShell
      badge="Enterprise Event Operations"
      intro="Review recorded check-ins and check-outs from a single audit-ready view designed for front desk supervisors and event operations teams."
      meta={['Central attendance history', 'Timestamped activity log', 'Operational visibility']}
      panelClassName="mx-auto w-full max-w-6xl"
      title="Attendance Record"
    >
      <ActionPanel
        footer="Corporate attendance control"
        subtitle="Filter the live log by event type to confirm arrivals, departures, and attendance activity."
        title="Attendance Activity"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {FILTERS.map((item) => {
            const isActive = item.value === filter;

            return (
              <button
                key={item.label}
                className={isActive ? 'button-primary px-4 text-sm' : 'button-secondary px-4 text-sm'}
                onClick={() => updateFilter(item.value)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/60">
          <div className="hidden grid-cols-[1.3fr_160px_220px] gap-4 border-b border-slate-200/80 bg-white/80 px-5 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500 sm:grid">
            <span>Participant</span>
            <span>Activity</span>
            <span>Recorded</span>
          </div>

          {isLoading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-600">
              Loading attendance records...
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="px-5 py-10 text-center text-sm text-red-700">{error}</div>
          ) : null}

          {!isLoading && !error && records.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-600">
              No attendance records found for this filter.
            </div>
          ) : null}

          {!isLoading && !error && records.length > 0 ? (
            <div className="divide-y divide-slate-200/80">
              {records.map((record) => (
                <div
                  className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-[1.3fr_160px_220px] sm:gap-4"
                  key={record.id}
                >
                  <div>
                    <p className="font-semibold text-slate-950">
                      {record.participant?.fullName || 'Unknown participant'}
                    </p>
                    <p className="mt-1 text-slate-600">{record.studentId}</p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={
                        record.type === 'login'
                          ? 'rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700'
                          : 'rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700'
                      }
                    >
                      {record.type === 'login' ? 'Logged in' : 'Logged out'}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    {formatTimestamp(record.recordedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <p className="text-center text-sm text-slate-600">
          Missing someone from the list?{' '}
          <Link className="font-semibold text-accent hover:underline" to="/register">
            Register the participant
          </Link>
          .
        </p>
      </ActionPanel>
    </EventShell>
  );
}
