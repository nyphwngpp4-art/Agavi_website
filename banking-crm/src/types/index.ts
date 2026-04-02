import type { Prospect, OutreachLog, CadenceTemplate, CadenceAssignment, CadenceStepLog, RolloutBatch, RolloutAssignment } from '@prisma/client'

// Re-export Prisma types
export type { Prospect, OutreachLog, CadenceTemplate, CadenceAssignment, CadenceStepLog, RolloutBatch, RolloutAssignment }

// Prospect with relations
export type ProspectWithRelations = Prospect & {
  outreachLogs: OutreachLog[]
  cadenceAssignments: (CadenceAssignment & {
    cadenceTemplate: CadenceTemplate
    stepLogs: CadenceStepLog[]
  })[]
}

// Prospect list item (lighter than full relations)
export type ProspectListItem = Prospect & {
  _count: {
    outreachLogs: number
  }
  lastOutreach?: OutreachLog | null
  nextFollowUp?: OutreachLog | null
}

// Cadence template step shape (stored as JSON)
export type CadenceStep = {
  dayOffset: number
  tier: 'rm' | 'leader' | 'president'
  type: 'linkedin' | 'email' | 'call' | 'in_person' | 'letter'
  description: string
}

// Dashboard stats
export type DashboardStats = {
  totalProspects: number
  byStage: Record<string, number>
  byRm: Record<string, { count: number; outreachThisMonth: number }>
  upcomingFollowUps: (OutreachLog & { prospect: Prospect })[]
  overdueSteps: (CadenceStepLog & {
    assignment: CadenceAssignment & { prospect: Prospect; cadenceTemplate: CadenceTemplate }
  })[]
  recentActivity: (OutreachLog & { prospect: Prospect })[]
  unassignedCount: number
  winScoreDistribution: Record<string, number>
  pipelineValue: Record<string, number>
}

// Rollout batch with relations
export type RolloutBatchWithAssignments = RolloutBatch & {
  assignments: (RolloutAssignment & { prospect: Prospect })[]
}

// API response wrapper
export type ApiResponse<T> = {
  data: T
  total?: number
  page?: number
  limit?: number
}
