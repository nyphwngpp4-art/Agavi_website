import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const assignment = await prisma.cadenceAssignment.update({
    where: { id: params.id },
    data: {
      status: body.status ?? undefined,
      currentStep: body.currentStep ?? undefined,
    },
  })

  return NextResponse.json({ data: assignment })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.cadenceAssignment.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
