export default function ActionPanel({ title, subtitle, footer, children }) {
  return (
    <div className="panel-frame">
      <header className="space-y-2 border-b border-slate-200/80 px-6 py-6 text-center sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </header>

      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">{children}</div>

      {footer ? (
        <footer className="border-t border-slate-200/80 px-6 py-4 text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500 sm:px-8">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
