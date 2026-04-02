import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const log = await prisma.outreachLog.update({
    where: { id: params.id },
    data: {
      tier: body.tier ?? undefined,
      type: body.type ?? undefined,
      date: body.date ? new Date(body.date) : undefined,
      notes: body.notes ?? undefined,
      followUpDate: body.followUpDate ? new Date(body.followUpDate) : undefined,
      contactName: body.contactName ?? undefined,
    },
  })

  return NextResponse.json({ data: log })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.outreachLog.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
