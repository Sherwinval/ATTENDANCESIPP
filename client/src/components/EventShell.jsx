import { NavLink } from 'react-router-dom';

// NEW: Massive background spider component
export function BackgroundSpider() {
  return (
    <div className="fixed -right-[15%] top-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[#ED1D24] opacity-10 pointer-events-none hidden lg:block z-0">
      <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Abdomen */}
        <path d="M50 45 L65 75 L50 95 L35 75 Z" />
        {/* Cephalothorax (Head) */}
        <path d="M50 25 L58 42 L42 42 Z" />
        
        {/* Right Legs */}
        <path d="M55 35 L75 15 L95 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M57 38 L85 35 L95 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M57 41 L80 60 L85 85" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M55 43 L65 70 L70 95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        
        {/* Left Legs */}
        <path d="M45 35 L25 15 L5 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M43 38 L15 35 L5 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M43 41 L20 60 L15 85" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M45 43 L35 70 L30 95" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
        
        {/* Mandibles */}
        <path d="M46 25 L44 18 L48 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M54 25 L56 18 L52 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const NAV_ITEMS = [
  { label: 'Check-In', to: '/login' },
  { label: 'Check-Out', to: '/logout' },
  { label: 'Web Logs', to: '/attendance' },
];

export function AttendanceNav() {
  return (
    <div className="mx-auto flex w-full max-w-2xl justify-center gap-2 rounded-lg bg-[#051F4A]/80 p-2 shadow-lg relative z-10 border border-[#0A3D91]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            `flex-1 rounded px-4 py-3 text-center text-base font-bold uppercase tracking-widest transition-all ${
              isActive
                ? 'bg-[#ED1D24] text-white shadow-md'
                : 'text-[#8cb8ff] hover:text-white hover:bg-white/10'
            }`
          }
          style={{ fontFamily: "'Oswald', sans-serif" }}
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
  intro,
  children,
  panelClassName = 'mx-auto w-full max-w-6xl', /* Expands the panel to be almost full screen */
}) {
  return (
    <main className="app-shell min-h-screen px-6 py-12 text-white flex flex-col items-center justify-center">
      <BackgroundSpider />
      {/* Wrapper is now vast (90vw) to fill the screen beautifully */}
      <div className="w-full max-w-[90vw] xl:max-w-[1600px] flex flex-col items-center relative z-10">
        
        <section className="w-full text-center">
          <span className="eyebrow-chip">{badge}</span>
          
          <h1 className="hero-title mx-auto mt-6 text-balance">
            {title.includes('CYBERSECURITY') ? (
              <>
                BEHIND THE MASK
                <span className="hero-subtitle">
                  CYBERSECURITY
                </span>
              </>
            ) : title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-slate-300">
            {intro}
          </p>
        </section>

        <section className="mt-12 w-full relative z-10 flex flex-col items-center">
          <AttendanceNav />
          <div className={`mt-8 ${panelClassName}`}>{children}</div>
        </section>
      </div>
    </main>
  );
}