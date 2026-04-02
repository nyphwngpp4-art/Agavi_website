'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Zap, Trash2, Edit } from 'lucide-react'
import { OUTREACH_TIERS, OUTREACH_TYPES } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import type { CadenceStep } from '@/types'

type TemplateRow = {
  id: string
  name: string
  description: string | null
  steps: string
  createdAt: string
  _count: { assignments: number }
}

export default function CadencesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cadences')
      .then((r) => r.json())
      .then((json) => {
        setTemplates(json.data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete cadence "${name}"?`)) return
    await fetch(`/api/cadences/${id}`, { method: 'DELETE' })
    setTemplates((prev) => prev.filter((t) => t.id !== id))
    toast.success('Cadence deleted')
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{templates.length} cadence template{templates.length !== 1 ? 's' : ''}</p>
        <Link
          href="/cadences/new"
          className="flex items-center gap-2 rounded-md bg-maroon px-3 py-2 text-sm font-medium text-white hover:bg-maroon-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Cadence
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-lg border border-dark-border bg-dark-card p-8 text-center">
          <Zap className="mx-auto mb-3 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-400">No cadence templates yet</p>
          <Link href="/cadences/new" className="mt-2 inline-block text-sm text-maroon hover:underline">
            Create your first cadence
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((template) => {
            const steps: CadenceStep[] = JSON.parse(template.steps)
            return (
              <div
                key={template.id}
                className="rounded-lg border border-dark-border bg-dark-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                    {template.description && (
                      <p className="mt-0.5 text-xs text-gray-500">{template.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>{steps.length} steps</span>
                      <span>{steps[steps.length - 1]?.dayOffset || 0} days</span>
                      <span>{template._count.assignments} active</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/cadences/new?edit=${template.id}`)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id, template.name)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Step preview */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {steps.map((step, i) => {
                    const tierInfo = OUTREACH_TIERS.find((t) => t.id === step.tier)
                    const typeInfo = OUTREACH_TYPES.find((t) => t.id === step.type)
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 rounded-md border border-dark-border bg-dark-elevated px-2 py-1 text-[11px]"
                      >
                        <span className="font-mono text-gray-500">D{step.dayOffset}</span>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierInfo?.color }} />
                        <span className="text-gray-400">{typeInfo?.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
