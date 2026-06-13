// NEW: Animated Swinging Spider-Man
function SwingingSpidey() {
  return (
    <div className="absolute -top-2 right-8 sm:right-16 w-24 h-[380px] pointer-events-none z-0 animate-swing opacity-40 mix-blend-screen drop-shadow-[0_0_10px_rgba(237,29,36,0.6)]">
      {/* The Web String */}
      <div className="w-[1.5px] h-56 bg-white/60 mx-auto rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
      
      {/* Upside Down Spider-Man SVG */}
      <svg className="w-16 h-20 mx-auto -mt-1 text-[#ED1D24]" viewBox="0 0 100 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Feet/Calves wrapped around web */}
        <path d="M45 0 L45 20 L50 30 L55 20 L55 0 Z" fill="#0A3D91"/>
        {/* Thighs */}
        <path d="M40 50 L50 30 L60 50 Z" fill="#0A3D91"/>
        {/* Torso */}
        <path d="M35 75 L40 50 L60 50 L65 75 Z" fill="#ED1D24"/>
        {/* Arms crossed/hanging */}
        <path d="M35 75 L25 45 L35 40 L40 50 Z" fill="#ED1D24"/>
        <path d="M65 75 L75 45 L65 40 L60 50 Z" fill="#ED1D24"/>
        {/* Head */}
        <ellipse cx="50" cy="92" rx="15" ry="18" fill="#ED1D24"/>
        {/* Iconic White Eyes */}
        <path d="M48 103 C40 103 35 93 37 88 C44 93 48 98 48 103 Z" fill="white"/>
        <path d="M52 103 C60 103 65 93 63 88 C56 93 52 98 52 103 Z" fill="white"/>
      </svg>
    </div>
  );
}

export default function ActionPanel({ title, subtitle, footer, children }) {
  return (
    <div className="panel-frame relative z-10 w-full mx-auto shadow-2xl overflow-hidden">
      
      {/* Background Decals */}
      <SwingingSpidey />

      <header className="relative z-10 px-8 py-8 text-center sm:px-12 border-b border-red-900/40 bg-black/40 backdrop-blur-sm">
        <h2 className="text-4xl sm:text-5xl font-black tracking-wide text-white uppercase italic" style={{fontFamily: "'Oswald', sans-serif"}}>
          {title}
        </h2>
        {subtitle ? <p className="text-base sm:text-lg font-medium text-slate-300 mt-2">{subtitle}</p> : null}
      </header>

      <div className="relative z-10 space-y-8 px-8 py-10 sm:px-12 sm:py-12">
        {children}
      </div>

      {footer ? (
        <footer className="relative z-10 bg-black/80 px-8 py-4 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 border-t border-red-900/30">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}