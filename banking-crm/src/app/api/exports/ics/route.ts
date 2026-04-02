import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import ical, { ICalAlarmType } from 'ical-generator'

export async function GET(request: NextRequest) {
  const prospectId = request.nextUrl.searchParams.get('prospectId')

  const where: Record<string, unknown> = {
    followUpDate: { not: null },
  }
  if (prospectId) where.prospectId = prospectId

  const logs = await prisma.outreachLog.findMany({
    where,
    include: { prospect: true },
    orderBy: { followUpDate: 'asc' },
  })

  const calendar = ical({ name: 'Banking CRM Follow-Ups' })

  for (const log of logs) {
    if (!log.followUpDate) continue

    const startDate = new Date(log.followUpDate)
    startDate.setHours(9, 0, 0, 0) // Default to 9 AM

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + 30)

    const contactInfo = [
      log.contactName ? `Contact: ${log.contactName}` : '',
      log.prospect.cfoEmail ? `CFO Email: ${log.prospect.cfoEmail}` : '',
      log.prospect.cfoPhone ? `CFO Phone: ${log.prospect.cfoPhone}` : '',
      log.notes ? `\nPrevious notes: ${log.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    calendar.createEvent({
      start: startDate,
      end: endDate,
      summary: `Follow-up: ${log.prospect.companyName}`,
      description: contactInfo,
      alarms: [{ type: ICalAlarmType.display, trigger: 900 }], // 15 min before
    })
  }

  return new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': 'attachment; filename="follow-ups.ics"',
    },
  })
}
