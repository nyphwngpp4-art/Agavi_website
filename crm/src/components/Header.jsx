import { supabase } from '../lib/supabase'

export default function Header({ title }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-line px-4 py-3 pt-safe" style={{ background: 'rgba(2,9,19,.85)' }}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-display font-bold text-sm tracking-widest text-accent">AGAVI</span>
          <h1 className="text-xl font-semibold -mt-0.5">{title}</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-gray-500 text-xs font-medium px-2 py-1 rounded hover:text-gray-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
