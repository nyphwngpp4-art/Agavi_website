import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatusBadge from '../components/StatusBadge'

export default function OrderDetail({ order, onEdit }) {
  const [matchedLead, setMatchedLead] = useState(null)

  useEffect(() => {
    if (order.customer_name) {
      supabase
        .from('leads')
        .select('id, name')
        .ilike('name', order.customer_name)
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) setMatchedLead(data[0])
        })
    }
  }, [order.customer_name])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }) : '—'

  const formatAmount = (a) => a != null ? `$${Number(a).toFixed(2)}` : '—'

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{order.customer_name}</h3>
          <p className="text-gray-400">#{order.order_number}</p>
        </div>
        <StatusBadge status={order.status} type="order" />
      </div>

      {order.amount != null && (
        <p className="text-3xl font-bold text-accent">{formatAmount(order.amount)}</p>
      )}

      {order.tracking_number && order.tracking_link && (
        <a
          href={order.tracking_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.481 1.035-1.1l-.6-8.572A1.125 1.125 0 0 0 19.513 8H14.25m0 10.5V6.75a.75.75 0 0 0-.75-.75H3.375a1.125 1.125 0 0 0-1.125 1.125v11.25" />
          </svg>
          Track Package
        </a>
      )}

      <div className="space-y-3">
        {order.customer_email && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Email</span>
            <p className="text-sm">{order.customer_email}</p>
          </div>
        )}
        {order.customer_phone && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Phone</span>
            <p className="text-sm">{order.customer_phone}</p>
          </div>
        )}
        {order.product_description && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Product</span>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{order.product_description}</p>
          </div>
        )}
        {order.tracking_number && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Tracking #</span>
            <p className="text-sm">{order.tracking_number}</p>
          </div>
        )}
        {order.notes && (
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Notes</span>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Created</span>
            <p className="text-sm">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Updated</span>
            <p className="text-sm">{formatDate(order.updated_at)}</p>
          </div>
        </div>
      </div>

      {matchedLead && (
        <p className="text-xs text-accent">
          This customer matches lead: {matchedLead.name}
        </p>
      )}

      <button onClick={() => onEdit(order)} className="btn-secondary w-full mt-2">
        Edit Order
      </button>
    </div>
  )
}
