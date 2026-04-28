import { useState } from 'react'

const SOURCES = ['Referral', 'Social Media', 'Cold Call', 'Website', 'Other']
const STATUSES = ['New', 'Contacted', 'Qualified', 'Closed Won', 'Closed Lost']

export default function LeadForm({ lead, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: lead?.name || '',
    phone: lead?.phone || '',
    email: lead?.email || '',
    company: lead?.company || '',
    source: lead?.source || 'Referral',
    status: lead?.status || 'New',
    notes: lead?.notes || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Name *</label>
        <input value={form.name} onChange={set('name')} required placeholder="Full name" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Phone</label>
        <input value={form.phone} onChange={set('phone')} type="tel" placeholder="(555) 123-4567" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Email</label>
        <input value={form.email} onChange={set('email')} type="email" placeholder="email@example.com" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Company</label>
        <input value={form.company} onChange={set('company')} placeholder="Company name" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Source</label>
        <select value={form.source} onChange={set('source')}>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Status</label>
        <select value={form.status} onChange={set('status')}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Any notes..." />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={saving || !form.name} className="btn-primary flex-1 disabled:opacity-50">
          {saving ? 'Saving...' : lead ? 'Update' : 'Add Lead'}
        </button>
      </div>
    </form>
  )
}
