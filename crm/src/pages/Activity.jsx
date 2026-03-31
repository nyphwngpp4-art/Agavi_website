import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BottomSheet from '../components/BottomSheet'

const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X/Twitter', 'Email']
const POST_TYPES = ['Educational', 'Testimonial', 'Product', 'Promotion', 'Story']

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day)
  start.setHours(0, 0, 0, 0)
  return start.toISOString().split('T')[0]
}

export default function Activity() {
  const [callSessions, setCallSessions] = useState([])
  const [socialPosts, setSocialPosts] = useState([])
  const [showCallForm, setShowCallForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const [calls, posts] = await Promise.all([
      supabase.from('call_sessions').select('*').order('session_date', { ascending: false }),
      supabase.from('social_posts').select('*').order('post_date', { ascending: false }),
    ])
    setCallSessions(calls.data || [])
    setSocialPosts(posts.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const weekStart = getWeekRange()
  const weekCalls = callSessions.filter((s) => s.session_date >= weekStart)
  const weekDials = weekCalls.reduce((sum, s) => sum + (s.dials || 0), 0)
  const weekConnects = weekCalls.reduce((sum, s) => sum + (s.connects || 0), 0)
  const connectRate = weekDials > 0 ? ((weekConnects / weekDials) * 100).toFixed(1) : '0'

  const weekPosts = socialPosts.filter((p) => p.post_date >= weekStart)
  const platformCounts = {}
  weekPosts.forEach((p) => {
    platformCounts[p.platform] = (platformCounts[p.platform] || 0) + 1
  })
  const mostActive = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]

  const handleSaveCall = async (data) => {
    await supabase.from('call_sessions').insert(data)
    setShowCallForm(false)
    fetchData()
  }

  const handleSavePost = async (data) => {
    await supabase.from('social_posts').insert(data)
    setShowPostForm(false)
    fetchData()
  }

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-4 py-3 space-y-6">
      {/* Cold Calling Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Cold Calling</h2>
          <button onClick={() => setShowCallForm(true)} className="text-accent text-sm font-medium">
            + Log Session
          </button>
        </div>

        <div className="card grid grid-cols-4 gap-2 text-center mb-3">
          <div>
            <p className="text-2xl font-bold text-accent">{weekDials}</p>
            <p className="text-[10px] text-gray-500 uppercase">Dials</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{weekConnects}</p>
            <p className="text-[10px] text-gray-500 uppercase">Connects</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{connectRate}%</p>
            <p className="text-[10px] text-gray-500 uppercase">Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{weekCalls.length}</p>
            <p className="text-[10px] text-gray-500 uppercase">Sessions</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Recent Sessions</p>
        {callSessions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No sessions logged yet</p>
        ) : (
          <div className="space-y-2">
            {callSessions.slice(0, 10).map((s) => (
              <div key={s.id} className="card py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{formatDate(s.session_date)}</span>
                  <span className="text-xs text-gray-500">
                    {s.dials} dials · {s.connects} connects · {s.voicemails || 0} VM
                  </span>
                </div>
                {s.notes && <p className="text-xs text-gray-400 mt-1">{s.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Social Media Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Social Media</h2>
          <button onClick={() => setShowPostForm(true)} className="text-accent text-sm font-medium">
            + Log Post
          </button>
        </div>

        <div className="card grid grid-cols-2 gap-4 text-center mb-3">
          <div>
            <p className="text-2xl font-bold text-accent">{weekPosts.length}</p>
            <p className="text-[10px] text-gray-500 uppercase">Posts This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{mostActive ? mostActive[0] : '—'}</p>
            <p className="text-[10px] text-gray-500 uppercase">Most Active</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Recent Posts</p>
        {socialPosts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No posts logged yet</p>
        ) : (
          <div className="space-y-2">
            {socialPosts.slice(0, 10).map((p) => (
              <div key={p.id} className="card py-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-navy-700 px-2 py-0.5 rounded-full">{p.platform}</span>
                    <span className="text-xs text-gray-400">{p.post_type}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(p.post_date)}</span>
                </div>
                {p.engagement_notes && <p className="text-xs text-gray-400 mt-1">{p.engagement_notes}</p>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-accent mt-1 inline-block">
                    View post
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call Session Form */}
      <BottomSheet open={showCallForm} onClose={() => setShowCallForm(false)} title="Log Calling Session">
        <CallSessionForm onSave={handleSaveCall} onCancel={() => setShowCallForm(false)} />
      </BottomSheet>

      {/* Social Post Form */}
      <BottomSheet open={showPostForm} onClose={() => setShowPostForm(false)} title="Log Social Post">
        <SocialPostForm onSave={handleSavePost} onCancel={() => setShowPostForm(false)} />
      </BottomSheet>
    </div>
  )
}

function CallSessionForm({ onSave, onCancel }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    session_date: today,
    dials: '',
    connects: '',
    voicemails: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      dials: parseInt(form.dials) || 0,
      connects: parseInt(form.connects) || 0,
      voicemails: parseInt(form.voicemails) || 0,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Date</label>
        <input type="date" value={form.session_date} onChange={set('session_date')} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Dials</label>
          <input type="number" value={form.dials} onChange={set('dials')} placeholder="0" inputMode="numeric" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Connects</label>
          <input type="number" value={form.connects} onChange={set('connects')} placeholder="0" inputMode="numeric" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Voicemails</label>
          <input type="number" value={form.voicemails} onChange={set('voicemails')} placeholder="0" inputMode="numeric" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Notes</label>
        <textarea value={form.notes} onChange={set('notes')} rows={2} placeholder="Outcome notes..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
          {saving ? 'Saving...' : 'Log Session'}
        </button>
      </div>
    </form>
  )
}

function SocialPostForm({ onSave, onCancel }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    platform: 'Instagram',
    post_type: 'Educational',
    post_date: today,
    engagement_notes: '',
    link: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Platform</label>
        <select value={form.platform} onChange={set('platform')}>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Post Type</label>
        <select value={form.post_type} onChange={set('post_type')}>
          {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Date</label>
        <input type="date" value={form.post_date} onChange={set('post_date')} />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Engagement Notes</label>
        <textarea value={form.engagement_notes} onChange={set('engagement_notes')} rows={2} placeholder="How did it perform?" />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Link (optional)</label>
        <input value={form.link} onChange={set('link')} type="url" placeholder="https://..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
          {saving ? 'Saving...' : 'Log Post'}
        </button>
      </div>
    </form>
  )
}
