import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { computeScores } from "@/lib/scoring";
import { generateInsights } from "@/lib/claude";
import { saveSubmission } from "@/lib/kv";
import { sendLeadEmail } from "@/lib/email";
import type { ContactInfo, Submission } from "@/lib/types";

function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  let body: {
    contact: {
      firstName?: string;
      businessName?: string;
      email?: string;
      phone?: string;
    };
    answers: Record<string, number>;
  };

  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON");
  }

  // Validate required contact fields
  const { contact, answers } = body;
  if (
    !contact?.firstName?.trim() ||
    !contact?.businessName?.trim() ||
    !contact?.email?.trim()
  ) {
    return err("Missing required contact fields");
  }

  if (!answers || typeof answers !== "object") {
    return err("Missing answers");
  }

  const contactInfo: ContactInfo = {
    firstName: contact.firstName.trim(),
    businessName: contact.businessName.trim(),
    email: contact.email.trim(),
    phone: contact.phone?.trim(),
  };

  // 1. Rule-based scoring (deterministic, fast)
  const scores = computeScores(answers);

  // 2. Claude insights (async, 8-second timeout)
  const claudePromise = generateInsights(answers, scores, contactInfo.businessName);
  const timeoutPromise = new Promise<null>((resolve) =>
    setTimeout(() => resolve(null), 8000)
  );
  const insights = await Promise.race([claudePromise, timeoutPromise]);

  const submission: Submission = {
    id: uuidv4(),
    submittedAt: new Date().toISOString(),
    contact: contactInfo,
    answers,
    scores,
    claude: {
      insights,
      generated: insights !== null,
    },
    contacted: false,
  };

  // 3. Persist to KV (non-blocking on email)
  await saveSubmission(submission);

  // 4. Send email (fire and forget — don't block the response)
  sendLeadEmail(submission).catch((e) =>
    console.error("Email send failed:", e)
  );

  return NextResponse.json({ id: submission.id });
}
