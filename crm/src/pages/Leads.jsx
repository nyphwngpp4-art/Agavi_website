import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatusBadge from '../components/StatusBadge'
import FilterPills from '../components/FilterPills'
import SearchBar from '../components/SearchBar'
import FAB from '../components/FAB'
import BottomSheet from '../components/BottomSheet'
import LeadDetail from './LeadDetail'
import LeadForm from './LeadForm'

const STATUSES = ['New', 'Contacted', 'Qualified', 'Closed Won', 'Closed Lost']

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [])

  const filtered = leads.filter((l) => {
    if (filter && l.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        l.name.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q))
      )
    }
    return true
  })

  const handleSave = async (data) => {
    if (editing) {
      await supabase.from('leads').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('leads').insert(data)
    }
    setShowForm(false)
    setEditing(null)
    fetchLeads()
  }

  const handleEdit = (lead) => {
    setSelected(null)
    setEditing(lead)
    setShowForm(true)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="px-4 py-3 space-y-3">
      <SearchBar value={search} onChange={setSearch} placeholder="Search leads..." />
      <FilterPills options={STATUSES} value={filter} onChange={setFilter} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">{leads.length === 0 ? 'No leads yet' : 'No matching leads'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelected(lead)}
              className="card w-full text-left flex items-center justify-between gap-3 active:bg-navy-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{lead.name}</p>
                {lead.company && (
                  <p className="text-sm text-gray-400 truncate">{lead.company}</p>
                )}
              </div>
              <div className="shrink-0 text-right flex flex-col items-end gap-1">
                <StatusBadge status={lead.status} />
                <span className="text-[10px] text-gray-500">{formatDate(lead.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <FAB onClick={() => { setEditing(null); setShowForm(true) }} />

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Lead Details"
      >
        {selected && (
          <LeadDetail lead={selected} onEdit={handleEdit} />
        )}
      </BottomSheet>

      <BottomSheet
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null) }}
        title={editing ? 'Edit Lead' : 'New Lead'}
      >
        <LeadForm
          lead={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      </BottomSheet>
    </div>
  )
}
