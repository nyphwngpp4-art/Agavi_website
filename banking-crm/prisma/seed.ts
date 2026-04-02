import { PrismaClient } from '@prisma/client'
import { addDays, subDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.cadenceStepLog.deleteMany()
  await prisma.cadenceAssignment.deleteMany()
  await prisma.cadenceTemplate.deleteMany()
  await prisma.rolloutAssignment.deleteMany()
  await prisma.rolloutBatch.deleteMany()
  await prisma.outreachLog.deleteMany()
  await prisma.prospect.deleteMany()

  // Create prospects — realistic AZ companies
  const prospects = await Promise.all([
    prisma.prospect.create({
      data: {
        companyName: 'Desert Ridge Medical Group',
        city: 'Scottsdale', state: 'AZ',
        revenue: '$100M - $250M', revenueMin: 100, revenueMax: 250,
        industry: 'Healthcare', ownershipType: 'private',
        ownerName: 'Dr. James Whitfield', ownerEmail: 'jwhitfield@desertridgemedical.com', ownerPhone: '(480) 555-0101',
        cfoName: 'Maria Santos', cfoEmail: 'msantos@desertridgemedical.com', cfoPhone: '(480) 555-0102',
        currentBank: 'Chase', loanEstimate: '$15M revolver', treasuryServices: 'ACH, lockbox, merchant services',
        creditFacilityType: 'revolver', assignedRm: 'RM 1', stage: 'meeting_scheduled', priority: 'high',
        source: 'relpro', winScore: 62, notes: 'Growing practice, 12 locations across the Valley. Unhappy with Chase response times.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Copper State Logistics',
        city: 'Phoenix', state: 'AZ',
        revenue: '$250M - $500M', revenueMin: 250, revenueMax: 500,
        industry: 'Transportation & Logistics', ownershipType: 'pe_backed',
        ceoName: 'Robert Chen', ceoEmail: 'rchen@copperstatelog.com', ceoPhone: '(602) 555-0201',
        cfoName: 'Lisa Park', cfoEmail: 'lpark@copperstatelog.com', cfoPhone: '(602) 555-0202',
        controllerName: 'David Miller', controllerEmail: 'dmiller@copperstatelog.com',
        currentBank: 'Wells Fargo', loanEstimate: '$40M term loan + $20M revolver', treasuryServices: 'Wire, ACH, positive pay',
        creditFacilityType: 'both', assignedRm: 'RM 2', stage: 'proposal', priority: 'critical',
        source: 'linkedin', winScore: 78, notes: 'PE sponsor is Bain Capital. Looking to refinance by Q3.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Sonoran Solar Energy',
        city: 'Tempe', state: 'AZ',
        revenue: '$50M - $100M', revenueMin: 50, revenueMax: 100,
        industry: 'Energy & Utilities', ownershipType: 'private',
        ownerName: 'Angela Reyes', ownerEmail: 'areyes@sonoransolar.com', ownerPhone: '(480) 555-0301',
        ceoName: 'Michael Tran', ceoEmail: 'mtran@sonoransolar.com',
        currentBank: 'First Republic', stage: 'initial_outreach', priority: 'medium',
        assignedRm: 'RM 1', source: 'manual', winScore: 35,
        notes: 'Rapidly growing solar installation company. First Republic acquisition by Chase may create opportunity.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Valley Construction Group',
        city: 'Mesa', state: 'AZ',
        revenue: '$100M - $250M', revenueMin: 100, revenueMax: 250,
        industry: 'Construction', ownershipType: 'family',
        ownerName: 'Thomas Rodriguez', ownerEmail: 'trodriguez@valleyconst.com', ownerPhone: '(480) 555-0401',
        cfoName: 'Sarah Kim', cfoEmail: 'skim@valleyconst.com', cfoPhone: '(480) 555-0402',
        currentBank: 'Bank of America', loanEstimate: '$25M revolver', creditFacilityType: 'revolver',
        assignedRm: 'RM 3', stage: 'researching', priority: 'high',
        source: 'referral', winScore: 42, notes: '3rd generation family business. Strong municipal contracts.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Pinnacle Hospitality Partners',
        city: 'Scottsdale', state: 'AZ',
        revenue: '$250M - $500M', revenueMin: 250, revenueMax: 500,
        industry: 'Hospitality & Tourism', ownershipType: 'private',
        ceoName: 'Jennifer Walsh', ceoEmail: 'jwalsh@pinnaclehosp.com', ceoPhone: '(480) 555-0501',
        cfoName: 'Kevin O\'Brien', cfoEmail: 'kobrien@pinnaclehosp.com', cfoPhone: '(480) 555-0502',
        currentBank: 'US Bank', loanEstimate: '$35M term loan', treasuryServices: 'Full treasury suite',
        creditFacilityType: 'term_loan', assignedRm: 'RM 2', stage: 'negotiation', priority: 'critical',
        source: 'relpro', winScore: 85, notes: 'Owns 8 resort properties. Very close to signing. Need Market President touch.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'AZ Precision Manufacturing',
        city: 'Chandler', state: 'AZ',
        revenue: '$50M - $100M', revenueMin: 50, revenueMax: 100,
        industry: 'Manufacturing', ownershipType: 'esop',
        ceoName: 'Paul Henderson', ceoEmail: 'phenderson@azprecision.com',
        cfoName: 'Nancy Liu', cfoEmail: 'nliu@azprecision.com', cfoPhone: '(480) 555-0602',
        currentBank: 'Comerica', loanEstimate: '$8M revolver', creditFacilityType: 'revolver',
        stage: 'identified', priority: 'medium', source: 'csv_import', winScore: 10,
        notes: 'Aerospace parts manufacturer. ESOP transition completed 2024. Comerica relationship may be weak.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Cactus Jack\'s Restaurant Group',
        city: 'Phoenix', state: 'AZ',
        revenue: '$50M - $100M', revenueMin: 50, revenueMax: 100,
        industry: 'Retail & Consumer', ownershipType: 'family',
        ownerName: 'Jack Martinez', ownerEmail: 'jmartinez@cactusjacks.com', ownerPhone: '(602) 555-0701',
        controllerName: 'Amy Chen', controllerEmail: 'achen@cactusjacks.com',
        currentBank: 'Alliance Bank', stage: 'identified', priority: 'low',
        source: 'linkedin', winScore: 8,
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Southwest Data Centers',
        city: 'Phoenix', state: 'AZ',
        revenue: '$500M - $700M', revenueMin: 500, revenueMax: 700,
        industry: 'Technology', ownershipType: 'pe_backed',
        ceoName: 'Alex Thompson', ceoEmail: 'athompson@swdatacenters.com', ceoPhone: '(602) 555-0801',
        cfoName: 'Rachel Green', cfoEmail: 'rgreen@swdatacenters.com', cfoPhone: '(602) 555-0802',
        currentBank: 'JPMorgan', loanEstimate: '$100M term loan + $50M revolver',
        treasuryServices: 'Full suite including international wire', creditFacilityType: 'both',
        assignedRm: 'RM 3', stage: 'initial_outreach', priority: 'critical',
        source: 'relpro', winScore: 45, notes: 'Massive growth trajectory. Building 3 new facilities in Goodyear. KKR-backed.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Havasu Marine & Recreation',
        city: 'Lake Havasu City', state: 'AZ',
        revenue: '$50M - $100M', revenueMin: 50, revenueMax: 100,
        industry: 'Retail & Consumer', ownershipType: 'private',
        ownerName: 'Steve Johnson', ownerEmail: 'sjohnson@havasumarine.com', ownerPhone: '(928) 555-0901',
        currentBank: 'National Bank of Arizona', stage: 'identified', priority: 'low',
        source: 'manual', winScore: 5,
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Arcadia Health Systems',
        city: 'Phoenix', state: 'AZ',
        revenue: '$250M - $500M', revenueMin: 250, revenueMax: 500,
        industry: 'Healthcare', ownershipType: 'public',
        ceoName: 'Dr. Susan Campbell', ceoEmail: 'scampbell@arcadiahealth.com',
        cfoName: 'Mark Stevens', cfoEmail: 'mstevens@arcadiahealth.com', cfoPhone: '(602) 555-1002',
        currentBank: 'Regions Bank', loanEstimate: '$50M credit facility',
        creditFacilityType: 'both', assignedRm: 'RM 1', stage: 'meeting_scheduled', priority: 'high',
        source: 'relpro', winScore: 58, notes: 'Publicly traded (ACDH). Exploring alternatives to Regions.',
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Ironwood Mining Corp',
        city: 'Globe', state: 'AZ',
        revenue: '$100M - $250M', revenueMin: 100, revenueMax: 250,
        industry: 'Mining', ownershipType: 'public',
        ceoName: 'William Ford', ceoEmail: 'wford@ironwoodmining.com',
        cfoName: 'Patricia Hall', cfoEmail: 'phall@ironwoodmining.com', cfoPhone: '(928) 555-1102',
        currentBank: 'Zions Bank', stage: 'researching', priority: 'medium',
        assignedRm: 'RM 2', source: 'relpro', winScore: 28,
      },
    }),
    prisma.prospect.create({
      data: {
        companyName: 'Pima Aerospace Solutions',
        city: 'Tucson', state: 'AZ',
        revenue: '$100M - $250M', revenueMin: 100, revenueMax: 250,
        industry: 'Aerospace', ownershipType: 'private',
        ownerName: 'Colonel (Ret.) Dan Wright', ownerEmail: 'dwright@pimaero.com', ownerPhone: '(520) 555-1201',
        cfoName: 'Janet Moore', cfoEmail: 'jmoore@pimaero.com',
        currentBank: 'BBVA', loanEstimate: '$20M', creditFacilityType: 'term_loan',
        stage: 'won', priority: 'high', assignedRm: 'RM 3',
        source: 'referral', winScore: 95, notes: 'Deal closed! $20M term loan + full treasury. Great reference account.',
      },
    }),
  ])

  console.log(`Created ${prospects.length} prospects`)

  // Create outreach logs
  const now = new Date()
  const outreachEntries = [
    // Desert Ridge Medical - active engagement
    { prospectId: prospects[0].id, tier: 'rm', type: 'linkedin', date: subDays(now, 21), notes: 'Connected with CFO Maria Santos on LinkedIn', contactName: 'Maria Santos' },
    { prospectId: prospects[0].id, tier: 'rm', type: 'email', date: subDays(now, 18), notes: 'Intro email sent to CFO', contactName: 'Maria Santos', followUpDate: subDays(now, 11) },
    { prospectId: prospects[0].id, tier: 'leader', type: 'call', date: subDays(now, 14), notes: 'Call with Dr. Whitfield. Discussed treasury pain points with Chase.', contactName: 'Dr. James Whitfield', followUpDate: subDays(now, 7) },
    { prospectId: prospects[0].id, tier: 'rm', type: 'in_person', date: subDays(now, 7), notes: 'Coffee meeting with CFO. She is very interested in switching. Wants to see our treasury proposal.', contactName: 'Maria Santos', followUpDate: addDays(now, 3) },

    // Copper State Logistics - deep in process
    { prospectId: prospects[1].id, tier: 'rm', type: 'linkedin', date: subDays(now, 45), contactName: 'Lisa Park' },
    { prospectId: prospects[1].id, tier: 'rm', type: 'call', date: subDays(now, 38), notes: 'Initial call with CFO. Bain Capital PE partner supports exploring alternatives.', contactName: 'Lisa Park' },
    { prospectId: prospects[1].id, tier: 'leader', type: 'email', date: subDays(now, 30), notes: 'Sent company overview and capabilities deck', contactName: 'Robert Chen' },
    { prospectId: prospects[1].id, tier: 'rm', type: 'in_person', date: subDays(now, 21), notes: 'Site visit to HQ. Met full management team. Very positive.', contactName: 'Lisa Park' },
    { prospectId: prospects[1].id, tier: 'president', type: 'letter', date: subDays(now, 14), notes: 'Market President sent personal letter to CEO', contactName: 'Robert Chen' },
    { prospectId: prospects[1].id, tier: 'leader', type: 'in_person', date: subDays(now, 7), notes: 'Lunch with CEO and CFO. Presented term sheet.', contactName: 'Robert Chen', followUpDate: addDays(now, 2) },

    // Sonoran Solar
    { prospectId: prospects[2].id, tier: 'rm', type: 'linkedin', date: subDays(now, 10), contactName: 'Angela Reyes' },
    { prospectId: prospects[2].id, tier: 'rm', type: 'email', date: subDays(now, 7), notes: 'Intro email referencing First Republic situation', contactName: 'Angela Reyes', followUpDate: addDays(now, 5) },

    // Valley Construction
    { prospectId: prospects[3].id, tier: 'rm', type: 'linkedin', date: subDays(now, 5), contactName: 'Thomas Rodriguez' },

    // Pinnacle Hospitality - very close
    { prospectId: prospects[4].id, tier: 'rm', type: 'linkedin', date: subDays(now, 60), contactName: 'Kevin O\'Brien' },
    { prospectId: prospects[4].id, tier: 'rm', type: 'call', date: subDays(now, 50), contactName: 'Kevin O\'Brien', notes: 'Initial discovery call. 8 resort properties.' },
    { prospectId: prospects[4].id, tier: 'leader', type: 'in_person', date: subDays(now, 35), contactName: 'Jennifer Walsh', notes: 'Dinner meeting. Great chemistry.' },
    { prospectId: prospects[4].id, tier: 'rm', type: 'email', date: subDays(now, 28), contactName: 'Kevin O\'Brien', notes: 'Sent detailed proposal' },
    { prospectId: prospects[4].id, tier: 'president', type: 'in_person', date: subDays(now, 14), contactName: 'Jennifer Walsh', notes: 'Market President and CEO dinner at Ocean 44. Very productive.' },
    { prospectId: prospects[4].id, tier: 'leader', type: 'call', date: subDays(now, 3), contactName: 'Kevin O\'Brien', notes: 'Finalizing term sheet details. Legal review next week.', followUpDate: addDays(now, 4) },

    // Southwest Data Centers
    { prospectId: prospects[7].id, tier: 'rm', type: 'linkedin', date: subDays(now, 8), contactName: 'Rachel Green' },
    { prospectId: prospects[7].id, tier: 'rm', type: 'email', date: subDays(now, 5), contactName: 'Alex Thompson', notes: 'Intro email about growth financing capabilities', followUpDate: addDays(now, 7) },

    // Arcadia Health
    { prospectId: prospects[9].id, tier: 'rm', type: 'email', date: subDays(now, 25), contactName: 'Mark Stevens' },
    { prospectId: prospects[9].id, tier: 'rm', type: 'call', date: subDays(now, 18), contactName: 'Mark Stevens', notes: 'Discussed Regions frustrations. Wants more attentive relationship.' },
    { prospectId: prospects[9].id, tier: 'leader', type: 'in_person', date: subDays(now, 10), contactName: 'Dr. Susan Campbell', notes: 'Met CEO at Valley healthcare conference', followUpDate: addDays(now, 1) },

    // Ironwood Mining
    { prospectId: prospects[10].id, tier: 'rm', type: 'linkedin', date: subDays(now, 12), contactName: 'Patricia Hall' },

    // Pima Aerospace (won)
    { prospectId: prospects[11].id, tier: 'rm', type: 'linkedin', date: subDays(now, 90), contactName: 'Colonel (Ret.) Dan Wright' },
    { prospectId: prospects[11].id, tier: 'rm', type: 'call', date: subDays(now, 80), contactName: 'Janet Moore', notes: 'Strong referral from existing client' },
    { prospectId: prospects[11].id, tier: 'leader', type: 'in_person', date: subDays(now, 60), contactName: 'Colonel (Ret.) Dan Wright', notes: 'Great meeting. Military background, values relationship banking.' },
    { prospectId: prospects[11].id, tier: 'president', type: 'letter', date: subDays(now, 45), contactName: 'Colonel (Ret.) Dan Wright' },
    { prospectId: prospects[11].id, tier: 'rm', type: 'in_person', date: subDays(now, 30), contactName: 'Janet Moore', notes: 'Presented final terms. Accepted!' },
  ]

  for (const entry of outreachEntries) {
    await prisma.outreachLog.create({
      data: {
        ...entry,
        followUpDate: entry.followUpDate || null,
        contactName: entry.contactName || null,
        notes: entry.notes || null,
      },
    })
  }

  console.log(`Created ${outreachEntries.length} outreach entries`)

  // Create cadence templates
  const standardCadence = await prisma.cadenceTemplate.create({
    data: {
      name: 'Standard Corporate Prospect',
      description: '30-day multi-tier approach for typical corporate banking prospect',
      steps: JSON.stringify([
        { dayOffset: 0, tier: 'rm', type: 'linkedin', description: 'RM connects with CFO on LinkedIn' },
        { dayOffset: 3, tier: 'rm', type: 'email', description: 'RM sends intro email to CFO' },
        { dayOffset: 7, tier: 'leader', type: 'email', description: 'Leader sends personal note to CEO/Owner' },
        { dayOffset: 10, tier: 'rm', type: 'call', description: 'RM calls CFO for discovery' },
        { dayOffset: 17, tier: 'rm', type: 'in_person', description: 'RM meets CFO for coffee/lunch' },
        { dayOffset: 28, tier: 'president', type: 'letter', description: 'Market President sends letter to CEO' },
      ]),
    },
  })

  const fastTrack = await prisma.cadenceTemplate.create({
    data: {
      name: 'High Priority Fast Track',
      description: '14-day accelerated approach for high-value targets',
      steps: JSON.stringify([
        { dayOffset: 0, tier: 'rm', type: 'linkedin', description: 'RM connects on LinkedIn + immediate email' },
        { dayOffset: 1, tier: 'leader', type: 'email', description: 'Leader sends personal intro email' },
        { dayOffset: 3, tier: 'rm', type: 'call', description: 'RM calls for discovery' },
        { dayOffset: 7, tier: 'leader', type: 'in_person', description: 'Leader + RM joint meeting' },
        { dayOffset: 10, tier: 'president', type: 'call', description: 'Market President calls CEO' },
        { dayOffset: 14, tier: 'rm', type: 'in_person', description: 'Present capabilities and term sheet' },
      ]),
    },
  })

  await prisma.cadenceTemplate.create({
    data: {
      name: 'Executive Air Cover',
      description: 'Senior-level engagement for strategic targets',
      steps: JSON.stringify([
        { dayOffset: 0, tier: 'leader', type: 'email', description: 'Leader personal outreach to CEO' },
        { dayOffset: 5, tier: 'president', type: 'letter', description: 'Market President handwritten note' },
        { dayOffset: 12, tier: 'president', type: 'in_person', description: 'Market President + Leader dinner with CEO' },
      ]),
    },
  })

  console.log('Created 3 cadence templates')

  console.log('Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
