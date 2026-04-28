import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const stepLog = await prisma.cadenceStepLog.update({
    where: { id: params.id },
    data: {
      status: body.status ?? undefined,
      completedAt: body.status === 'completed' ? new Date() : undefined,
      outreachLogId: body.outreachLogId ?? undefined,
    },
  })

  // If completed, advance the assignment's currentStep
  if (body.status === 'completed' || body.status === 'skipped') {
    const assignment = await prisma.cadenceAssignment.findUnique({
      where: { id: stepLog.assignmentId },
      include: { stepLogs: { orderBy: { stepIndex: 'asc' } } },
    })

    if (assignment) {
      const allDone = assignment.stepLogs.every(
        (sl) => sl.id === stepLog.id ? true : sl.status !== 'pending'
      )
      const nextPending = assignment.stepLogs.find(
        (sl) => sl.id !== stepLog.id && sl.status === 'pending'
      )

      await prisma.cadenceAssignment.update({
        where: { id: assignment.id },
        data: {
          currentStep: nextPending?.stepIndex ?? assignment.stepLogs.length,
          status: allDone ? 'completed' : 'active',
        },
      })
    }
  }

  return NextResponse.json({ data: stepLog })
}
