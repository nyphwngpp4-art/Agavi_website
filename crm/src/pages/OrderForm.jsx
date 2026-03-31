import { useState } from 'react'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderForm({ order, onSave, onCancel }) {
  const [form, setForm] = useState({
    customer_name: order?.customer_name || '',
    customer_email: order?.customer_email || '',
    customer_phone: order?.customer_phone || '',
    product_description: order?.product_description || '',
    amount: order?.amount != null ? String(order.amount) : '',
    order_number: order?.order_number || '',
    status: order?.status || 'Pending',
    tracking_number: order?.tracking_number || '',
    tracking_link: order?.tracking_link || '',
    notes: order?.notes || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      amount: form.amount ? parseFloat(form.amount) : null,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Customer Name *</label>
        <input value={form.customer_name} onChange={set('customer_name')} required placeholder="Customer name" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Email</label>
        <input value={form.customer_email} onChange={set('customer_email')} type="email" placeholder="email@example.com" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Phone</label>
        <input value={form.customer_phone} onChange={set('customer_phone')} type="tel" placeholder="(555) 123-4567" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Product / Description</label>
        <textarea value={form.product_description} onChange={set('product_description')} rows={2} placeholder="Products ordered..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Amount ($)</label>
          <input value={form.amount} onChange={set('amount')} type="number" step="0.01" placeholder="0.00" inputMode="decimal" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Order # (auto if blank)</label>
          <input value={form.order_number} onChange={set('order_number')} placeholder="AG-00001" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Status</label>
        <select value={form.status} onChange={set('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
        <input value={form.tracking_number} onChange={set('tracking_number')} placeholder="Tracking number" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Tracking Link</label>
        <input value={form.tracking_link} onChange={set('tracking_link')} type="url" placeholder="https://..." />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Order notes..." />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={saving || !form.customer_name} className="btn-primary flex-1 disabled:opacity-50">
          {saving ? 'Saving...' : order ? 'Update' : 'Add Order'}
        </button>
      </div>
    </form>
  )
}
