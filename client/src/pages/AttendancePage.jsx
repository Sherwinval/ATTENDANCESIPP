import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAttendanceRecords } from '../api/index.js';
import ActionPanel from '../components/ActionPanel.jsx';
import EventShell from '../components/EventShell.jsx';

const FILTERS = [
  { label: 'All Activity', value: '' },
  { label: 'Check-Ins', value: 'login' },
  { label: 'Check-Outs', value: 'logout' },
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
      badge="Admin Dashboard"
      intro="Live network web logs. Monitor footprints for the seminar."
      panelClassName="mx-auto w-full max-w-[95%] xl:max-w-7xl" /* Table gets maximum width */
      title="ATTENDANCE LOGS"
    >
      <ActionPanel
        footer="With Great Data Comes Great Responsibility"
        title="Network Traffic Feed"
      >
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {FILTERS.map((item) => {
            const isActive = item.value === filter;

            return (
              <button
                key={item.label}
                className={isActive ? 'button-primary !w-auto px-6 py-2 text-sm h-10' : 'button-secondary !w-auto px-6 py-2 text-sm h-10'}
                onClick={() => updateFilter(item.value)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-lg border border-[#0A3D91] bg-black/40 mt-4 shadow-xl">
          <div className="hidden grid-cols-[1fr_120px_200px] gap-4 border-b border-[#0A3D91] bg-[#0A3D91]/30 px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#8cb8ff] sm:grid" style={{ fontFamily: "'Oswald', sans-serif" }}>
            <span>Student Identity</span>
            <span>Status</span>
            <span>Timestamp</span>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-center text-lg font-bold text-[#ED1D24] animate-pulse">
              [ Scanning the web... ]
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="px-6 py-10 text-center text-lg font-bold text-red-500">{error}</div>
          ) : null}

          {!isLoading && !error && records.length === 0 ? (
            <div className="px-6 py-10 text-center text-lg font-medium text-slate-400">
              [ No digital footprints found. ]
            </div>
          ) : null}

          {!isLoading && !error && records.length > 0 ? (
            <div className="divide-y divide-[#0A3D91]/40">
              {records.map((record) => (
                <div
                  className="grid gap-2 px-6 py-4 text-base sm:grid-cols-[1fr_120px_200px] sm:gap-4 hover:bg-[#0A3D91]/20 transition"
                  key={record.id}
                >
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-white text-lg truncate">
                      {record.participant?.fullName || 'Unknown'}
                    </p>
                    <p className="font-mono text-sm text-red-400 mt-1">{record.studentId}</p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={
                        record.type === 'login'
                          ? 'text-xs font-bold uppercase tracking-wider text-emerald-400 border-l-4 border-emerald-500 pl-3 py-1'
                          : 'text-xs font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 py-1'
                      }
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {record.type === 'login' ? 'CHECK IN' : 'CHECK OUT'}
                    </span>
                  </div>
                  <div className="flex items-center font-mono text-sm text-slate-400">
                    {formatTimestamp(record.recordedAt)}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <p className="text-center text-base font-medium text-slate-400 mt-6">
          Missing identity?{' '}
          <Link className="text-[#ED1D24] hover:text-[#FF007F] font-bold transition underline underline-offset-4" to="/register">
            Register profile
          </Link>
        </p>
      </ActionPanel>
    </EventShell>
  );
}