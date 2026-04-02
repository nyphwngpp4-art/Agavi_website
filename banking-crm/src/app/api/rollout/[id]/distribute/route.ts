import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const batch = await prisma.rolloutBatch.findUnique({
    where: { id: params.id },
    include: { assignments: true },
  })

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (batch.status === 'distributed') {
    return NextResponse.json({ error: 'Already distributed' }, { status: 400 })
  }

  // Update each prospect's assignedRm based on rollout assignments
  const updates = batch.assignments.map((a) =>
    prisma.prospect.update({
      where: { id: a.prospectId },
      data: { assignedRm: a.assignedRm },
    })
  )

  await Promise.all(updates)

  // Mark batch as distributed
  const updated = await prisma.rolloutBatch.update({
    where: { id: params.id },
    data: {
      status: 'distributed',
      distributedAt: new Date(),
    },
    include: {
      assignments: {
        include: { prospect: true },
        orderBy: { rankPosition: 'asc' },
      },
    },
  })

  return NextResponse.json({ data: updated })
}
