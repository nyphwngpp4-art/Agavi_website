'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Send,
  Users,
  Shuffle,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
} from 'lucide-react'
import { cn, formatDate, getWinScoreColor } from '@/lib/utils'
import { RELATIONSHIP_MANAGERS } from '@/lib/constants'
import type { Prospect, RolloutBatchWithAssignments } from '@/types'

export default function RolloutPage() {
  const [batches, setBatches] = useState<RolloutBatchWithAssignments[]>([])
  const [unassigned, setUnassigned] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null)

  // Draft state
  const [draftName, setDraftName] = useState('')
  const [draftAssignments, setDraftAssignments] = useState<
    { prospectId: string; assignedRm: string; rankPosition: number }[]
  >([])

  useEffect(() => {
    Promise.all([
      fetch('/api/rollout').then((r) => r.json()),
      fetch('/api/prospects?rm=&stage=identified&sortBy=winScore&sortOrder=desc&limit=100').then((r) => r.json()),
    ]).then(([batchJson, prospectJson]) => {
      setBatches(batchJson.data)
      // Filter to truly unassigned prospects
      const allProspects = prospectJson.data as Prospect[]
      setUnassigned(allProspects.filter((p: Prospect) => !p.assignedRm))
      setLoading(false)
    })
  }, [])

  const startNewBatch = () => {
    const weekLabel = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    setDraftName(`Week of ${weekLabel}`)
    setDraftAssignments(
      unassigned.map((p, i) => ({
        prospectId: p.id,
        assignedRm: '',
        rankPosition: i,
      }))
    )
    setCreating(true)
  }

  const smartDistribute = () => {
    // Round-robin by RM workload
    const rmWorkload = RELATIONSHIP_MANAGERS.map((rm) => ({
      rm,
      count: draftAssignments.filter((a) => a.assignedRm === rm).length,
    }))

    setDraftAssignments((prev) =>
      prev.map((a, i) => {
        // Sort RMs by current count to balance
        rmWorkload.sort((x, y) => x.count - y.count)
        const nextRm = rmWorkload[0]
        nextRm.count++
        return { ...a, assignedRm: nextRm.rm }
      })
    )
  }

  const saveBatch = async () => {
    const assigned = draftAssignments.filter((a) => a.assignedRm)
    if (assigned.length === 0) {
      toast.error('Assign at least one prospect to an RM')
      return
    }

    try {
      // Create batch
      const res = await fetch('/api/rollout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draftName }),
      })
      const { data: batch } = await res.json()

      // Add assignments
      await fetch(`/api/rollout/${batch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments: assigned }),
      })

      toast.success('Rollout batch saved as draft')
      setCreating(false)
      // Refresh
      const batchRes = await fetch('/api/rollout').then((r) => r.json())
      setBatches(batchRes.data)
    } catch {
      toast.error('Failed to save batch')
    }
  }

  const distributeBatch = async (batchId: string) => {
    if (!confirm('Distribute this batch? This will assign RMs to all prospects in the batch.'))
      return

    try {
      await fetch(`/api/rollout/${batchId}/distribute`, { method: 'POST' })
      toast.success('Batch distributed! RM assignments updated.')
      const batchRes = await fetch('/api/rollout').then((r) => r.json())
      setBatches(batchRes.data)
    } catch {
      toast.error('Failed to distribute')
    }
  }

  const deleteBatch = async (batchId: string) => {
    if (!confirm('Delete this rollout batch?')) return
    await fetch(`/api/rollout/${batchId}`, { method: 'DELETE' })
    setBatches((prev) => prev.filter((b) => b.id !== batchId))
    toast.success('Batch deleted')
  }

  const inputClass =
    'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white focus:border-maroon focus:outline-none'
  const selectClass =
    'rounded-md border border-dark-border bg-dark-elevated px-2 py-1.5 text-xs text-white focus:border-maroon focus:outline-none'

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Create new batch */}
      {!creating ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {unassigned.length} unassigned prospect{unassigned.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={startNewBatch}
            disabled={unassigned.length === 0}
            className="flex items-center gap-2 rounded-md bg-maroon px-3 py-2 text-sm font-medium text-white hover:bg-maroon-600 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Rollout
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-maroon/30 bg-dark-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <input
              className={cn(inputClass, 'max-w-md')}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Batch name"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={smartDistribute}
                className="flex items-center gap-1.5 rounded-md border border-dark-border px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Shuffle className="h-3 w-3" /> Auto-Distribute
              </button>
              <button
                onClick={() => setCreating(false)}
                className="rounded-md border border-dark-border px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBatch}
                className="flex items-center gap-1.5 rounded-md bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-600 transition-colors"
              >
                Save Draft
              </button>
            </div>
          </div>

          {/* Prospect list with RM assignment */}
          <div className="space-y-2">
            {draftAssignments.map((assignment, index) => {
              const prospect = unassigned.find((p) => p.id === assignment.prospectId)
              if (!prospect) return null
              return (
                <div
                  key={prospect.id}
                  className="flex items-center gap-3 rounded-md border border-dark-border bg-dark-elevated px-4 py-2.5"
                >
                  <span className="w-6 text-center text-xs text-gray-600 font-mono">
                    {index + 1}
                  </span>
                  <span
                    className="font-mono text-sm font-medium"
                    style={{ color: getWinScoreColor(prospect.winScore) }}
                  >
                    {prospect.winScore}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {prospect.companyName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {prospect.revenue || 'No revenue'} &middot; {prospect.industry || 'No industry'}
                    </p>
                  </div>
                  <select
                    className={selectClass}
                    value={assignment.assignedRm}
                    onChange={(e) => {
                      setDraftAssignments((prev) =>
                        prev.map((a, i) =>
                          i === index ? { ...a, assignedRm: e.target.value } : a
                        )
                      )
                    }}
                  >
                    <option value="">Assign RM</option>
                    {RELATIONSHIP_MANAGERS.map((rm) => (
                      <option key={rm} value={rm}>{rm}</option>
                    ))}
                  </select>
                </div>
              )
            })}
            {draftAssignments.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">
                No unassigned prospects to distribute
              </p>
            )}
          </div>
        </div>
      )}

      {/* Batch history */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Rollout History</h2>
        {batches.length === 0 ? (
          <div className="rounded-lg border border-dark-border bg-dark-card p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-gray-600" />
            <p className="text-sm text-gray-500">No rollouts yet</p>
          </div>
        ) : (
          batches.map((batch) => {
            const isExpanded = expandedBatch === batch.id
            return (
              <div
                key={batch.id}
                className="rounded-lg border border-dark-border bg-dark-card"
              >
                <div
                  className="flex cursor-pointer items-center justify-between px-5 py-3 hover:bg-dark-hover transition-colors"
                  onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{batch.name}</p>
                      <p className="text-xs text-gray-500">
                        {batch.assignments.length} prospect{batch.assignments.length !== 1 ? 's' : ''} &middot;{' '}
                        {formatDate(batch.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {batch.status === 'distributed' ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                        <CheckCircle className="h-3 w-3" /> Distributed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            distributeBatch(batch.id)
                          }}
                          className="flex items-center gap-1 rounded-md bg-maroon px-2 py-1 text-xs text-white hover:bg-maroon-600 transition-colors"
                        >
                          <Send className="h-3 w-3" /> Distribute
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteBatch(batch.id)
                          }}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-dark-border px-5 py-3">
                    <div className="space-y-2">
                      {batch.assignments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-20 text-xs text-gray-500">
                            {a.assignedRm}
                          </span>
                          <span className="text-white">
                            {a.prospect.companyName}
                          </span>
                          <span className="text-xs text-gray-600">
                            {a.prospect.revenue}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
