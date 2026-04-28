import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateWinScore } from '@/lib/scoring'

export async function POST() {
  const prospects = await prisma.prospect.findMany({
    include: {
      outreachLogs: { orderBy: { date: 'desc' } },
      cadenceAssignments: {
        include: { stepLogs: true },
      },
    },
  })

  const updates = prospects.map((p) => {
    const winScore = calculateWinScore({
      prospect: p,
      outreachLogs: p.outreachLogs,
      cadenceAssignments: p.cadenceAssignments,
    })
    return prisma.prospect.update({
      where: { id: p.id },
      data: { winScore },
    })
  })

  await Promise.all(updates)

  return NextResponse.json({ data: { updated: updates.length } })
}
