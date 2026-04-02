import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => void
    lastAutoTable: { finalY: number }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const isCallPrep = request.nextUrl.searchParams.get('callprep') === 'true'

  const prospect = await prisma.prospect.findUnique({
    where: { id: params.id },
    include: {
      outreachLogs: {
        orderBy: { date: 'desc' },
        take: isCallPrep ? 5 : 50,
      },
      cadenceAssignments: {
        include: { cadenceTemplate: true, stepLogs: true },
        where: { status: 'active' },
      },
    },
  })

  if (!prospect) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 15

  // Header
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text(isCallPrep ? 'CALL PREP SHEET — CONFIDENTIAL' : 'PROSPECT REPORT', 14, y)
  doc.text(format(new Date(), 'MMM d, yyyy'), pageWidth - 14, y, { align: 'right' })
  y += 10

  // Company name
  doc.setFontSize(18)
  doc.setTextColor(30)
  doc.text(prospect.companyName, 14, y)
  y += 8

  // Quick facts line
  doc.setFontSize(9)
  doc.setTextColor(100)
  const facts = [
    prospect.revenue,
    prospect.industry,
    prospect.city && prospect.state ? `${prospect.city}, ${prospect.state}` : null,
    prospect.assignedRm ? `RM: ${prospect.assignedRm}` : null,
    `Score: ${prospect.winScore}/100`,
  ].filter(Boolean).join(' | ')
  doc.text(facts, 14, y)
  y += 10

  // Key Contacts
  doc.setFontSize(11)
  doc.setTextColor(30)
  doc.text('KEY CONTACTS', 14, y)
  y += 2

  const contacts = [
    ['Owner', prospect.ownerName, prospect.ownerEmail, prospect.ownerPhone],
    ['CEO', prospect.ceoName, prospect.ceoEmail, prospect.ceoPhone],
    ['CFO', prospect.cfoName, prospect.cfoEmail, prospect.cfoPhone],
    ['Controller', prospect.controllerName, prospect.controllerEmail, prospect.controllerPhone],
  ].filter(([, name]) => name)

  if (contacts.length > 0) {
    doc.autoTable({
      startY: y,
      head: [['Role', 'Name', 'Email', 'Phone']],
      body: contacts,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontStyle: 'bold' },
      margin: { left: 14 },
    })
    y = doc.lastAutoTable.finalY + 8
  } else {
    y += 6
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('No contacts on file', 14, y)
    y += 8
  }

  // Banking Intel
  if (prospect.currentBank || prospect.loanEstimate || prospect.treasuryServices) {
    doc.setFontSize(11)
    doc.setTextColor(30)
    doc.text('BANKING INTELLIGENCE', 14, y)
    y += 6

    doc.setFontSize(8)
    doc.setTextColor(60)
    if (prospect.currentBank) { doc.text(`Current Bank: ${prospect.currentBank}`, 14, y); y += 5 }
    if (prospect.loanEstimate) { doc.text(`Loan Estimate: ${prospect.loanEstimate}`, 14, y); y += 5 }
    if (prospect.treasuryServices) { doc.text(`Treasury: ${prospect.treasuryServices}`, 14, y); y += 5 }
    if (prospect.creditFacilityType) { doc.text(`Credit Facility: ${prospect.creditFacilityType}`, 14, y); y += 5 }
    y += 4
  }

  // Outreach History
  if (prospect.outreachLogs.length > 0) {
    doc.setFontSize(11)
    doc.setTextColor(30)
    doc.text(isCallPrep ? 'RECENT OUTREACH' : 'OUTREACH HISTORY', 14, y)
    y += 2

    const outreachRows = prospect.outreachLogs.map((log) => [
      format(new Date(log.date), 'MM/dd/yy'),
      log.tier.toUpperCase(),
      log.type.replace('_', ' '),
      log.contactName || '',
      (log.notes || '').substring(0, 60) + ((log.notes || '').length > 60 ? '...' : ''),
    ])

    doc.autoTable({
      startY: y,
      head: [['Date', 'Tier', 'Type', 'Contact', 'Notes']],
      body: outreachRows,
      theme: 'plain',
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [240, 240, 240], textColor: [80, 80, 80], fontStyle: 'bold' },
      margin: { left: 14 },
      columnStyles: { 4: { cellWidth: 60 } },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // Call prep talking points
  if (isCallPrep) {
    doc.setFontSize(11)
    doc.setTextColor(30)
    doc.text('TALKING POINTS', 14, y)
    y += 6

    doc.setFontSize(8)
    doc.setTextColor(60)
    const points = []
    if (prospect.currentBank) points.push(`Ask about ${prospect.currentBank} relationship — any pain points?`)
    if (prospect.industry) points.push(`Reference ${prospect.industry} market trends in AZ`)
    if (prospect.treasuryServices) points.push(`Discuss treasury capabilities: ${prospect.treasuryServices}`)
    points.push('Mention BOK Financial local decision-making advantage')
    if (prospect.loanEstimate) points.push(`Explore credit needs around ${prospect.loanEstimate}`)

    points.forEach((point) => {
      doc.text(`• ${point}`, 14, y)
      y += 5
    })
    y += 4
  }

  // Notes
  if (prospect.notes) {
    doc.setFontSize(11)
    doc.setTextColor(30)
    doc.text('NOTES', 14, y)
    y += 6
    doc.setFontSize(8)
    doc.setTextColor(60)
    const lines = doc.splitTextToSize(prospect.notes, pageWidth - 28)
    doc.text(lines, 14, y)
  }

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  const filename = isCallPrep
    ? `call-prep-${prospect.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    : `prospect-${prospect.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
