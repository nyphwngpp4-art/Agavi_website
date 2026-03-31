export default function FilterPills({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
          value === null
            ? 'bg-accent/15 text-accent border-accent/20'
            : 'bg-white/5 text-gray-400 border-white/5'
        }`}
      >
        All
      </button>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? null : opt)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            value === opt
              ? 'bg-accent/15 text-accent border-accent/20'
              : 'bg-white/5 text-gray-400 border-white/5'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
