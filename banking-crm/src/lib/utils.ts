import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(millions: number): string {
  if (millions >= 1000) {
    return `$${(millions / 1000).toFixed(1)}B`
  }
  return `$${millions}M`
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStageLabel(stageId: string): string {
  const labels: Record<string, string> = {
    identified: 'Identified',
    researching: 'Researching',
    initial_outreach: 'Initial Outreach',
    meeting_scheduled: 'Meeting Scheduled',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    won: 'Won',
    lost: 'Lost',
  }
  return labels[stageId] || stageId
}

export function getWinScoreColor(score: number): string {
  if (score >= 70) return '#10B981' // green
  if (score >= 40) return '#F59E0B' // yellow
  if (score >= 20) return '#F97316' // orange
  return '#EF4444' // red
}

export function getWinScoreLabel(score: number): string {
  if (score >= 70) return 'Hot'
  if (score >= 40) return 'Warm'
  if (score >= 20) return 'Cool'
  return 'Cold'
}
