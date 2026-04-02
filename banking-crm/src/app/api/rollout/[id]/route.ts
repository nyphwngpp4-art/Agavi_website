import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const batch = await prisma.rolloutBatch.findUnique({
    where: { id: params.id },
    include: {
      assignments: {
        include: { prospect: true },
        orderBy: { rankPosition: 'asc' },
      },
    },
  })

  if (!batch) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data: batch })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  // Update batch metadata
  if (body.name || body.notes !== undefined) {
    await prisma.rolloutBatch.update({
      where: { id: params.id },
      data: {
        name: body.name ?? undefined,
        notes: body.notes ?? undefined,
      },
    })
  }

  // Update assignments if provided
  if (body.assignments) {
    // Remove old assignments
    await prisma.rolloutAssignment.deleteMany({
      where: { rolloutBatchId: params.id },
    })

    // Create new ones
    if (body.assignments.length > 0) {
      await prisma.rolloutAssignment.createMany({
        data: body.assignments.map((a: { prospectId: string; assignedRm: string; rankPosition: number }) => ({
          rolloutBatchId: params.id,
          prospectId: a.prospectId,
          assignedRm: a.assignedRm,
          rankPosition: a.rankPosition,
        })),
      })
    }
  }

  const batch = await prisma.rolloutBatch.findUnique({
    where: { id: params.id },
    include: {
      assignments: {
        include: { prospect: true },
        orderBy: { rankPosition: 'asc' },
      },
    },
  })

  return NextResponse.json({ data: batch })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.rolloutBatch.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
