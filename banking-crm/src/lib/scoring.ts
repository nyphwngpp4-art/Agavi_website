import { differenceInDays } from 'date-fns'
import type { Prospect, OutreachLog, CadenceAssignment, CadenceStepLog } from '@prisma/client'

type ScoringData = {
  prospect: Prospect
  outreachLogs: OutreachLog[]
  cadenceAssignments: (CadenceAssignment & { stepLogs: CadenceStepLog[] })[]
}

const STAGE_SCORES: Record<string, number> = {
  identified: 0,
  researching: 2,
  initial_outreach: 5,
  meeting_scheduled: 8,
  proposal: 11,
  negotiation: 13,
  won: 15,
  lost: 0,
}

export function calculateWinScore({ prospect, outreachLogs, cadenceAssignments }: ScoringData): number {
  let score = 0
  const now = new Date()

  // 1. Outreach volume (max 20 pts)
  const touchCount = outreachLogs.length
  if (touchCount >= 11) score += 20
  else if (touchCount >= 6) score += 15
  else if (touchCount >= 3) score += 10
  else if (touchCount >= 1) score += 5

  // 2. Multi-tier engagement (max 20 pts)
  const uniqueTiers = new Set(outreachLogs.map((l) => l.tier))
  score += Math.min(20, uniqueTiers.size * 7)

  // 3. Recency (max 15 pts)
  if (outreachLogs.length > 0) {
    const lastOutreach = new Date(outreachLogs[0].date)
    const daysSince = differenceInDays(now, lastOutreach)
    if (daysSince <= 7) score += 15
    else if (daysSince <= 14) score += 10
    else if (daysSince <= 30) score += 5
  }

  // 4. Pipeline stage advancement (max 15 pts)
  score += STAGE_SCORES[prospect.stage] || 0

  // 5. Meeting / response signals (max 15 pts)
  const hasInPerson = outreachLogs.some((l) => l.type === 'in_person')
  const hasFollowUps = outreachLogs.some((l) => l.followUpDate)
  if (hasInPerson) score += 10
  if (hasFollowUps) score += 5

  // 6. Cadence adherence (max 10 pts)
  const activeCadences = cadenceAssignments.filter((ca) => ca.status === 'active')
  if (activeCadences.length > 0) {
    const hasOverdue = activeCadences.some((ca) =>
      ca.stepLogs.some(
        (sl) => sl.status === 'pending' && sl.dueDate && new Date(sl.dueDate) < now
      )
    )
    score += hasOverdue ? 5 : 10
  }

  // 7. Data completeness (max 5 pts)
  const hasContacts = !!(prospect.cfoName || prospect.ceoName || prospect.controllerName || prospect.ownerName)
  const hasBankingIntel = !!(prospect.currentBank || prospect.loanEstimate || prospect.treasuryServices)
  if (hasContacts) score += 2
  if (hasBankingIntel) score += 2
  if (prospect.source) score += 1

  return Math.min(100, Math.max(0, score))
}
