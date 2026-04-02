import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateWinScore } from '@/lib/scoring'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const prospectId = searchParams.get('prospectId')
  const tier = searchParams.get('tier')
  const type = searchParams.get('type')

  const where: Record<string, unknown> = {}
  if (prospectId) where.prospectId = prospectId
  if (tier) where.tier = tier
  if (type) where.type = type

  const logs = await prisma.outreachLog.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { prospect: true },
  })

  return NextResponse.json({ data: logs })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const log = await prisma.outreachLog.create({
    data: {
      prospectId: body.prospectId,
      tier: body.tier,
      type: body.type,
      date: body.date ? new Date(body.date) : new Date(),
      notes: body.notes || null,
      followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      contactName: body.contactName || null,
    },
  })

  // Recalculate win score
  const prospect = await prisma.prospect.findUnique({
    where: { id: body.prospectId },
    include: {
      outreachLogs: { orderBy: { date: 'desc' } },
      cadenceAssignments: { include: { stepLogs: true } },
    },
  })
  if (prospect) {
    const winScore = calculateWinScore({
      prospect,
      outreachLogs: prospect.outreachLogs,
      cadenceAssignments: prospect.cadenceAssignments,
    })
    await prisma.prospect.update({
      where: { id: body.prospectId },
      data: { winScore },
    })
  }

  return NextResponse.json({ data: log }, { status: 201 })
}
