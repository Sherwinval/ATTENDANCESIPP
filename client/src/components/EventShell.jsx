import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Login', to: '/login' },
  { label: 'Logout', to: '/logout' },
  { label: 'Attendance', to: '/attendance' },
];

export function AttendanceNav() {
  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-3 rounded-full border border-slate-200/80 bg-white/80 p-1 shadow-sm backdrop-blur">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            `rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`
          }
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function EventShell({
  badge,
  title,
  meta,
  intro,
  children,
  panelClassName = 'mx-auto w-full max-w-2xl',
}) {
  return (
    <main className="app-shell min-h-screen px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col items-center justify-center">
        <section className="w-full text-center">
          <span className="eyebrow-chip">{badge}</span>
          <h1 className="hero-title mx-auto mt-6 max-w-4xl text-balance">{title}</h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
            {meta.map((item) => (
              <span
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 shadow-sm"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            {intro}
          </p>
        </section>

        <section className="mt-8 w-full">
          <AttendanceNav />
          <div className={`mt-8 ${panelClassName}`}>{children}</div>
        </section>
      </div>
    </main>
  );
}
