'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, Save, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  RELATIONSHIP_MANAGERS,
  REVENUE_RANGES,
  INDUSTRIES,
  OWNERSHIP_TYPES,
  CREDIT_FACILITY_TYPES,
  PRIORITIES,
  PIPELINE_STAGES,
  PROSPECT_SOURCES,
} from '@/lib/constants'
import type { Prospect } from '@/types'

type ProspectFormProps = {
  prospect?: Prospect
  mode: 'create' | 'edit'
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg border border-dark-border bg-dark-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-white hover:bg-dark-hover transition-colors rounded-t-lg"
      >
        {title}
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && <div className="border-t border-dark-border px-5 py-4">{children}</div>}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-400">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon'

const selectClass =
  'w-full rounded-md border border-dark-border bg-dark-elevated px-3 py-2 text-sm text-white focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon'

export function ProspectForm({ prospect, mode }: ProspectFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    companyName: prospect?.companyName || '',
    hqAddress: prospect?.hqAddress || '',
    city: prospect?.city || 'Phoenix',
    state: prospect?.state || 'AZ',
    revenue: prospect?.revenue || '',
    revenueMin: prospect?.revenueMin || null as number | null,
    revenueMax: prospect?.revenueMax || null as number | null,
    industry: prospect?.industry || '',
    sector: prospect?.sector || '',
    website: prospect?.website || '',
    linkedinUrl: prospect?.linkedinUrl || '',
    ownershipType: prospect?.ownershipType || '',
    ownerName: prospect?.ownerName || '',
    ownerEmail: prospect?.ownerEmail || '',
    ownerPhone: prospect?.ownerPhone || '',
    ownerLinkedin: prospect?.ownerLinkedin || '',
    cfoName: prospect?.cfoName || '',
    cfoEmail: prospect?.cfoEmail || '',
    cfoPhone: prospect?.cfoPhone || '',
    cfoLinkedin: prospect?.cfoLinkedin || '',
    controllerName: prospect?.controllerName || '',
    controllerEmail: prospect?.controllerEmail || '',
    controllerPhone: prospect?.controllerPhone || '',
    controllerLinkedin: prospect?.controllerLinkedin || '',
    ceoName: prospect?.ceoName || '',
    ceoEmail: prospect?.ceoEmail || '',
    ceoPhone: prospect?.ceoPhone || '',
    ceoLinkedin: prospect?.ceoLinkedin || '',
    currentBank: prospect?.currentBank || '',
    loanEstimate: prospect?.loanEstimate || '',
    treasuryServices: prospect?.treasuryServices || '',
    creditFacilityType: prospect?.creditFacilityType || '',
    assignedRm: prospect?.assignedRm || '',
    stage: prospect?.stage || 'identified',
    priority: prospect?.priority || 'medium',
    source: prospect?.source || 'manual',
    notes: prospect?.notes || '',
  })

  const update = (field: string, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRevenueChange = (label: string) => {
    const range = REVENUE_RANGES.find((r) => r.label === label)
    setForm((prev) => ({
      ...prev,
      revenue: label,
      revenueMin: range?.min || null,
      revenueMax: range?.max || null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName.trim()) {
      toast.error('Company name is required')
      return
    }

    setSaving(true)
    try {
      const url =
        mode === 'create'
          ? '/api/prospects'
          : `/api/prospects/${prospect?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to save prospect')

      const { data } = await res.json()
      toast.success(
        mode === 'create' ? 'Prospect created' : 'Prospect updated'
      )
      router.push(`/prospects/${data.id}`)
      router.refresh()
    } catch {
      toast.error('Failed to save prospect')
    } finally {
      setSaving(false)
    }
  }

  const ContactBlock = ({
    prefix,
    title,
  }: {
    prefix: string
    title: string
  }) => (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input
            className={inputClass}
            value={(form as unknown as Record<string, string>)[`${prefix}Name`] || ''}
            onChange={(e) => update(`${prefix}Name`, e.target.value)}
            placeholder="Full name"
          />
        </Field>
        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            value={(form as unknown as Record<string, string>)[`${prefix}Email`] || ''}
            onChange={(e) => update(`${prefix}Email`, e.target.value)}
            placeholder="email@company.com"
          />
        </Field>
        <Field label="Phone">
          <input
            className={inputClass}
            value={(form as unknown as Record<string, string>)[`${prefix}Phone`] || ''}
            onChange={(e) => update(`${prefix}Phone`, e.target.value)}
            placeholder="(602) 555-0100"
          />
        </Field>
        <Field label="LinkedIn">
          <input
            className={inputClass}
            value={
              (form as unknown as Record<string, string>)[`${prefix}Linkedin`] || ''
            }
            onChange={(e) => update(`${prefix}Linkedin`, e.target.value)}
            placeholder="linkedin.com/in/..."
          />
        </Field>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-4">
      <Section title="Company Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company Name *">
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
              placeholder="Company name"
              required
            />
          </Field>
          <Field label="Industry">
            <select
              className={selectClass}
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Revenue Range">
            <select
              className={selectClass}
              value={form.revenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
            >
              <option value="">Select range</option>
              {REVENUE_RANGES.map((r) => (
                <option key={r.label} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ownership Type">
            <select
              className={selectClass}
              value={form.ownershipType}
              onChange={(e) => update('ownershipType', e.target.value)}
            >
              <option value="">Select type</option>
              {OWNERSHIP_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="HQ Address">
            <input
              className={inputClass}
              value={form.hqAddress}
              onChange={(e) => update('hqAddress', e.target.value)}
              placeholder="Street address"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </Field>
            <Field label="State">
              <input
                className={inputClass}
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Website">
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Company LinkedIn">
            <input
              className={inputClass}
              value={form.linkedinUrl}
              onChange={(e) => update('linkedinUrl', e.target.value)}
              placeholder="linkedin.com/company/..."
            />
          </Field>
          <Field label="Sector">
            <input
              className={inputClass}
              value={form.sector}
              onChange={(e) => update('sector', e.target.value)}
              placeholder="Sub-industry or niche"
            />
          </Field>
        </div>
      </Section>

      <Section title="Key Contacts">
        <div className="space-y-6">
          <ContactBlock prefix="owner" title="Owner / Principal" />
          <div className="border-t border-dark-border" />
          <ContactBlock prefix="ceo" title="CEO" />
          <div className="border-t border-dark-border" />
          <ContactBlock prefix="cfo" title="CFO" />
          <div className="border-t border-dark-border" />
          <ContactBlock prefix="controller" title="Controller" />
        </div>
      </Section>

      <Section title="Banking Intelligence" defaultOpen={false}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current Bank">
            <input
              className={inputClass}
              value={form.currentBank}
              onChange={(e) => update('currentBank', e.target.value)}
              placeholder="e.g., Chase, Wells Fargo"
            />
          </Field>
          <Field label="Loan Estimate">
            <input
              className={inputClass}
              value={form.loanEstimate}
              onChange={(e) => update('loanEstimate', e.target.value)}
              placeholder="e.g., $5M revolver"
            />
          </Field>
          <Field label="Treasury Services">
            <input
              className={inputClass}
              value={form.treasuryServices}
              onChange={(e) => update('treasuryServices', e.target.value)}
              placeholder="e.g., ACH, wire, lockbox"
            />
          </Field>
          <Field label="Credit Facility Type">
            <select
              className={selectClass}
              value={form.creditFacilityType}
              onChange={(e) => update('creditFacilityType', e.target.value)}
            >
              <option value="">Select type</option>
              {CREDIT_FACILITY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Assignment & Pipeline">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Assigned RM">
            <select
              className={selectClass}
              value={form.assignedRm}
              onChange={(e) => update('assignedRm', e.target.value)}
            >
              <option value="">Unassigned</option>
              {RELATIONSHIP_MANAGERS.map((rm) => (
                <option key={rm} value={rm}>
                  {rm}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pipeline Stage">
            <select
              className={selectClass}
              value={form.stage}
              onChange={(e) => update('stage', e.target.value)}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              className={selectClass}
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select
              className={selectClass}
              value={form.source}
              onChange={(e) => update('source', e.target.value)}
            >
              <option value="">Select source</option>
              {PROSPECT_SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Notes">
            <textarea
              className={cn(inputClass, 'min-h-[80px] resize-y')}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="General notes about this prospect..."
            />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-dark-border px-4 py-2 text-sm text-gray-400 hover:bg-dark-hover hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-600 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === 'create' ? 'Create Prospect' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
