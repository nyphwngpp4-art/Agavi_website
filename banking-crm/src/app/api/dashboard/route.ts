import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addDays, startOfDay } from 'date-fns'

export async function GET() {
  const now = new Date()
  const today = startOfDay(now)
  const nextWeek = addDays(today, 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalProspects,
    prospectsByStage,
    prospectsByRm,
    outreachThisMonth,
    upcomingFollowUps,
    overdueSteps,
    recentActivity,
    unassignedCount,
    allProspects,
  ] = await Promise.all([
    prisma.prospect.count(),
    prisma.prospect.groupBy({
      by: ['stage'],
      _count: true,
      _sum: { revenueMin: true },
    }),
    prisma.prospect.groupBy({
      by: ['assignedRm'],
      _count: true,
    }),
    prisma.outreachLog.groupBy({
      by: ['tier'],
      where: { date: { gte: monthStart } },
      _count: true,
    }),
    prisma.outreachLog.findMany({
      where: {
        followUpDate: { gte: today, lte: nextWeek },
      },
      include: { prospect: true },
      orderBy: { followUpDate: 'asc' },
      take: 20,
    }),
    prisma.cadenceStepLog.findMany({
      where: {
        status: 'pending',
        dueDate: { lt: now },
        assignment: { status: 'active' },
      },
      include: {
        assignment: {
          include: { prospect: true, cadenceTemplate: true },
        },
      },
      take: 20,
    }),
    prisma.outreachLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { prospect: true },
      take: 15,
    }),
    prisma.prospect.count({ where: { assignedRm: null } }),
    prisma.prospect.findMany({ select: { winScore: true } }),
  ])

  // Build stage stats
  const byStage: Record<string, { count: number; value: number }> = {}
  for (const row of prospectsByStage) {
    byStage[row.stage] = {
      count: row._count,
      value: row._sum.revenueMin || 0,
    }
  }

  // Build RM stats
  const byRm: Record<string, { count: number; outreachThisMonth: number }> = {}
  for (const row of prospectsByRm) {
    const rmName = row.assignedRm || 'Unassigned'
    byRm[rmName] = { count: row._count, outreachThisMonth: 0 }
  }

  // RM outreach stats from this month
  const rmOutreach = await prisma.outreachLog.findMany({
    where: { date: { gte: monthStart } },
    include: { prospect: { select: { assignedRm: true } } },
  })
  for (const log of rmOutreach) {
    const rm = log.prospect.assignedRm || 'Unassigned'
    if (byRm[rm]) byRm[rm].outreachThisMonth++
  }

  // Win score distribution
  const winScoreDistribution: Record<string, number> = {
    '0-19': 0, '20-39': 0, '40-59': 0, '60-79': 0, '80-100': 0,
  }
  for (const p of allProspects) {
    if (p.winScore >= 80) winScoreDistribution['80-100']++
    else if (p.winScore >= 60) winScoreDistribution['60-79']++
    else if (p.winScore >= 40) winScoreDistribution['40-59']++
    else if (p.winScore >= 20) winScoreDistribution['20-39']++
    else winScoreDistribution['0-19']++
  }

  return NextResponse.json({
    data: {
      totalProspects,
      byStage,
      byRm,
      outreachThisMonth: outreachThisMonth.reduce((sum, r) => sum + r._count, 0),
      upcomingFollowUps,
      overdueSteps,
      recentActivity,
      unassignedCount,
      winScoreDistribution,
    },
  })
}
