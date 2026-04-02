import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search') || ''
  const rm = searchParams.get('rm') || ''
  const stage = searchParams.get('stage') || ''
  const priority = searchParams.get('priority') || ''
  const industry = searchParams.get('industry') || ''
  const ownershipType = searchParams.get('ownershipType') || ''
  const revenueMin = searchParams.get('revenueMin')
  const revenueMax = searchParams.get('revenueMax')
  const sortBy = searchParams.get('sortBy') || 'updatedAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { companyName: { contains: search } },
      { ownerName: { contains: search } },
      { cfoName: { contains: search } },
      { ceoName: { contains: search } },
      { controllerName: { contains: search } },
      { notes: { contains: search } },
      { industry: { contains: search } },
    ]
  }

  if (rm) where.assignedRm = rm
  if (stage) where.stage = stage
  if (priority) where.priority = priority
  if (industry) where.industry = industry
  if (ownershipType) where.ownershipType = ownershipType
  if (revenueMin) where.revenueMin = { gte: parseInt(revenueMin) }
  if (revenueMax) where.revenueMax = { lte: parseInt(revenueMax) }

  const [prospects, total] = await Promise.all([
    prisma.prospect.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        outreachLogs: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        _count: {
          select: { outreachLogs: true },
        },
      },
    }),
    prisma.prospect.count({ where }),
  ])

  return NextResponse.json({ data: prospects, total, page, limit })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const prospect = await prisma.prospect.create({
    data: {
      companyName: body.companyName,
      hqAddress: body.hqAddress || null,
      city: body.city || 'Phoenix',
      state: body.state || 'AZ',
      revenue: body.revenue || null,
      revenueMin: body.revenueMin || null,
      revenueMax: body.revenueMax || null,
      industry: body.industry || null,
      sector: body.sector || null,
      website: body.website || null,
      linkedinUrl: body.linkedinUrl || null,
      ownershipType: body.ownershipType || null,
      ownerName: body.ownerName || null,
      ownerEmail: body.ownerEmail || null,
      ownerPhone: body.ownerPhone || null,
      ownerLinkedin: body.ownerLinkedin || null,
      cfoName: body.cfoName || null,
      cfoEmail: body.cfoEmail || null,
      cfoPhone: body.cfoPhone || null,
      cfoLinkedin: body.cfoLinkedin || null,
      controllerName: body.controllerName || null,
      controllerEmail: body.controllerEmail || null,
      controllerPhone: body.controllerPhone || null,
      controllerLinkedin: body.controllerLinkedin || null,
      ceoName: body.ceoName || null,
      ceoEmail: body.ceoEmail || null,
      ceoPhone: body.ceoPhone || null,
      ceoLinkedin: body.ceoLinkedin || null,
      currentBank: body.currentBank || null,
      loanEstimate: body.loanEstimate || null,
      treasuryServices: body.treasuryServices || null,
      creditFacilityType: body.creditFacilityType || null,
      assignedRm: body.assignedRm || null,
      stage: body.stage || 'identified',
      priority: body.priority || 'medium',
      source: body.source || 'manual',
      notes: body.notes || null,
    },
  })

  return NextResponse.json({ data: prospect }, { status: 201 })
}
