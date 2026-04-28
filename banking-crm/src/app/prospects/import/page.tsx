'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { Upload, FileText, ArrowRight, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { autoMapColumns, PROSPECT_FIELDS } from '@/lib/csv-parser'

type Step = 'upload' | 'map' | 'preview' | 'importing' | 'done'

export default function ImportPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [importResult, setImportResult] = useState<{ created: number; errors: { row: number; error: string }[] } | null>(null)

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields || []
        setCsvHeaders(headers)
        setCsvData(result.data as Record<string, string>[])
        setColumnMapping(autoMapColumns(headers))
        setStep('map')
      },
      error: () => {
        toast.error('Failed to parse CSV file')
      },
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      handleFileUpload(file)
    } else {
      toast.error('Please upload a CSV file')
    }
  }

  const mappedRows = csvData.map((row) => {
    const mapped: Record<string, string> = {}
    for (const [csvCol, prospectField] of Object.entries(columnMapping)) {
      if (prospectField && row[csvCol]) {
        mapped[prospectField] = row[csvCol]
      }
    }
    return mapped
  })

  const handleImport = async () => {
    setStep('importing')
    try {
      const res = await fetch('/api/prospects/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: mappedRows }),
      })
      const json = await res.json()
      setImportResult(json.data)
      setStep('done')
      toast.success(`Imported ${json.data.created} prospects`)
    } catch {
      toast.error('Import failed')
      setStep('preview')
    }
  }

  const inputClass = 'rounded-md border border-dark-border bg-dark-elevated px-2 py-1.5 text-xs text-white focus:border-maroon focus:outline-none'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {(['upload', 'map', 'preview', 'done'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <ArrowRight className="h-3 w-3" />}
            <span className={cn(step === s ? 'text-maroon font-medium' : '', s === 'done' && step === 'done' ? 'text-green-400' : '')}>
              {s === 'upload' ? 'Upload' : s === 'map' ? 'Map Columns' : s === 'preview' ? 'Preview' : 'Complete'}
            </span>
          </div>
        ))}
      </div>

      {/* Upload step */}
      {step === 'upload' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-lg border-2 border-dashed border-dark-border bg-dark-card p-12 text-center hover:border-maroon/50 transition-colors"
        >
          <Upload className="mx-auto mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-400">
            Drop a CSV file here or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Supports RelPro, LinkedIn Sales Navigator, and custom exports
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />
        </div>
      )}

      {/* Column mapping step */}
      {step === 'map' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-dark-border bg-dark-card p-5">
            <h3 className="mb-4 text-sm font-medium text-white">
              Map CSV Columns ({csvHeaders.length} columns, {csvData.length} rows)
            </h3>
            <div className="space-y-2">
              {csvHeaders.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <span className="w-48 truncate text-sm text-gray-300">
                    {header}
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-600" />
                  <select
                    className={inputClass}
                    value={columnMapping[header] || ''}
                    onChange={(e) =>
                      setColumnMapping((prev) => ({
                        ...prev,
                        [header]: e.target.value,
                      }))
                    }
                  >
                    {PROSPECT_FIELDS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  {columnMapping[header] && (
                    <span className="text-xs text-gray-600">
                      e.g., &quot;{csvData[0]?.[header] || ''}&quot;
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep('upload')}
              className="rounded-md border border-dark-border px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep('preview')}
              className="rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600 transition-colors"
            >
              Preview Import
            </button>
          </div>
        </div>
      )}

      {/* Preview step */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-dark-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border bg-dark-card">
                  <th className="px-3 py-2 text-left text-xs text-gray-500">#</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Company</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-500">City</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Industry</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Revenue</th>
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {mappedRows.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b border-dark-border">
                    <td className="px-3 py-2 text-xs text-gray-600">{i + 1}</td>
                    <td className="px-3 py-2 text-white">{row.companyName || '—'}</td>
                    <td className="px-3 py-2 text-gray-400">{row.city || '—'}</td>
                    <td className="px-3 py-2 text-gray-400">{row.industry || '—'}</td>
                    <td className="px-3 py-2 text-gray-400">{row.revenue || '—'}</td>
                    <td className="px-3 py-2">
                      {row.companyName ? (
                        <span className="text-xs text-green-400">Ready</span>
                      ) : (
                        <span className="text-xs text-red-400">Missing name</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {mappedRows.length > 20 && (
            <p className="text-xs text-gray-500">
              Showing first 20 of {mappedRows.length} rows
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep('map')}
              className="rounded-md border border-dark-border px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              className="rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600 transition-colors"
            >
              Import {mappedRows.filter((r) => r.companyName).length} Prospects
            </button>
          </div>
        </div>
      )}

      {/* Importing */}
      {step === 'importing' && (
        <div className="rounded-lg border border-dark-border bg-dark-card p-12 text-center">
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-maroon" />
          <p className="text-sm text-gray-400">Importing prospects...</p>
        </div>
      )}

      {/* Done */}
      {step === 'done' && importResult && (
        <div className="rounded-lg border border-dark-border bg-dark-card p-8 text-center">
          <Check className="mx-auto mb-3 h-10 w-10 text-green-400" />
          <p className="text-lg font-medium text-white">
            {importResult.created} prospects imported
          </p>
          {importResult.errors.length > 0 && (
            <p className="mt-1 text-sm text-yellow-400">
              {importResult.errors.length} row{importResult.errors.length !== 1 ? 's' : ''} skipped
            </p>
          )}
          <button
            onClick={() => router.push('/prospects')}
            className="mt-4 rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600 transition-colors"
          >
            View Prospects
          </button>
        </div>
      )}
    </div>
  )
}
