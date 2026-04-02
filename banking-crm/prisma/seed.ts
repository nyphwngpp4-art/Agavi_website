import { PrismaClient } from '@prisma/client'

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

  // All prospects from the 2026 AZ MM TOP Prospects Strategic Plan spreadsheet
  const prospectData: Parameters<typeof prisma.prospect.create>[0]['data'][] = [
    // ── IN DIALOGUE ──────────────────────────────────────────────────────
    {
      companyName: 'Community Bridges',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Ramon Dominguez', ownerEmail: 'rdominguez3@cbbridges.com',
      cfoName: 'Julie Wheel', cfoEmail: 'Julie.Wheel@cbbridges.com',
      loanEstimate: '$150M Credit, $130MM Deposits',
      stage: 'proposal', priority: 'critical',
      source: 'manual', winScore: 0,
      notes: 'Small credit in process w/ account. Full relationship 2026. Next: 1/30/2026 Customer provide 3/30 company FS after close loan along with analysis statement',
    },
    {
      companyName: 'Chicanos Por La Causa',
      city: 'Phoenix', state: 'AZ',
      cfoName: 'Lucas Satterfield', cfoEmail: 'Lucas_Satterfield@cplc.org',
      loanEstimate: '$150M Deposits',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Met w CFO/possible opportunity. Next: 3/13/2026 Customer wants to know if we are in line for golf tourney',
    },
    {
      companyName: 'Yellow Jacket Drilling',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'John Hartman',
      loanEstimate: '$80MM Term Loan',
      creditFacilityType: 'term_loan',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: '2026 opportunity. Will stay connected with owner. Next: 2/1/2026 Follow up for 12/31 results and update him on LDI',
    },
    {
      companyName: 'Marco Crane',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'John Markley',
      loanEstimate: '$120MM Deposits, $55MM Credit',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Customer open to looking at equipment w/us. Next: 3/15/2026 Send email about 5/3d conversion',
    },
    {
      companyName: 'Wanda Tang PC',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Wanda Tang',
      cfoName: 'Dave Harvey', cfoEmail: 'dave@harvestang.com',
      loanEstimate: '$170MM Loans',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'RE opportunity in Scottsdale. She will bring over related op accounts',
    },
    {
      companyName: 'Aerogard',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Joel Davidson',
      cfoName: 'Steven Knuczek',
      loanEstimate: '$170M loans, $60MM Deposits',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Meeting w/ local leadership TY13',
    },
    {
      companyName: 'Lofton Equipment',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Luke Lival', ownerEmail: 'Bud@loftonequip.com',
      cfoName: 'Jayson Kemsley',
      loanEstimate: 'Real Estate Refinance',
      stage: 'meeting_scheduled', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Trying to schedule lunch with Lofton',
    },
    {
      companyName: 'TLV Construction',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Tarik Williams',
      loanEstimate: '$400M deposits',
      stage: 'meeting_scheduled', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Dropped off materials; to follow up with Hartman for intro',
    },
    {
      companyName: 'Raceway Car Wash',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$25MM',
      stage: 'researching', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Waiting on Acquisition 5/3d has car wash contact',
    },
    {
      companyName: 'Sustainable Medical Care',
      city: 'Phoenix', state: 'AZ',
      stage: 'meeting_scheduled', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'ANA Glass',
      city: 'Phoenix', state: 'AZ',
      stage: 'meeting_scheduled', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Arbor Health',
      city: 'Phoenix', state: 'AZ',
      industry: 'Healthcare',
      stage: 'meeting_scheduled', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'EPS',
      city: 'Phoenix', state: 'AZ',
      stage: 'meeting_scheduled', priority: 'medium',
      source: 'manual', winScore: 0,
    },

    // ── WARM INTRO ───────────────────────────────────────────────────────
    {
      companyName: 'Kitsune Crushers',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Marcie Nichols', ownerEmail: 'marcien@kitsunecrushers.com',
      loanEstimate: '$130M LOC, $2MM Deposits',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Drop off TY13. Next: 2/1/2026 Send email about 5/3d conversion',
    },
    {
      companyName: 'Praxis Resources Inc',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Kathleen Fan',
      loanEstimate: '$1MM Commercial Card, $10MM Deposits',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'John Hartman to make intro',
    },
    {
      companyName: 'BlackRonce',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Kurt Donnell', ownerEmail: 'kurt.donnell@freestar.io',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Client managed by centralized. Had issues at WF. Partnering w/ Lindsey',
    },
    {
      companyName: 'Finserle',
      city: 'Phoenix', state: 'AZ',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Intro meeting on TY12',
    },
    {
      companyName: 'Premier Cardiovascular Center',
      city: 'Phoenix', state: 'AZ',
      industry: 'Healthcare',
      ownerName: 'Javier Medrano', ownerEmail: 'javier.medrano@proem.org',
      cfoName: 'Sharon', cfoEmail: 'sharon.hw.angelt@proem.org',
      loanEstimate: 'Loans, $80MM Wealth',
      stage: 'initial_outreach', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Dropped material with decision maker. Next: 2/20/2026 Paul to make introduction',
    },
    {
      companyName: 'Roc-Eh',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Norman Smalley',
      loanEstimate: 'Loans and deposits',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Warm intro from Paul',
    },
    {
      companyName: 'Flex Technology Group',
      city: 'Phoenix', state: 'AZ',
      industry: 'Technology',
      loanEstimate: 'Loans',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Warm intro through previous CFO & Lindsey. Next: 1/31/2026 Follow up with Karthik for intro',
    },
    {
      companyName: 'Prepasa',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Mark Doughty', ownerEmail: 'mark@prepasalliance.org',
      loanEstimate: 'Loan syndication',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Contact through school to get me in with finance team',
    },
    {
      companyName: 'Artavox',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: 'Deposit/TM',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'Warm intro from Paul',
    },

    // ── COLD OUTREACH STARTED ────────────────────────────────────────────
    {
      companyName: 'Professional Piping Systems',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      ownerName: 'Brian Gondel',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Have reached out via LinkedIn on bi-weekly cadence. Plan to drop card in person in Nov',
    },
    {
      companyName: 'Forrest Logistics',
      city: 'Phoenix', state: 'AZ',
      industry: 'Transportation & Logistics',
      loanEstimate: '$80MM deposits',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'GPS Insight',
      city: 'Phoenix', state: 'AZ',
      industry: 'Technology',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'Save outreach messaging',
    },
    {
      companyName: 'Surprise Concrete',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Equipment/rate arbitrage opportunity. Post 5/3d',
    },
    {
      companyName: 'Desert Ready Mix',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'Send LinkedIn intros',
    },
    {
      companyName: 'Footprint',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Jim Kimble', ownerEmail: 'jim.kimble@footprintus.com',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Davcon',
      city: 'Phoenix', state: 'AZ',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Cradles',
      city: 'Phoenix', state: 'AZ',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Tri City Cardiology',
      city: 'Phoenix', state: 'AZ',
      industry: 'Healthcare',
      ownerEmail: 'gfiorentino@tricitycardiology.com',
      stage: 'initial_outreach', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Depcom Power',
      city: 'Phoenix', state: 'AZ',
      industry: 'Energy & Utilities',
      ownerEmail: 'bdudge@depcompower.com',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
    },

    // ── LONGER TERM PROSPECTS - NON SOLICIT ──────────────────────────────
    {
      companyName: 'JBJCo',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Brian Ruddle', ownerEmail: 'bruddl@opiac.com',
      loanEstimate: '$250MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Large depositor',
    },
    {
      companyName: 'Pete King Construction',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      loanEstimate: '$150M Credit, $150MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Trying another attempt at the email',
    },
    {
      companyName: 'Central Arizona Supply',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Brandon Smith', ownerEmail: 'brandon@centralarizonasupply.com',
      loanEstimate: '$150M Credit, $50MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Contractor Management Services',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Philip Boice', ownerEmail: 'phillip.boice@cforce.com',
      loanEstimate: '$400MM Deposits',
      stage: 'identified', priority: 'high',
      source: 'manual', winScore: 0,
      notes: 'Next: 1/30/2026 Send invite to Barrett Jackson',
    },
    {
      companyName: 'Porter Bros Inc',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Mary Vandenberg', ownerEmail: 'mary@porterbrothers.com',
      loanEstimate: '$80MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'TMF International',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$150M Credit',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Lipske Distribution',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$30MM Credit, Deposits',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Auda 45',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Bob Auda',
      loanEstimate: '$150MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Blucor Contracting',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      loanEstimate: '$50MM Deposits',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Cavalry Investments',
      city: 'Phoenix', state: 'AZ',
      industry: 'Financial Services',
      loanEstimate: '$200M Deposits, $60MM Credit/syndication',
      creditFacilityType: 'both',
      stage: 'identified', priority: 'high',
      source: 'manual', winScore: 0,
      notes: '$5M credit, deposit, TM',
    },
    {
      companyName: 'Fairytale Brownies',
      city: 'Phoenix', state: 'AZ',
      industry: 'Retail & Consumer',
      ownerName: 'David Kravets', ownerEmail: 'david@brownies.com',
      loanEstimate: '$30M deposits',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'Next: 2/18/2026 invited to spring training',
    },
    {
      companyName: 'Mountainside Fitness',
      city: 'Phoenix', state: 'AZ',
      industry: 'Hospitality & Tourism',
      loanEstimate: 'Deposits/Credit',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Rise Inc',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Sakshi Parker', ownerEmail: 'sakshop@riseservices.inc.org',
      loanEstimate: '$150M Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'RPS Holdings / TEAMS Services',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$100MM Deposits, TM Suite',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'MGC Contractors',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      ownerName: 'Dane Miller', ownerEmail: 'dmiller@mgccontractors.com',
      loanEstimate: '$100MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'EV Group',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$80MM deposits, Pcard',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Dropped off Material. Following up with Emails to Rene',
    },
    {
      companyName: 'Translational Genomics',
      city: 'Phoenix', state: 'AZ',
      industry: 'Healthcare',
      loanEstimate: '$120MM deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Sound LLC',
      city: 'Phoenix', state: 'AZ',
      ownerName: 'Troy McNaughton', ownerEmail: 'troy@soundcapital.net',
      loanEstimate: '$100MM Deposits',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Followed up with owner, on mission. Will f/u with partner. Next: 1/6/2026 Send email to Troy McNaughton',
    },
    {
      companyName: 'Clear Vista Management',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$80M Deposits',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'TacoBoco',
      city: 'Phoenix', state: 'AZ',
      industry: 'Retail & Consumer',
      ownerEmail: 'dbalbocol@tacobocol.com',
      loanEstimate: 'Deposits',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'AVAir',
      city: 'Phoenix', state: 'AZ',
      industry: 'Aerospace',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },

    // ── PROSPECTS TO WATCH ───────────────────────────────────────────────
    {
      companyName: 'Universal Electronics Inc',
      city: 'Phoenix', state: 'AZ',
      industry: 'Technology',
      currentBank: 'US Bank',
      loanEstimate: 'US Bank, ABL Facility',
      stage: 'researching', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Cold outreach started via LinkedIn, earnings call TY6. Next: 2/10/2026 Follow up after Q4 Earnings',
    },
    {
      companyName: 'Copper State Bolt',
      city: 'Phoenix', state: 'AZ',
      stage: 'researching', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'In Alma\'s name following to see if she makes calls',
    },
    {
      companyName: 'Troon Golf',
      city: 'Phoenix', state: 'AZ',
      industry: 'Hospitality & Tourism',
      stage: 'researching', priority: 'low',
      source: 'manual', winScore: 0,
      notes: 'System user',
    },
    {
      companyName: 'Turbo Resources',
      city: 'Phoenix', state: 'AZ',
      ownerEmail: 'rckviblnd@turboresources.com',
      stage: 'researching', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'St. Thomas',
      city: 'Phoenix', state: 'AZ',
      loanEstimate: '$150M term loan',
      creditFacilityType: 'term_loan',
      stage: 'researching', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Board to meet 12/18. Cold outreach started via email. Will make additional follow ups with in person drop off',
    },
    {
      companyName: 'Horizon Distributors',
      city: 'Phoenix', state: 'AZ',
      stage: 'researching', priority: 'low',
      source: 'manual', winScore: 0,
    },

    // ── BB ────────────────────────────────────────────────────────────────
    {
      companyName: 'Finished Edge Technology',
      city: 'Phoenix', state: 'AZ',
      stage: 'initial_outreach', priority: 'medium',
      source: 'manual', winScore: 0,
      notes: 'Completed follow up linked in. 11/25/2025 Drop in with CMA material to try to meet decision maker',
    },

    // ── BAML PROSPECTS ───────────────────────────────────────────────────
    {
      companyName: 'Cavco',
      city: 'Phoenix', state: 'AZ',
      industry: 'Construction',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Verra Mobility Corp',
      city: 'Phoenix', state: 'AZ',
      industry: 'Technology',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: "Leslie's Pool",
      city: 'Phoenix', state: 'AZ',
      industry: 'Retail & Consumer',
      stage: 'identified', priority: 'medium',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Cresse Company',
      city: 'Phoenix', state: 'AZ',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
    {
      companyName: 'Yorick Company',
      city: 'Phoenix', state: 'AZ',
      stage: 'identified', priority: 'low',
      source: 'manual', winScore: 0,
    },
  ]

  // Create prospects sequentially to avoid issues with large batches
  const prospects = []
  for (const data of prospectData) {
    const prospect = await prisma.prospect.create({ data })
    prospects.push(prospect)
  }

  console.log(`Created ${prospects.length} prospects`)

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
