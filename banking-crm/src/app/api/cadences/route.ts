import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const templates = await prisma.cadenceTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { assignments: true } },
    },
  })
  return NextResponse.json({ data: templates })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const template = await prisma.cadenceTemplate.create({
    data: {
      name: body.name,
      description: body.description || null,
      steps: JSON.stringify(body.steps),
    },
  })

  return NextResponse.json({ data: template }, { status: 201 })
}
