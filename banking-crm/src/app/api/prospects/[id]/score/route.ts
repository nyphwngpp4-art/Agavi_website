import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateWinScore } from '@/lib/scoring'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prospect = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: {
      outreachLogs: { orderBy: { date: 'desc' } },
      cadenceAssignments: {
        include: { stepLogs: true },
      },
    },
  })

  if (!prospect) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const winScore = calculateWinScore({
    prospect,
    outreachLogs: prospect.outreachLogs,
    cadenceAssignments: prospect.cadenceAssignments,
  })

  await prisma.prospect.update({
    where: { id: params.id },
    data: { winScore },
  })

  return NextResponse.json({ data: { winScore } })
}
