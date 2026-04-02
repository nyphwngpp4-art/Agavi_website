import { Suspense } from 'react'
import { ProspectTable } from '@/components/prospects/prospect-table'

export default function ProspectsPage() {
  return (
    <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
      <ProspectTable />
    </Suspense>
  )
}
