'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProspectForm } from '@/components/prospects/prospect-form'
import type { Prospect } from '@/types'

export default function EditProspectPage() {
  const { id } = useParams()
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/prospects/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setProspect(json.data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!prospect) return <div className="text-gray-500">Prospect not found</div>

  return <ProspectForm prospect={prospect} mode="edit" />
}
