import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prospect = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: {
      outreachLogs: {
        orderBy: { date: 'desc' },
      },
      cadenceAssignments: {
        include: {
          cadenceTemplate: true,
          stepLogs: {
            orderBy: { stepIndex: 'asc' },
          },
        },
      },
    },
  })

  if (!prospect) {
    return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
  }

  return NextResponse.json({ data: prospect })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const prospect = await prisma.prospect.update({
    where: { id: params.id },
    data: {
      companyName: body.companyName,
      hqAddress: body.hqAddress ?? undefined,
      city: body.city ?? undefined,
      state: body.state ?? undefined,
      revenue: body.revenue ?? undefined,
      revenueMin: body.revenueMin ?? undefined,
      revenueMax: body.revenueMax ?? undefined,
      industry: body.industry ?? undefined,
      sector: body.sector ?? undefined,
      website: body.website ?? undefined,
      linkedinUrl: body.linkedinUrl ?? undefined,
      ownershipType: body.ownershipType ?? undefined,
      ownerName: body.ownerName ?? undefined,
      ownerEmail: body.ownerEmail ?? undefined,
      ownerPhone: body.ownerPhone ?? undefined,
      ownerLinkedin: body.ownerLinkedin ?? undefined,
      cfoName: body.cfoName ?? undefined,
      cfoEmail: body.cfoEmail ?? undefined,
      cfoPhone: body.cfoPhone ?? undefined,
      cfoLinkedin: body.cfoLinkedin ?? undefined,
      controllerName: body.controllerName ?? undefined,
      controllerEmail: body.controllerEmail ?? undefined,
      controllerPhone: body.controllerPhone ?? undefined,
      controllerLinkedin: body.controllerLinkedin ?? undefined,
      ceoName: body.ceoName ?? undefined,
      ceoEmail: body.ceoEmail ?? undefined,
      ceoPhone: body.ceoPhone ?? undefined,
      ceoLinkedin: body.ceoLinkedin ?? undefined,
      currentBank: body.currentBank ?? undefined,
      loanEstimate: body.loanEstimate ?? undefined,
      treasuryServices: body.treasuryServices ?? undefined,
      creditFacilityType: body.creditFacilityType ?? undefined,
      assignedRm: body.assignedRm ?? undefined,
      stage: body.stage ?? undefined,
      stageOrder: body.stageOrder ?? undefined,
      priority: body.priority ?? undefined,
      source: body.source ?? undefined,
      notes: body.notes ?? undefined,
    },
  })

  return NextResponse.json({ data: prospect })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.prospect.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
