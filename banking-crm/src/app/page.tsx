'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { cn, formatDate, getWinScoreColor, formatCurrency } from '@/lib/utils'
import { PIPELINE_STAGES, OUTREACH_TIERS, OUTREACH_TYPES } from '@/lib/constants'
import type { OutreachLog, Prospect, CadenceStepLog, CadenceAssignment, CadenceTemplate } from '@/types'

type DashboardData = {
  totalProspects: number
  byStage: Record<string, { count: number; value: number }>
  byRm: Record<string, { count: number; outreachThisMonth: number }>
  outreachThisMonth: number
  upcomingFollowUps: (OutreachLog & { prospect: Prospect })[]
  overdueSteps: (CadenceStepLog & { assignment: CadenceAssignment & { prospect: Prospect; cadenceTemplate: CadenceTemplate } })[]
  recentActivity: (OutreachLog & { prospect: Prospect })[]
  unassignedCount: number
  winScoreDistribution: Record<string, number>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border border-dark-border bg-dark-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const activePipeline = Object.entries(data.byStage)
    .filter(([stage]) => !['won', 'lost', 'identified'].includes(stage))
    .reduce((sum, [, v]) => sum + v.count, 0)

  const activeStages = PIPELINE_STAGES.filter(s => !['won', 'lost'].includes(s.id))

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Total Prospects</p>
            <Building2 className="h-5 w-5 text-maroon" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{data.totalProspects}</p>
          {data.unassignedCount > 0 && (
            <p className="mt-1 text-xs text-yellow-400">
              {data.unassignedCount} unassigned
            </p>
          )}
        </div>
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Active Pipeline</p>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{activePipeline}</p>
        </div>
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Outreach This Month</p>
            <Users className="h-5 w-5 text-tier-president" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{data.outreachThisMonth}</p>
        </div>
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Overdue Steps</p>
            <Zap className="h-5 w-5 text-green-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{data.overdueSteps.length}</p>
          {data.overdueSteps.length > 0 && (
            <p className="mt-1 text-xs text-red-400">Needs attention</p>
          )}
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-400">Pipeline Overview</h2>
          <Link href="/pipeline" className="flex items-center gap-1 text-xs text-maroon hover:underline">
            View board <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex gap-2">
          {activeStages.map((stage) => {
            const stats = data.byStage[stage.id] || { count: 0, value: 0 }
            const maxCount = Math.max(...Object.values(data.byStage).map(v => v.count), 1)
            const height = Math.max(20, (stats.count / maxCount) * 100)
            return (
              <div key={stage.id} className="flex-1 text-center">
                <div className="flex items-end justify-center h-24 mb-2">
                  <div
                    className="w-full max-w-[40px] rounded-t transition-all"
                    style={{
                      height: `${height}%`,
                      backgroundColor: stage.color + '40',
                      borderTop: `2px solid ${stage.color}`,
                    }}
                  />
                </div>
                <p className="text-lg font-bold text-white">{stats.count}</p>
                <p className="text-[10px] text-gray-500 truncate">{stage.label}</p>
                {stats.value > 0 && (
                  <p className="text-[10px] text-gray-600">{formatCurrency(stats.value)}+</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming follow-ups */}
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-medium text-gray-400">Upcoming Follow-Ups (7 days)</h2>
          </div>
          {data.upcomingFollowUps.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No follow-ups scheduled</p>
          ) : (
            <div className="space-y-2">
              {data.upcomingFollowUps.map((log) => {
                const tierInfo = OUTREACH_TIERS.find((t) => t.id === log.tier)
                return (
                  <Link
                    key={log.id}
                    href={`/prospects/${log.prospectId}`}
                    className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated px-3 py-2 hover:bg-dark-hover transition-colors"
                  >
                    <div>
                      <p className="text-sm text-white">{log.prospect.companyName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tierInfo?.color }} />
                        <span className="text-xs text-gray-500">{tierInfo?.label}</span>
                        {log.contactName && <span className="text-xs text-gray-600">&middot; {log.contactName}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(log.followUpDate!)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Recent Activity</h2>
          {data.recentActivity.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {data.recentActivity.map((log) => {
                const tierInfo = OUTREACH_TIERS.find((t) => t.id === log.tier)
                const typeInfo = OUTREACH_TYPES.find((t) => t.id === log.type)
                return (
                  <Link
                    key={log.id}
                    href={`/prospects/${log.prospectId}`}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-dark-hover transition-colors"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: tierInfo?.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">
                        <span className="text-white font-medium">{log.prospect.companyName}</span>
                        {' '}— {typeInfo?.label}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-600 shrink-0">{formatDate(log.date)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Overdue cadence steps */}
        {data.overdueSteps.length > 0 && (
          <div className="rounded-lg border border-red-500/20 bg-dark-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-medium text-red-400">Overdue Cadence Steps</h2>
            </div>
            <div className="space-y-2">
              {data.overdueSteps.map((step) => (
                <Link
                  key={step.id}
                  href={`/prospects/${step.assignment.prospectId}`}
                  className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated px-3 py-2 hover:bg-dark-hover transition-colors"
                >
                  <div>
                    <p className="text-sm text-white">{step.assignment.prospect.companyName}</p>
                    <p className="text-xs text-gray-500">
                      {step.assignment.cadenceTemplate.name} — Step {step.stepIndex + 1}
                    </p>
                  </div>
                  <span className="text-xs text-red-400">
                    Due {step.dueDate ? formatDate(step.dueDate) : 'N/A'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* RM breakdown */}
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">RM Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(data.byRm)
              .filter(([name]) => name !== 'Unassigned')
              .map(([name, stats]) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{name}</p>
                    <p className="text-xs text-gray-500">
                      {stats.count} prospect{stats.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-300">
                      {stats.outreachThisMonth}
                    </p>
                    <p className="text-[10px] text-gray-600">touches this month</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Win score distribution */}
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <h2 className="text-sm font-medium text-gray-400 mb-4">Win Score Distribution</h2>
          <div className="space-y-2">
            {Object.entries(data.winScoreDistribution).map(([range, count]) => {
              const max = Math.max(...Object.values(data.winScoreDistribution), 1)
              const colors: Record<string, string> = {
                '0-19': '#EF4444',
                '20-39': '#F97316',
                '40-59': '#F59E0B',
                '60-79': '#10B981',
                '80-100': '#22C55E',
              }
              return (
                <div key={range} className="flex items-center gap-3">
                  <span className="w-12 text-xs text-gray-500 text-right">{range}</span>
                  <div className="flex-1 h-5 rounded bg-dark-elevated overflow-hidden">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${(count / max) * 100}%`,
                        backgroundColor: colors[range] + '60',
                        minWidth: count > 0 ? '4px' : '0',
                      }}
                    />
                  </div>
                  <span className="w-6 text-xs text-gray-400 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
