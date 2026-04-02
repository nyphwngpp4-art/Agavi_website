// Relationship Managers — easy to update
export const RELATIONSHIP_MANAGERS = [
  'RM 1',
  'RM 2',
  'RM 3',
] as const

export type RelationshipManager = (typeof RELATIONSHIP_MANAGERS)[number]

// Pipeline stages
export const PIPELINE_STAGES = [
  { id: 'identified', label: 'Identified', color: '#6B7280' },
  { id: 'researching', label: 'Researching', color: '#8B5CF6' },
  { id: 'initial_outreach', label: 'Initial Outreach', color: '#3B82F6' },
  { id: 'meeting_scheduled', label: 'Meeting Scheduled', color: '#F59E0B' },
  { id: 'proposal', label: 'Proposal', color: '#C51432' },
  { id: 'negotiation', label: 'Negotiation', color: '#EC4899' },
  { id: 'won', label: 'Won', color: '#10B981' },
  { id: 'lost', label: 'Lost', color: '#EF4444' },
] as const

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]['id']

// Outreach types
export const OUTREACH_TYPES = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'call', label: 'Phone Call', icon: 'Phone' },
  { id: 'in_person', label: 'In-Person', icon: 'Users' },
  { id: 'letter', label: 'Letter', icon: 'FileText' },
] as const

export type OutreachTypeId = (typeof OUTREACH_TYPES)[number]['id']

// Outreach tiers
export const OUTREACH_TIERS = [
  { id: 'rm', label: 'RM Outreach', color: '#3B82F6' },
  { id: 'leader', label: 'Leader Outreach', color: '#C51432' },
  { id: 'president', label: 'Market President', color: '#D4A843' },
] as const

export type OutreachTierId = (typeof OUTREACH_TIERS)[number]['id']

// Revenue ranges for AZ corporate banking ($50M-$700M)
export const REVENUE_RANGES = [
  { label: '$50M - $100M', min: 50, max: 100 },
  { label: '$100M - $250M', min: 100, max: 250 },
  { label: '$250M - $500M', min: 250, max: 500 },
  { label: '$500M - $700M', min: 500, max: 700 },
  { label: '$700M+', min: 700, max: 9999 },
] as const

// Industries common in AZ corporate banking
export const INDUSTRIES = [
  'Healthcare',
  'Real Estate',
  'Construction',
  'Manufacturing',
  'Technology',
  'Hospitality & Tourism',
  'Retail & Consumer',
  'Transportation & Logistics',
  'Energy & Utilities',
  'Agriculture & Food',
  'Financial Services',
  'Professional Services',
  'Education',
  'Government & Defense',
  'Mining',
  'Aerospace',
  'Other',
] as const

// Ownership types
export const OWNERSHIP_TYPES = [
  { id: 'private', label: 'Private' },
  { id: 'public', label: 'Public' },
  { id: 'pe_backed', label: 'PE-Backed' },
  { id: 'family', label: 'Family-Owned' },
  { id: 'esop', label: 'ESOP' },
] as const

// Credit facility types
export const CREDIT_FACILITY_TYPES = [
  { id: 'revolver', label: 'Revolver' },
  { id: 'term_loan', label: 'Term Loan' },
  { id: 'both', label: 'Both' },
  { id: 'unknown', label: 'Unknown' },
] as const

// Priority levels
export const PRIORITIES = [
  { id: 'critical', label: 'Critical', color: '#EF4444' },
  { id: 'high', label: 'High', color: '#F59E0B' },
  { id: 'medium', label: 'Medium', color: '#3B82F6' },
  { id: 'low', label: 'Low', color: '#6B7280' },
] as const

// Prospect sources
export const PROSPECT_SOURCES = [
  { id: 'manual', label: 'Manual Entry' },
  { id: 'csv_import', label: 'CSV Import' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'relpro', label: 'RelPro' },
  { id: 'referral', label: 'Referral' },
] as const
