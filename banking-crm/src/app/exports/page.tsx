'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Calendar,
  Download,
  Building2,
} from 'lucide-react'
import { RELATIONSHIP_MANAGERS, PIPELINE_STAGES } from '@/lib/constants'
import type { Prospect } from '@/types'

export default function ExportsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prospects?limit=500')
      .then((r) => r.json())
      .then((json) => {
        setProspects(json.data)
        setLoading(false)
      })
  }, [])

  const selectClass =
    'rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white focus:border-maroon focus:outline-none'

  const downloadFile = (url: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = ''
    a.click()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* CSV Exports */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Download className="h-4 w-4 text-green-400" />
          <h2 className="text-sm font-semibold text-white">CSV Exports</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated p-3">
            <div>
              <p className="text-sm text-white">All Prospects</p>
              <p className="text-xs text-gray-500">Full prospect list with contacts and banking intel</p>
            </div>
            <button
              onClick={() => downloadFile('/api/exports/csv')}
              className="rounded-md bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-600 transition-colors"
            >
              Download CSV
            </button>
          </div>
          <div className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated p-3">
            <div>
              <p className="text-sm text-white">Activity Log</p>
              <p className="text-xs text-gray-500">All outreach entries with dates, types, and notes</p>
            </div>
            <button
              onClick={() => downloadFile('/api/exports/csv?type=activity')}
              className="rounded-md bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-600 transition-colors"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* ICS Calendar */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Calendar Exports</h2>
        </div>
        <div className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated p-3">
          <div>
            <p className="text-sm text-white">All Follow-Ups</p>
            <p className="text-xs text-gray-500">ICS file with all scheduled follow-ups (import to Outlook)</p>
          </div>
          <button
            onClick={() => downloadFile('/api/exports/ics')}
            className="rounded-md bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-600 transition-colors"
          >
            Download ICS
          </button>
        </div>
      </div>

      {/* PDF Reports */}
      <div className="rounded-lg border border-dark-border bg-dark-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-maroon" />
          <h2 className="text-sm font-semibold text-white">PDF Reports</h2>
        </div>
        <p className="mb-3 text-xs text-gray-500">
          Select a prospect to generate a report or call prep sheet
        </p>
        {loading ? (
          <p className="text-sm text-gray-500">Loading prospects...</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {prospects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-dark-border bg-dark-elevated px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-gray-500" />
                  <span className="text-sm text-white">{p.companyName}</span>
                  <span className="text-xs text-gray-600">{p.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile(`/api/exports/pdf/${p.id}?callprep=true`)}
                    className="rounded border border-dark-border px-2 py-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                  >
                    Call Prep
                  </button>
                  <button
                    onClick={() => downloadFile(`/api/exports/pdf/${p.id}`)}
                    className="rounded border border-dark-border px-2 py-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                  >
                    Full Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
