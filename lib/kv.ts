import { kv } from "@vercel/kv";
import type { Submission, SubmissionIndexEntry } from "@/lib/types";

const INDEX_KEY = "submissions:index";

export async function saveSubmission(submission: Submission): Promise<void> {
  await kv.set(`submission:${submission.id}`, submission);

  const index = (await kv.get<SubmissionIndexEntry[]>(INDEX_KEY)) ?? [];
  const entry: SubmissionIndexEntry = {
    id: submission.id,
    submittedAt: submission.submittedAt,
    businessName: submission.contact.businessName,
    readiness: submission.scores.readiness,
    urgency: submission.scores.urgency,
  };
  index.unshift(entry); // newest first
  await kv.set(INDEX_KEY, index);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  return kv.get<Submission>(`submission:${id}`);
}

export async function updateSubmission(
  id: string,
  patch: Partial<Submission>
): Promise<void> {
  const existing = await getSubmission(id);
  if (!existing) return;
  await kv.set(`submission:${id}`, { ...existing, ...patch });
}

export async function getSubmissionIndex(): Promise<SubmissionIndexEntry[]> {
  return (await kv.get<SubmissionIndexEntry[]>(INDEX_KEY)) ?? [];
}
