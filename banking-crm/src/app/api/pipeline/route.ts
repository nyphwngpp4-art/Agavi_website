import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rm = searchParams.get('rm') || ''

  const where: Record<string, unknown> = {}
  if (rm) where.assignedRm = rm

  const prospects = await prisma.prospect.findMany({
    where,
    orderBy: { stageOrder: 'asc' },
    include: {
      outreachLogs: {
        orderBy: { date: 'desc' },
        take: 1,
      },
      _count: {
        select: { outreachLogs: true },
      },
    },
  })

  return NextResponse.json({ data: prospects })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { prospectId, stage, stageOrder } = body

  const prospect = await prisma.prospect.update({
    where: { id: prospectId },
    data: { stage, stageOrder },
  })

  return NextResponse.json({ data: prospect })
}
