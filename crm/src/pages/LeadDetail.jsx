import StatusBadge from '../components/StatusBadge'

export default function LeadDetail({ lead, onEdit }) {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{lead.name}</h3>
          {lead.company && <p className="text-gray-400">{lead.company}</p>}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="btn-primary text-center text-sm flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            Call
          </a>
        )}
        {lead.phone && (
          <a href={`sms:${lead.phone}`} className="btn-secondary text-center text-sm flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            Text
          </a>
        )}
      </div>

      <div className="space-y-3">
        {lead.email && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Email</span>
            <p className="text-sm">{lead.email}</p>
          </div>
        )}
        {lead.phone && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Phone</span>
            <p className="text-sm">{lead.phone}</p>
          </div>
        )}
        {lead.source && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Source</span>
            <p className="text-sm">{lead.source}</p>
          </div>
        )}
        {lead.notes && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Notes</span>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Added</span>
          <p className="text-sm">{formatDate(lead.created_at)}</p>
        </div>
      </div>

      <button onClick={() => onEdit(lead)} className="btn-secondary w-full mt-2">
        Edit Lead
      </button>
    </div>
  )
}
