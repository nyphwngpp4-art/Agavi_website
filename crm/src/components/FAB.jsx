export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform border border-white/10"
      style={{
        background: 'linear-gradient(135deg, rgba(94,246,238,.25), rgba(240,194,110,.18))',
        boxShadow: '0 0 0 1px rgba(94,246,238,.15), 0 8px 32px rgba(0,0,0,.4)',
      }}
    >
      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  )
}
