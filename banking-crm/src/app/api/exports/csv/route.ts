import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'prospects' // prospects | activity

  if (type === 'activity') {
    const logs = await prisma.outreachLog.findMany({
      orderBy: { date: 'desc' },
      include: { prospect: true },
    })

    const headers = ['Date', 'Company', 'Tier', 'Type', 'Contact', 'Notes', 'Follow-Up Date']
    const rows = logs.map((l) => [
      new Date(l.date).toISOString().split('T')[0],
      l.prospect.companyName,
      l.tier,
      l.type,
      l.contactName || '',
      (l.notes || '').replace(/"/g, '""'),
      l.followUpDate ? new Date(l.followUpDate).toISOString().split('T')[0] : '',
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="outreach-activity.csv"',
      },
    })
  }

  // Default: prospects
  const rm = searchParams.get('rm') || undefined
  const stage = searchParams.get('stage') || undefined

  const where: Record<string, unknown> = {}
  if (rm) where.assignedRm = rm
  if (stage) where.stage = stage

  const prospects = await prisma.prospect.findMany({
    where,
    orderBy: { companyName: 'asc' },
  })

  const headers = [
    'Company Name', 'City', 'State', 'Revenue', 'Industry', 'Ownership',
    'Assigned RM', 'Stage', 'Priority', 'Win Score',
    'Owner Name', 'Owner Email', 'CEO Name', 'CEO Email',
    'CFO Name', 'CFO Email', 'Controller Name', 'Controller Email',
    'Current Bank', 'Loan Estimate', 'Notes',
  ]

  const rows = prospects.map((p) => [
    p.companyName, p.city, p.state, p.revenue || '',
    p.industry || '', p.ownershipType || '',
    p.assignedRm || '', p.stage, p.priority, p.winScore.toString(),
    p.ownerName || '', p.ownerEmail || '',
    p.ceoName || '', p.ceoEmail || '',
    p.cfoName || '', p.cfoEmail || '',
    p.controllerName || '', p.controllerEmail || '',
    p.currentBank || '', p.loanEstimate || '',
    (p.notes || '').replace(/"/g, '""'),
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="prospects.csv"',
    },
  })
}
