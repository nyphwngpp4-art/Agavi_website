export interface AnswerOption {
  key: "a" | "b" | "c" | "d";
  text: string;
  score: 1 | 2 | 3 | 4;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  pillar: string; // maps to Agavi service pillar
  question: string;
  answers: AnswerOption[];
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "revenue_leakage",
    name: "Revenue Leakage",
    description: "Are you capturing every dollar you've earned?",
    pillar: "Financial Automation",
    question:
      "How confident are you that your business captures and collects every dollar it earns?",
    answers: [
      {
        key: "a",
        text: "We have no clear view — invoicing and collections are manual and often fall through the cracks.",
        score: 1,
      },
      {
        key: "b",
        text: "We're mostly on top of it, but some invoices and follow-ups still slip.",
        score: 2,
      },
      {
        key: "c",
        text: "We have a process, but it's not consistent or automated.",
        score: 3,
      },
      {
        key: "d",
        text: "Billing, collections, and reconciliation are fully tracked and systematized.",
        score: 4,
      },
    ],
  },
  {
    id: "founder_bottleneck",
    name: "Founder Bottleneck",
    description: "Are you the constraint in your own business?",
    pillar: "Operations & Logistics",
    question:
      "How much of your business slows down or stops when you're unavailable for a full day?",
    answers: [
      {
        key: "a",
        text: "Almost everything — decisions, client issues, and daily operations all run through me.",
        score: 1,
      },
      {
        key: "b",
        text: "Most things slow down significantly. My team needs me for approvals and judgment calls.",
        score: 2,
      },
      {
        key: "c",
        text: "Key functions continue, but I'm still needed for anything significant.",
        score: 3,
      },
      {
        key: "d",
        text: "My business runs without me for days. My team has clear authority and documented systems.",
        score: 4,
      },
    ],
  },
  {
    id: "followup_reliability",
    name: "Follow-Up Reliability",
    description: "Does every lead get followed up with — every time?",
    pillar: "CRM Intelligence",
    question:
      "What happens to a new inquiry or lead if you're in back-to-back meetings all day?",
    answers: [
      {
        key: "a",
        text: "It probably gets missed or picked up days later.",
        score: 1,
      },
      {
        key: "b",
        text: "Someone might follow up, but there's no consistent system for it.",
        score: 2,
      },
      {
        key: "c",
        text: "We have a process, but it's manual and depends on someone remembering.",
        score: 3,
      },
      {
        key: "d",
        text: "Every inquiry is logged and followed up within a defined window — automatically.",
        score: 4,
      },
    ],
  },
  {
    id: "execution_discipline",
    name: "Execution Discipline",
    description: "Do your systems run without you supervising?",
    pillar: "Operations & Logistics",
    question:
      "How do recurring tasks and processes get completed in your business?",
    answers: [
      {
        key: "a",
        text: "Mostly through memory and tribal knowledge — people just know what to do.",
        score: 1,
      },
      {
        key: "b",
        text: "We have some checklists and notes, but they're not consistently followed.",
        score: 2,
      },
      {
        key: "c",
        text: "Most processes are documented and tracked, with some gaps.",
        score: 3,
      },
      {
        key: "d",
        text: "Documented, automated workflows run consistently without supervision.",
        score: 4,
      },
    ],
  },
  {
    id: "visibility_clarity",
    name: "Visibility Clarity",
    description: "Do you have real-time visibility into what's happening?",
    pillar: "Financial Automation",
    question:
      "Right now, how would you describe your visibility into your business's performance?",
    answers: [
      {
        key: "a",
        text: "I find out how we're doing at month-end, or when something goes wrong.",
        score: 1,
      },
      {
        key: "b",
        text: "I have a general sense but no real-time numbers I fully trust.",
        score: 2,
      },
      {
        key: "c",
        text: "I can pull reports, but it takes effort and the data isn't always current.",
        score: 3,
      },
      {
        key: "d",
        text: "I have a live view of revenue, pipeline, and key metrics — updated daily or in real time.",
        score: 4,
      },
    ],
  },
  {
    id: "data_stewardship",
    name: "Data Stewardship",
    description: "Are you capturing and using your business data?",
    pillar: "CRM Intelligence",
    question:
      "How would you describe the state of your customer and operational data?",
    answers: [
      {
        key: "a",
        text: "Scattered — spreadsheets, email, memory, and a CRM nobody fully uses.",
        score: 1,
      },
      {
        key: "b",
        text: "We capture data, but it's inconsistent and hard to act on.",
        score: 2,
      },
      {
        key: "c",
        text: "Data is reasonably organized but not being actively used to drive decisions.",
        score: 3,
      },
      {
        key: "d",
        text: "Clean, centralized data that actively informs strategy and operations.",
        score: 4,
      },
    ],
  },
  {
    id: "sovereign_ai_fit",
    name: "Sovereign AI Fit",
    description: "Are you positioned to implement AI on your own terms?",
    pillar: "Sales Enablement",
    question:
      "How does your leadership team currently think about AI in your business?",
    answers: [
      {
        key: "a",
        text: "We're skeptical or haven't seriously considered it.",
        score: 1,
      },
      {
        key: "b",
        text: "We're curious but don't know where to start or what it would require.",
        score: 2,
      },
      {
        key: "c",
        text: "We've experimented with tools but haven't implemented anything that stuck.",
        score: 3,
      },
      {
        key: "d",
        text: "We have a clear direction and are actively piloting or deploying AI.",
        score: 4,
      },
    ],
  },
  {
    id: "team_scalability",
    name: "Team Scalability",
    description: "Can your team and systems handle real growth?",
    pillar: "Operations & Logistics",
    question:
      "If your revenue doubled next quarter, how well could your current team and systems handle it?",
    answers: [
      {
        key: "a",
        text: "We'd be overwhelmed — our systems and team capacity don't scale.",
        score: 1,
      },
      {
        key: "b",
        text: "We'd struggle significantly and likely sacrifice quality or speed.",
        score: 2,
      },
      {
        key: "c",
        text: "We could manage, but it would take a lot of overtime and scrambling.",
        score: 3,
      },
      {
        key: "d",
        text: "Our systems and team are built to scale — we could absorb significant growth.",
        score: 4,
      },
    ],
  },
];
