'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Edit,
  Trash2,
  Building2,
  Globe,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Linkedin,
  Landmark,
  ArrowLeft,
  ExternalLink,
  Plus,
} from 'lucide-react'
import { OutreachForm } from '@/components/outreach/outreach-form'
import { cn, formatDate, getWinScoreColor, getWinScoreLabel } from '@/lib/utils'
import { PIPELINE_STAGES, PRIORITIES, OUTREACH_TIERS, OUTREACH_TYPES, OWNERSHIP_TYPES } from '@/lib/constants'
import type { ProspectWithRelations } from '@/types'

function InfoRow({ icon: Icon, label, value, link }: { icon: React.ElementType; label: string; value?: string | null; link?: boolean }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        {link ? (
          <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-maroon-300 hover:underline flex items-center gap-1">
            {value} <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm text-white">{value}</p>
        )}
      </div>
    </div>
  )
}

function ContactCard({ title, name, email, phone, linkedin }: { title: string; name?: string | null; email?: string | null; phone?: string | null; linkedin?: string | null }) {
  if (!name && !email && !phone) return null
  return (
    <div className="rounded-lg border border-dark-border bg-dark-elevated p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
      {name && <p className="text-sm font-medium text-white">{name}</p>}
      {email && (
        <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-maroon-300 mt-1">
          <Mail className="h-3 w-3" /> {email}
        </a>
      )}
      {phone && (
        <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-maroon-300 mt-1">
          <Phone className="h-3 w-3" /> {phone}
        </a>
      )}
      {linkedin && (
        <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-maroon-300 mt-1">
          <Linkedin className="h-3 w-3" /> LinkedIn
        </a>
      )}
    </div>
  )
}

export default function ProspectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [prospect, setProspect] = useState<ProspectWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'contacts' | 'banking' | 'outreach' | 'cadences'>('overview')
  const [deleting, setDeleting] = useState(false)
  const [showOutreachForm, setShowOutreachForm] = useState(false)

  useEffect(() => {
    fetch(`/api/prospects/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setProspect(json.data)
        setLoading(false)
      })
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this prospect? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/prospects/${id}`, { method: 'DELETE' })
    toast.success('Prospect deleted')
    router.push('/prospects')
  }

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!prospect) return <div className="text-gray-500">Prospect not found</div>

  const stageInfo = PIPELINE_STAGES.find((s) => s.id === prospect.stage)
  const priorityInfo = PRIORITIES.find((p) => p.id === prospect.priority)
  const ownershipLabel = OWNERSHIP_TYPES.find((o) => o.id === prospect.ownershipType)?.label

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'banking', label: 'Banking' },
    { id: 'outreach', label: `Outreach (${prospect.outreachLogs.length})` },
    { id: 'cadences', label: `Cadences (${prospect.cadenceAssignments.length})` },
  ] as const

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.back()} className="mb-2 flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{prospect.companyName}</h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: stageInfo?.color + '20', color: stageInfo?.color }}
            >
              {stageInfo?.label}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
            {prospect.industry && <span>{prospect.industry}</span>}
            {prospect.revenue && <span>{prospect.revenue}</span>}
            {prospect.assignedRm && <span>RM: {prospect.assignedRm}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 text-right">
            <p className="text-xs text-gray-500">Win Score</p>
            <p className="text-xl font-bold font-mono" style={{ color: getWinScoreColor(prospect.winScore) }}>
              {prospect.winScore}
              <span className="ml-1 text-xs font-normal">{getWinScoreLabel(prospect.winScore)}</span>
            </p>
          </div>
          <Link
            href={`/prospects/${id}/edit`}
            className="flex items-center gap-1.5 rounded-md border border-dark-border px-3 py-2 text-sm text-gray-300 hover:bg-dark-hover hover:text-white transition-colors"
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-md border border-dark-border px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-dark-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              tab === t.id
                ? 'border-maroon text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-dark-border bg-dark-card p-5 space-y-1">
            <h3 className="mb-3 text-sm font-medium text-gray-400">Company Details</h3>
            <InfoRow icon={Building2} label="Company" value={prospect.companyName} />
            <InfoRow icon={MapPin} label="Location" value={prospect.city && prospect.state ? `${prospect.city}, ${prospect.state}` : null} />
            <InfoRow icon={MapPin} label="Address" value={prospect.hqAddress} />
            <InfoRow icon={DollarSign} label="Revenue" value={prospect.revenue} />
            <InfoRow icon={Building2} label="Industry" value={prospect.industry} />
            <InfoRow icon={Building2} label="Sector" value={prospect.sector} />
            <InfoRow icon={User} label="Ownership" value={ownershipLabel} />
            <InfoRow icon={Globe} label="Website" value={prospect.website} link />
            <InfoRow icon={Linkedin} label="LinkedIn" value={prospect.linkedinUrl} link />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-dark-border bg-dark-card p-5">
              <h3 className="mb-3 text-sm font-medium text-gray-400">Pipeline & Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Stage</p>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1" style={{ backgroundColor: stageInfo?.color + '20', color: stageInfo?.color }}>
                    {stageInfo?.label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: priorityInfo?.color }} />
                    <span className="text-sm text-white capitalize">{prospect.priority}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned RM</p>
                  <p className="text-sm text-white mt-1">{prospect.assignedRm || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm text-white capitalize mt-1">{prospect.source?.replace('_', ' ') || '—'}</p>
                </div>
              </div>
            </div>
            {prospect.notes && (
              <div className="rounded-lg border border-dark-border bg-dark-card p-5">
                <h3 className="mb-2 text-sm font-medium text-gray-400">Notes</h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{prospect.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ContactCard title="Owner / Principal" name={prospect.ownerName} email={prospect.ownerEmail} phone={prospect.ownerPhone} linkedin={prospect.ownerLinkedin} />
          <ContactCard title="CEO" name={prospect.ceoName} email={prospect.ceoEmail} phone={prospect.ceoPhone} linkedin={prospect.ceoLinkedin} />
          <ContactCard title="CFO" name={prospect.cfoName} email={prospect.cfoEmail} phone={prospect.cfoPhone} linkedin={prospect.cfoLinkedin} />
          <ContactCard title="Controller" name={prospect.controllerName} email={prospect.controllerEmail} phone={prospect.controllerPhone} linkedin={prospect.controllerLinkedin} />
          {!prospect.ownerName && !prospect.ceoName && !prospect.cfoName && !prospect.controllerName && (
            <p className="col-span-2 text-center text-sm text-gray-500 py-8">No contacts added yet</p>
          )}
        </div>
      )}

      {tab === 'banking' && (
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <h3 className="mb-3 text-sm font-medium text-gray-400">Banking Intelligence</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={Landmark} label="Current Bank" value={prospect.currentBank} />
            <InfoRow icon={DollarSign} label="Loan Estimate" value={prospect.loanEstimate} />
            <InfoRow icon={Landmark} label="Treasury Services" value={prospect.treasuryServices} />
            <InfoRow icon={Landmark} label="Credit Facility" value={prospect.creditFacilityType?.replace('_', ' ')} />
          </div>
          {!prospect.currentBank && !prospect.loanEstimate && !prospect.treasuryServices && (
            <p className="text-center text-sm text-gray-500 py-4">No banking intel added yet</p>
          )}
        </div>
      )}

      {tab === 'outreach' && (
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Outreach Timeline</h3>
            <button
              onClick={() => setShowOutreachForm(true)}
              className="flex items-center gap-1.5 rounded-md bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-600 transition-colors"
            >
              <Plus className="h-3 w-3" /> Log Outreach
            </button>
          </div>
          {prospect.outreachLogs.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No outreach logged yet</p>
          ) : (
            <div className="space-y-4">
              {prospect.outreachLogs.map((log) => {
                const tierInfo = OUTREACH_TIERS.find((t) => t.id === log.tier)
                const typeInfo = OUTREACH_TYPES.find((t) => t.id === log.type)
                return (
                  <div key={log.id} className="flex gap-3 border-l-2 pl-4 py-2" style={{ borderColor: tierInfo?.color }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: tierInfo?.color }}>{tierInfo?.label}</span>
                        <span className="text-xs text-gray-500">{typeInfo?.label}</span>
                        <span className="text-xs text-gray-600">{formatDate(log.date)}</span>
                      </div>
                      {log.contactName && <p className="text-xs text-gray-400 mt-0.5">Contact: {log.contactName}</p>}
                      {log.notes && <p className="text-sm text-gray-300 mt-1">{log.notes}</p>}
                      {log.followUpDate && (
                        <p className="text-xs text-maroon-300 mt-1">Follow-up: {formatDate(log.followUpDate)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'cadences' && (
        <div className="rounded-lg border border-dark-border bg-dark-card p-5">
          <h3 className="mb-4 text-sm font-medium text-gray-400">Cadence Assignments</h3>
          {prospect.cadenceAssignments.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No cadences assigned yet</p>
          ) : (
            <div className="space-y-4">
              {prospect.cadenceAssignments.map((ca) => (
                <div key={ca.id} className="rounded border border-dark-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">{ca.cadenceTemplate.name}</p>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      ca.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      ca.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    )}>
                      {ca.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Step {ca.currentStep + 1} of {ca.stepLogs.length} &middot; Started {formatDate(ca.startDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outreach form modal */}
      {showOutreachForm && (
        <OutreachForm
          prospectId={prospect.id}
          contactNames={[
            prospect.ownerName,
            prospect.ceoName,
            prospect.cfoName,
            prospect.controllerName,
          ].filter(Boolean) as string[]}
          onClose={() => setShowOutreachForm(false)}
          onSaved={() => {
            setShowOutreachForm(false)
            // Re-fetch prospect data
            fetch(`/api/prospects/${id}`)
              .then((r) => r.json())
              .then((json) => setProspect(json.data))
          }}
        />
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-600">
        Created {formatDate(prospect.createdAt)} &middot; Updated {formatDate(prospect.updatedAt)}
      </div>
    </div>
  )
}
