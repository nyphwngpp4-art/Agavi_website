'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import { Building2, Phone, Calendar, ExternalLink } from 'lucide-react'
import { cn, formatDate, getWinScoreColor, formatCurrency } from '@/lib/utils'
import { PIPELINE_STAGES, RELATIONSHIP_MANAGERS, PRIORITIES } from '@/lib/constants'
import type { Prospect, OutreachLog } from '@/types'

type PipelineProspect = Prospect & {
  outreachLogs: OutreachLog[]
  _count: { outreachLogs: number }
}

export function PipelineBoard() {
  const router = useRouter()
  const [prospects, setProspects] = useState<PipelineProspect[]>([])
  const [loading, setLoading] = useState(true)
  const [rmFilter, setRmFilter] = useState('')

  const fetchProspects = useCallback(async () => {
    const params = new URLSearchParams()
    if (rmFilter) params.set('rm', rmFilter)
    const res = await fetch(`/api/pipeline?${params.toString()}`)
    const json = await res.json()
    setProspects(json.data)
    setLoading(false)
  }, [rmFilter])

  useEffect(() => {
    fetchProspects()
  }, [fetchProspects])

  const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = prospects
      .filter((p) => p.stage === stage.id)
      .sort((a, b) => a.stageOrder - b.stageOrder)
    return acc
  }, {} as Record<string, PipelineProspect[]>)

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return

    // Optimistic update
    const prospect = prospects.find((p) => p.id === draggableId)
    if (!prospect) return

    setProspects((prev) =>
      prev.map((p) =>
        p.id === draggableId
          ? { ...p, stage: destination.droppableId, stageOrder: destination.index }
          : p
      )
    )

    // Persist
    await fetch('/api/pipeline', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prospectId: draggableId,
        stage: destination.droppableId,
        stageOrder: destination.index,
      }),
    })
  }

  const selectClass =
    'rounded-md border border-dark-border bg-dark-elevated px-2 py-1.5 text-xs text-white focus:border-maroon focus:outline-none'

  if (loading) return <div className="text-gray-500">Loading pipeline...</div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          className={selectClass}
          value={rmFilter}
          onChange={(e) => setRmFilter(e.target.value)}
        >
          <option value="">All RMs</option>
          {RELATIONSHIP_MANAGERS.map((rm) => (
            <option key={rm} value={rm}>{rm}</option>
          ))}
        </select>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageProspects = grouped[stage.id] || []
            const totalRevenue = stageProspects.reduce(
              (sum, p) => sum + (p.revenueMin || 0),
              0
            )

            return (
              <div
                key={stage.id}
                className="flex w-72 shrink-0 flex-col rounded-lg border border-dark-border bg-dark-card"
              >
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-dark-border px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-xs font-semibold text-white">
                      {stage.label}
                    </span>
                    <span className="rounded-full bg-dark-elevated px-1.5 py-0.5 text-[10px] text-gray-400">
                      {stageProspects.length}
                    </span>
                  </div>
                  {totalRevenue > 0 && (
                    <span className="text-[10px] text-gray-500">
                      {formatCurrency(totalRevenue)}+
                    </span>
                  )}
                </div>

                {/* Cards */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex-1 space-y-2 p-2 min-h-[60px] transition-colors',
                        snapshot.isDraggingOver && 'bg-dark-hover/50'
                      )}
                    >
                      {stageProspects.map((prospect, index) => {
                        const lastOutreach = prospect.outreachLogs[0]
                        const priorityInfo = PRIORITIES.find(
                          (p) => p.id === prospect.priority
                        )

                        return (
                          <Draggable
                            key={prospect.id}
                            draggableId={prospect.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() =>
                                  router.push(`/prospects/${prospect.id}`)
                                }
                                className={cn(
                                  'cursor-pointer rounded-md border border-dark-border bg-dark-elevated p-3 transition-shadow hover:border-dark-muted',
                                  snapshot.isDragging && 'shadow-lg shadow-black/50'
                                )}
                              >
                                {/* Company name + priority */}
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-white leading-tight">
                                    {prospect.companyName}
                                  </p>
                                  <span
                                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                                    style={{
                                      backgroundColor: priorityInfo?.color,
                                    }}
                                  />
                                </div>

                                {/* Revenue + RM */}
                                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-500">
                                  {prospect.revenue && (
                                    <span>{prospect.revenue}</span>
                                  )}
                                  {prospect.assignedRm && (
                                    <span className="rounded bg-dark-hover px-1.5 py-0.5">
                                      {prospect.assignedRm}
                                    </span>
                                  )}
                                </div>

                                {/* Bottom row: score + last outreach */}
                                <div className="mt-2 flex items-center justify-between text-[11px]">
                                  <span
                                    className="font-mono font-medium"
                                    style={{
                                      color: getWinScoreColor(prospect.winScore),
                                    }}
                                  >
                                    {prospect.winScore}
                                  </span>
                                  {lastOutreach && (
                                    <span className="text-gray-600">
                                      {formatDate(lastOutreach.date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}
