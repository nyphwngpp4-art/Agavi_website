'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2, GripVertical, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OUTREACH_TIERS, OUTREACH_TYPES } from '@/lib/constants'
import type { CadenceStep } from '@/types'

type CadenceTemplateFormProps = {
  template?: {
    id: string
    name: string
    description: string | null
    steps: string
  }
  mode: 'create' | 'edit'
}

const inputClass =
  'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon'

const selectClass =
  'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon'

export function CadenceTemplateForm({ template, mode }: CadenceTemplateFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(template?.name || '')
  const [description, setDescription] = useState(template?.description || '')
  const [steps, setSteps] = useState<CadenceStep[]>(
    template ? JSON.parse(template.steps) : [
      { dayOffset: 0, tier: 'rm', type: 'linkedin', description: 'Initial LinkedIn connection' },
    ]
  )

  const addStep = () => {
    const lastOffset = steps.length > 0 ? steps[steps.length - 1].dayOffset : 0
    setSteps([
      ...steps,
      { dayOffset: lastOffset + 3, tier: 'rm', type: 'email', description: '' },
    ])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, field: keyof CadenceStep, value: string | number) => {
    setSteps(steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Cadence name is required')
      return
    }
    if (steps.length === 0) {
      toast.error('Add at least one step')
      return
    }

    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/cadences' : `/api/cadences/${template?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, steps }),
      })

      if (!res.ok) throw new Error()
      toast.success(mode === 'create' ? 'Cadence created' : 'Cadence updated')
      router.push('/cadences')
      router.refresh()
    } catch {
      toast.error('Failed to save cadence')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      {/* Name & description */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Cadence Name *</label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Standard Corporate Prospect"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">Description</label>
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this cadence sequence"
          />
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">Steps</h3>
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-1.5 rounded-md border border-dark-border px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <Plus className="h-3 w-3" /> Add Step
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const tierInfo = OUTREACH_TIERS.find((t) => t.id === step.tier)
            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-md border border-dark-border bg-dark-elevated p-3"
              >
                <div className="mt-1 text-gray-600">
                  <GripVertical className="h-4 w-4" />
                </div>

                {/* Step number */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dark-hover text-xs font-medium text-gray-400">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-[10px] text-gray-500">Day</label>
                    <input
                      type="number"
                      min={0}
                      className={cn(inputClass, 'text-center')}
                      value={step.dayOffset}
                      onChange={(e) => updateStep(index, 'dayOffset', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-gray-500">Tier</label>
                    <select
                      className={selectClass}
                      value={step.tier}
                      onChange={(e) => updateStep(index, 'tier', e.target.value)}
                    >
                      {OUTREACH_TIERS.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-gray-500">Type</label>
                    <select
                      className={selectClass}
                      value={step.type}
                      onChange={(e) => updateStep(index, 'type', e.target.value)}
                    >
                      {OUTREACH_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="mb-1 block text-[10px] text-gray-500">Description</label>
                    <input
                      className={inputClass}
                      value={step.description}
                      onChange={(e) => updateStep(index, 'description', e.target.value)}
                      placeholder="What to do in this step..."
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="mt-1 text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}

          {steps.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              No steps yet. Click &quot;Add Step&quot; to build your cadence.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
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
          {mode === 'create' ? 'Create Cadence' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
