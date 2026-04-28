import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { REVENUE_RANGES } from '@/lib/constants'

function parseRevenue(raw: string): { revenue: string; revenueMin: number | null; revenueMax: number | null } {
  if (!raw) return { revenue: '', revenueMin: null, revenueMax: null }

  // Try to extract numeric value
  const cleaned = raw.replace(/[$,\s]/g, '').toLowerCase()
  let millions = 0

  if (cleaned.includes('b') || cleaned.includes('billion')) {
    millions = parseFloat(cleaned) * 1000
  } else if (cleaned.includes('m') || cleaned.includes('million')) {
    millions = parseFloat(cleaned)
  } else {
    const num = parseFloat(cleaned)
    if (num > 1000000) millions = num / 1000000
    else if (num > 1000) millions = num / 1000
    else millions = num
  }

  if (isNaN(millions)) return { revenue: raw, revenueMin: null, revenueMax: null }

  // Find matching range
  const range = REVENUE_RANGES.find((r) => millions >= r.min && millions <= r.max)
  return {
    revenue: range?.label || raw,
    revenueMin: range?.min || Math.floor(millions),
    revenueMax: range?.max || Math.ceil(millions),
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { rows } = body as { rows: Record<string, string>[] }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  const created = []
  const errors: { row: number; error: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row.companyName?.trim()) {
      errors.push({ row: i + 1, error: 'Missing company name' })
      continue
    }

    try {
      const revenueData = parseRevenue(row.revenue || '')

      const prospect = await prisma.prospect.create({
        data: {
          companyName: row.companyName.trim(),
          hqAddress: row.hqAddress || null,
          city: row.city || 'Phoenix',
          state: row.state || 'AZ',
          revenue: revenueData.revenue || null,
          revenueMin: revenueData.revenueMin,
          revenueMax: revenueData.revenueMax,
          industry: row.industry || null,
          sector: row.sector || null,
          website: row.website || null,
          linkedinUrl: row.linkedinUrl || null,
          ownershipType: row.ownershipType || null,
          ownerName: row.ownerName || null,
          ownerEmail: row.ownerEmail || null,
          ownerPhone: row.ownerPhone || null,
          ceoName: row.ceoName || null,
          ceoEmail: row.ceoEmail || null,
          ceoPhone: row.ceoPhone || null,
          cfoName: row.cfoName || null,
          cfoEmail: row.cfoEmail || null,
          cfoPhone: row.cfoPhone || null,
          controllerName: row.controllerName || null,
          controllerEmail: row.controllerEmail || null,
          controllerPhone: row.controllerPhone || null,
          currentBank: row.currentBank || null,
          loanEstimate: row.loanEstimate || null,
          treasuryServices: row.treasuryServices || null,
          notes: row.notes || null,
          source: 'csv_import',
        },
      })
      created.push(prospect)
    } catch (err) {
      errors.push({ row: i + 1, error: 'Database error' })
    }
  }

  return NextResponse.json({
    data: { created: created.length, errors },
  })
}
