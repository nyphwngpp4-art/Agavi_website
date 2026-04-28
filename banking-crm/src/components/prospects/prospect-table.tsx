'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Plus,
  ArrowUpDown,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { cn, formatDate, getWinScoreColor } from '@/lib/utils'
import {
  RELATIONSHIP_MANAGERS,
  PIPELINE_STAGES,
  PRIORITIES,
  INDUSTRIES,
} from '@/lib/constants'
import type { Prospect, OutreachLog } from '@/types'

type ProspectRow = Prospect & {
  outreachLogs: OutreachLog[]
  _count: { outreachLogs: number }
}

export function ProspectTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [prospects, setProspects] = useState<ProspectRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    rm: searchParams.get('rm') || '',
    stage: searchParams.get('stage') || '',
    priority: searchParams.get('priority') || '',
    industry: searchParams.get('industry') || '',
  })
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'updatedAt')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')

  const fetchProspects = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filters.rm) params.set('rm', filters.rm)
    if (filters.stage) params.set('stage', filters.stage)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.industry) params.set('industry', filters.industry)
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)

    const res = await fetch(`/api/prospects?${params.toString()}`)
    const json = await res.json()
    setProspects(json.data)
    setTotal(json.total)
    setLoading(false)
  }, [search, filters, sortBy, sortOrder])

  useEffect(() => {
    fetchProspects()
  }, [fetchProspects])

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const selectClass =
    'rounded-md border border-dark-border bg-dark-elevated px-2 py-1.5 text-xs text-white focus:border-maroon focus:outline-none'

  const stageColor = (stageId: string) =>
    PIPELINE_STAGES.find((s) => s.id === stageId)?.color || '#6B7280'

  const priorityColor = (id: string) =>
    PRIORITIES.find((p) => p.id === id)?.color || '#6B7280'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full rounded-md border border-dark-border bg-dark-elevated py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-maroon focus:outline-none"
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={selectClass} value={filters.rm} onChange={(e) => updateFilter('rm', e.target.value)}>
          <option value="">All RMs</option>
          {RELATIONSHIP_MANAGERS.map((rm) => (
            <option key={rm} value={rm}>{rm}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.stage} onChange={(e) => updateFilter('stage', e.target.value)}>
          <option value="">All Stages</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)}>
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <select className={selectClass} value={filters.industry} onChange={(e) => updateFilter('industry', e.target.value)}>
          <option value="">All Industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <Link
          href="/prospects/new"
          className="flex items-center gap-2 rounded-md bg-maroon px-3 py-2 text-sm font-medium text-white hover:bg-maroon-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Prospect
        </Link>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">{total} prospect{total !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-dark-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-card">
              {[
                { key: 'companyName', label: 'Company' },
                { key: 'revenue', label: 'Revenue' },
                { key: 'assignedRm', label: 'RM' },
                { key: 'stage', label: 'Stage' },
                { key: 'priority', label: 'Priority' },
                { key: 'winScore', label: 'Score' },
                { key: 'updatedAt', label: 'Last Activity' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-400 hover:text-white transition-colors"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className={cn('h-3 w-3', sortBy === col.key ? 'text-maroon' : 'text-gray-600')} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : prospects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <Building2 className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                  <p className="text-sm text-gray-500">No prospects found</p>
                  <Link
                    href="/prospects/new"
                    className="mt-2 inline-block text-sm text-maroon hover:underline"
                  >
                    Add your first prospect
                  </Link>
                </td>
              </tr>
            ) : (
              prospects.map((p) => {
                const lastOutreach = p.outreachLogs[0]
                return (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/prospects/${p.id}`)}
                    className="cursor-pointer border-b border-dark-border hover:bg-dark-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {p.companyName}
                        </span>
                        {p.website && (
                          <ExternalLink className="h-3 w-3 text-gray-500" />
                        )}
                      </div>
                      {p.industry && (
                        <p className="text-xs text-gray-500">{p.industry}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {p.revenue || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.assignedRm ? (
                        <span className="text-gray-300">{p.assignedRm}</span>
                      ) : (
                        <span className="text-gray-600">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: stageColor(p.stage) + '20',
                          color: stageColor(p.stage),
                        }}
                      >
                        {PIPELINE_STAGES.find((s) => s.id === p.stage)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: priorityColor(p.priority) }}
                      />
                      <span className="ml-1.5 text-xs text-gray-400 capitalize">
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm font-mono font-medium"
                        style={{ color: getWinScoreColor(p.winScore) }}
                      >
                        {p.winScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {lastOutreach
                        ? formatDate(lastOutreach.date)
                        : formatDate(p.updatedAt)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
