import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const batches = await prisma.rolloutBatch.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      assignments: {
        include: { prospect: true },
        orderBy: { rankPosition: 'asc' },
      },
    },
  })
  return NextResponse.json({ data: batches })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const batch = await prisma.rolloutBatch.create({
    data: {
      name: body.name,
      notes: body.notes || null,
      status: 'draft',
    },
  })

  return NextResponse.json({ data: batch }, { status: 201 })
}
