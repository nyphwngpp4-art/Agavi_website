import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatusBadge from '../components/StatusBadge'
import FilterPills from '../components/FilterPills'
import SearchBar from '../components/SearchBar'
import FAB from '../components/FAB'
import BottomSheet from '../components/BottomSheet'
import OrderDetail from './OrderDetail'
import OrderForm from './OrderForm'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = orders.filter((o) => {
    if (filter && o.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        o.customer_name.toLowerCase().includes(q) ||
        (o.order_number && o.order_number.toLowerCase().includes(q))
      )
    }
    return true
  })

  const generateOrderNumber = () => {
    const prefix = 'AG'
    const num = String(Math.floor(Math.random() * 100000)).padStart(5, '0')
    return `${prefix}-${num}`
  }

  const handleSave = async (data) => {
    if (!data.order_number) {
      data.order_number = generateOrderNumber()
    }
    if (editing) {
      await supabase.from('orders').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('orders').insert(data)
    }
    setShowForm(false)
    setEditing(null)
    fetchOrders()
  }

  const handleEdit = (order) => {
    setSelected(null)
    setEditing(order)
    setShowForm(true)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const formatAmount = (a) => a != null ? `$${Number(a).toFixed(2)}` : ''

  return (
    <div className="px-4 py-3 space-y-3">
      <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
      <FilterPills options={STATUSES} value={filter} onChange={setFilter} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-sm">{orders.length === 0 ? 'No orders yet' : 'No matching orders'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className="card w-full text-left flex items-center justify-between gap-3 active:bg-navy-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{order.customer_name}</p>
                <p className="text-sm text-gray-400">
                  #{order.order_number}
                  {order.amount != null && <span className="ml-2">{formatAmount(order.amount)}</span>}
                </p>
              </div>
              <div className="shrink-0 text-right flex flex-col items-end gap-1">
                <StatusBadge status={order.status} type="order" />
                <span className="text-[10px] text-gray-500">{formatDate(order.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <FAB onClick={() => { setEditing(null); setShowForm(true) }} />

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Order Details"
      >
        {selected && (
          <OrderDetail order={selected} onEdit={handleEdit} />
        )}
      </BottomSheet>

      <BottomSheet
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null) }}
        title={editing ? 'Edit Order' : 'New Order'}
      >
        <OrderForm
          order={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      </BottomSheet>
    </div>
  )
}
