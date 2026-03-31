import { z } from "zod";

export type FieldType = "text" | "email" | "textarea" | "select" | "date";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export type WorkflowTarget = "n8n" | "openclaw";

export interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  domain: string;
  target: WorkflowTarget;
  webhookPath: string;
  fields: FieldConfig[];
  schema: z.ZodObject<z.ZodRawShape>;
  quickFire?: { label: string; values: Record<string, string> }[];
}

// --- Workflow 1: Lead Intake & Qualification ---
const leadIntakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  company: z.string().min(1, "Company is required"),
  industry: z.string().min(1, "Industry is required"),
  message: z.string().min(1, "Message is required"),
  source: z.string().min(1, "Source is required"),
});

const leadIntake: WorkflowConfig = {
  id: "agavi-lead-intake",
  name: "Lead Intake & Qualification",
  description: "Routes to Claude Haiku for lead qualification, then sends a Telegram brief",
  domain: "agavi",
  target: "n8n",
  webhookPath: "agavi-lead-intake",
  schema: leadIntakeSchema,
  fields: [
    { name: "name", label: "Name", type: "text", placeholder: "Contact name", required: true },
    { name: "email", label: "Email", type: "email", placeholder: "email@company.com", required: true },
    { name: "company", label: "Company", type: "text", placeholder: "Company name", required: true },
    { name: "industry", label: "Industry", type: "text", placeholder: "e.g. SaaS, Healthcare", required: true },
    { name: "message", label: "Message", type: "textarea", placeholder: "Initial message or inquiry", required: true },
    { name: "source", label: "Source", type: "text", placeholder: "e.g. LinkedIn, Website, Referral", required: true },
  ],
  quickFire: [
    {
      label: "LinkedIn Inbound",
      values: { source: "LinkedIn", industry: "SaaS", message: "Inbound connection request — interested in AI automation." },
    },
  ],
};

// --- Workflow 2: Idea Capture ---
const ideaCaptureSchema = z.object({
  idea: z.string().min(1, "Idea description is required"),
  category: z.enum(["content", "automation", "client", "product"]),
  priority: z.enum(["high", "medium", "low"]),
});

const ideaCapture: WorkflowConfig = {
  id: "agavi-idea-capture",
  name: "Idea Capture",
  description: "Sends to ClickUp Ideas list with a 3-day follow-up loop",
  domain: "agavi",
  target: "n8n",
  webhookPath: "agavi-idea-capture",
  schema: ideaCaptureSchema,
  fields: [
    { name: "idea", label: "Idea", type: "textarea", placeholder: "Describe the idea...", required: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { label: "Content", value: "content" },
        { label: "Automation", value: "automation" },
        { label: "Client", value: "client" },
        { label: "Product", value: "product" },
      ],
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
      ],
    },
  ],
  quickFire: [
    {
      label: "Quick Content Idea",
      values: { category: "content", priority: "medium", idea: "" },
    },
  ],
};

// --- Workflow 3: Prospect Agent ---
const prospectAgentSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  context: z.string().min(1, "Context is required"),
});

const prospectAgent: WorkflowConfig = {
  id: "openclaw-prospect",
  name: "Prospect Agent",
  description: "Triggers /prospect command on OpenClaw agent",
  domain: "agavi",
  target: "openclaw",
  webhookPath: "openclaw-prospect",
  schema: prospectAgentSchema,
  fields: [
    { name: "company_name", label: "Company Name", type: "text", placeholder: "Target company", required: true },
    { name: "contact_name", label: "Contact Name", type: "text", placeholder: "Key contact", required: true },
    { name: "context", label: "Context", type: "textarea", placeholder: "Background, goals, notes...", required: true },
  ],
  quickFire: [
    {
      label: "Cold Outreach Prep",
      values: { context: "Prepare cold outreach research and talking points." },
    },
  ],
};

// --- Workflow 4: Task Agent ---
const taskAgentSchema = z.object({
  task_title: z.string().min(1, "Task title is required"),
  due_date: z.string().min(1, "Due date is required"),
  list: z.enum(["Agavi", "Banking", "Personal"]),
  notes: z.string().optional(),
});

const taskAgent: WorkflowConfig = {
  id: "openclaw-task",
  name: "Task Agent",
  description: "Triggers /task command on OpenClaw agent",
  domain: "agavi",
  target: "openclaw",
  webhookPath: "openclaw-task",
  schema: taskAgentSchema,
  fields: [
    { name: "task_title", label: "Task Title", type: "text", placeholder: "What needs to be done?", required: true },
    { name: "due_date", label: "Due Date", type: "date", required: true },
    {
      name: "list",
      label: "List",
      type: "select",
      required: true,
      options: [
        { label: "Agavi", value: "Agavi" },
        { label: "Banking", value: "Banking" },
        { label: "Personal", value: "Personal" },
      ],
    },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional context..." },
  ],
  quickFire: [
    {
      label: "Quick Agavi Task",
      values: { list: "Agavi", notes: "" },
    },
  ],
};

// --- Workflow 5: Meeting Prep Agent ---
const meetingPrepSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  company: z.string().min(1, "Company is required"),
  meeting_type: z.string().min(1, "Meeting type is required"),
  key_objective: z.string().min(1, "Key objective is required"),
});

const meetingPrepAgent: WorkflowConfig = {
  id: "openclaw-meeting",
  name: "Meeting Prep Agent",
  description: "Triggers /meeting command on OpenClaw agent",
  domain: "agavi",
  target: "openclaw",
  webhookPath: "openclaw-meeting",
  schema: meetingPrepSchema,
  fields: [
    { name: "contact_name", label: "Contact Name", type: "text", placeholder: "Who are you meeting?", required: true },
    { name: "company", label: "Company", type: "text", placeholder: "Their company", required: true },
    { name: "meeting_type", label: "Meeting Type", type: "text", placeholder: "e.g. Discovery, Demo, Follow-up", required: true },
    { name: "key_objective", label: "Key Objective", type: "textarea", placeholder: "What's the goal of this meeting?", required: true },
  ],
  quickFire: [
    {
      label: "Discovery Call",
      values: { meeting_type: "Discovery", key_objective: "Understand their current workflow and pain points." },
    },
  ],
};

// --- Export all workflows ---
export const workflows: WorkflowConfig[] = [
  leadIntake,
  ideaCapture,
  prospectAgent,
  taskAgent,
  meetingPrepAgent,
];

export function getWorkflowById(id: string): WorkflowConfig | undefined {
  return workflows.find((w) => w.id === id);
}

export function getWorkflowsByDomain(domain: string): WorkflowConfig[] {
  return workflows.filter((w) => w.domain === domain);
}
