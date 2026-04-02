'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OUTREACH_TIERS, OUTREACH_TYPES } from '@/lib/constants'

type OutreachFormProps = {
  prospectId: string
  contactNames: string[]
  onClose: () => void
  onSaved: () => void
}

const inputClass =
  'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon'

export function OutreachForm({ prospectId, contactNames, onClose, onSaved }: OutreachFormProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    tier: 'rm',
    type: 'linkedin',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    notes: '',
    followUpDate: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospectId,
          ...form,
          followUpDate: form.followUpDate || null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Outreach logged')
      onSaved()
    } catch {
      toast.error('Failed to log outreach')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-dark-border bg-dark-card shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-border px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Log Outreach</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Tier selector */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-400">Outreach Tier</label>
            <div className="flex gap-2">
              {OUTREACH_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => update('tier', tier.id)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    form.tier === tier.id
                      ? 'border-transparent text-white'
                      : 'border-dark-border text-gray-400 hover:text-white'
                  )}
                  style={
                    form.tier === tier.id
                      ? { backgroundColor: tier.color + '25', borderColor: tier.color }
                      : undefined
                  }
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Type</label>
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
            >
              {OUTREACH_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
            />
          </div>

          {/* Contact reached */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Contact Reached</label>
            <select
              className={inputClass}
              value={form.contactName}
              onChange={(e) => update('contactName', e.target.value)}
            >
              <option value="">Select contact</option>
              {contactNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
              <option value="_other">Other (type below)</option>
            </select>
            {form.contactName === '_other' && (
              <input
                className={cn(inputClass, 'mt-2')}
                placeholder="Contact name"
                onChange={(e) => update('contactName', e.target.value)}
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Notes</label>
            <textarea
              className={cn(inputClass, 'min-h-[80px] resize-y')}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="What was discussed, key takeaways..."
            />
          </div>

          {/* Follow-up date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Follow-Up Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.followUpDate}
              onChange={(e) => update('followUpDate', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-dark-border px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Log Outreach
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
