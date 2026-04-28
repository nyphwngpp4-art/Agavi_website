import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addDays } from 'date-fns'
import type { CadenceStep } from '@/types'

export async function GET(request: NextRequest) {
  const prospectId = request.nextUrl.searchParams.get('prospectId')
  const status = request.nextUrl.searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (prospectId) where.prospectId = prospectId
  if (status) where.status = status

  const assignments = await prisma.cadenceAssignment.findMany({
    where,
    include: {
      cadenceTemplate: true,
      prospect: true,
      stepLogs: { orderBy: { stepIndex: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: assignments })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { prospectId, cadenceTemplateId, startDate } = body

  const template = await prisma.cadenceTemplate.findUnique({
    where: { id: cadenceTemplateId },
  })

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const steps: CadenceStep[] = JSON.parse(template.steps)
  const start = startDate ? new Date(startDate) : new Date()

  const assignment = await prisma.cadenceAssignment.create({
    data: {
      prospectId,
      cadenceTemplateId,
      startDate: start,
      currentStep: 0,
      status: 'active',
      stepLogs: {
        create: steps.map((step, index) => ({
          stepIndex: index,
          status: 'pending',
          dueDate: addDays(start, step.dayOffset),
        })),
      },
    },
    include: {
      cadenceTemplate: true,
      stepLogs: true,
    },
  })

  return NextResponse.json({ data: assignment }, { status: 201 })
}
