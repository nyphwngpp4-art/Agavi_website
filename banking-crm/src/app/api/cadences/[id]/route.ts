import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const template = await prisma.cadenceTemplate.findUnique({
    where: { id: params.id },
    include: {
      assignments: {
        include: {
          prospect: true,
          stepLogs: true,
        },
      },
    },
  })

  if (!template) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ data: template })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const template = await prisma.cadenceTemplate.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description ?? undefined,
      steps: body.steps ? JSON.stringify(body.steps) : undefined,
    },
  })

  return NextResponse.json({ data: template })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.cadenceTemplate.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
