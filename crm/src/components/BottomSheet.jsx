import { useEffect } from 'react'

export default function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="sheet-overlay absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="sheet-content absolute bottom-0 left-0 right-0 bg-navy-800 rounded-t-2xl max-h-[92vh] flex flex-col border-t border-line">
        <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4 pb-safe">
          {children}
        </div>
      </div>
    </div>
  )
}
