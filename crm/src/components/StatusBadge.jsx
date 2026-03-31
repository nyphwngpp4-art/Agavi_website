const LEAD_COLORS = {
  'New': 'bg-accent/15 text-accent',
  'Contacted': 'bg-gold/15 text-gold',
  'Qualified': 'bg-blue-400/15 text-blue-400',
  'Closed Won': 'bg-emerald-400/15 text-emerald-400',
  'Closed Lost': 'bg-red-400/15 text-red-400',
}

const ORDER_COLORS = {
  'Pending': 'bg-gold/15 text-gold',
  'Processing': 'bg-accent/15 text-accent',
  'Shipped': 'bg-blue-400/15 text-blue-400',
  'Delivered': 'bg-emerald-400/15 text-emerald-400',
  'Cancelled': 'bg-red-400/15 text-red-400',
}

export default function StatusBadge({ status, type = 'lead' }) {
  const colors = type === 'order' ? ORDER_COLORS : LEAD_COLORS
  const cls = colors[status] || 'bg-gray-500/15 text-gray-400'

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}
