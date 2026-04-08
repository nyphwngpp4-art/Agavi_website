# Missed Call Audit — Screenshare Talk Track

**Goal of this call:** Get the prospect to show you their call log, pull a CSV, and leave the call *wanting* the $1,950 Phone Recovery install. Do NOT pitch the install on this call. The report sells the install the next day.

**Time budget:** 10 minutes. If you're still on at minute 12, you're talking too much.

**Pre-call checklist:**
- Zoom/Meet/Google Meet link sent via Calendly
- `missed-call-audit.js` ready to run on your laptop
- A blank CSV folder open so you can drop their export in fast
- A glass of water (you do more listening than talking on this call)

---

## Minute 0–1 — Frame the call

> "Hey [first name], thanks for taking 10 minutes. Before I waste any of it — I'm not here to pitch you software today. I'm going to ask you to share your screen for about 4 minutes so I can pull your call log, I'm going to disappear, and tomorrow you get a one-page PDF in your inbox with your actual missed-call number. That's it. If the number's small, you throw it away. If it's not, you tell me what you want to do. Sound fair?"

**Wait for the yes.** Don't keep talking.

---

## Minute 1–3 — The 3 questions (ask in this exact order)

You need three pieces of context before you pull the data, because they change the math on the final report. Ask them like a banker underwriting a loan — flat tone, taking notes.

1. **"How many trucks are you running right now?"**
   (Gives you rough shop size. 3–5 is small, 6–12 is the sweet spot, 13+ is where they may already have a BDC.)

2. **"What's your average ticket on an emergency service call right now — just the no-heat, no-cool kind?"**
   (This is the number you'll plug into `--ticket`. If they say "I don't know," say "ballpark is fine — $800? $1,200? $1,800?" and let them pick.)

3. **"Who answers the phone when a call comes in — one person, a rotation, an answering service?"**
   (Tells you what story to tell in the report. Single CSR = "she can't physically answer while dispatching." Answering service = "you're already paying for a service that misses calls.")

**Write the answers down.** You'll need them in the report and in tomorrow's follow-up.

---

## Minute 3–6 — Pull the data

> "OK, can you share your screen and pull up whatever phone system you use? RingCentral, OpenPhone, Nextiva — whichever one it is."

**When you see their phone system:**

- Ask them to go to **Call Log** / **Analytics** / **Reports** (every system calls it something different)
- Set the date range to **the last 7 days**
- Look for an **Export** or **Download CSV** button — it's usually top-right

**If they can't find it,** you drive. Say: *"Mind if I take control for a second?"* Then find it for them. Most owners don't know this button exists. It takes 30 seconds.

**Common locations by system:**
- **RingCentral:** Analytics → Historical Reports → Call Log → Export
- **OpenPhone:** Contacts & Calls → Calls → Export CSV (top right)
- **Nextiva:** Reports → Call Activity → Download
- **Dialpad:** Analytics → Call Logs → Export
- **Google Voice:** No native export — take a screenshot of the last 7 days' calls and tell them you'll count manually (this is a yellow flag for the install anyway; they need to upgrade their phone system)
- **Still on a landline:** Ask them to pull their phone bill from their carrier. It'll show inbound calls and call duration. This is a STRONG signal they need the full Tier 2 sprint, not just Tier 1.

**Get the CSV onto your machine.** Have them email it to you, or drop it into a shared Google Drive folder you set up in advance.

---

## Minute 6–8 — The handoff (do NOT run the script live)

> "Perfect, I've got it. I'm going to pull this apart tonight, run it against our model, and tomorrow morning you'll get a one-page PDF in your inbox. It'll show you three things: how many calls you missed last week, what it probably cost you, and what a shop like yours looks like once it's fixed. No pitch in the PDF. Just the numbers."

**Critical: do not run the script while they're watching.** Two reasons:
1. You want to read the output *before* they do so you know what conversation to have tomorrow
2. A report that takes a day to arrive feels like analysis; a report that pops out in 20 seconds feels like a calculator

---

## Minute 8–10 — The 3 last questions (this is where you earn the install)

Now you switch from analyst to operator. Ask these in a curious tone, not an interrogation tone.

1. **"When was the last time you felt like you were leaving money on the table because the phones were getting away from you?"**
   (You want the story. Let them talk. Don't interrupt. This is the pain anchor you'll use tomorrow.)

2. **"If you could wave a wand and fix one thing about how calls get handled — just one — what would it be?"**
   (This tells you whether to lead with AI receptionist, review automation, or the Monday dashboard in the install pitch.)

3. **"Who else in the business would weigh in on a decision like this — just you, or is there a partner, your wife, an office manager?"**
   (You need to know whose hand is on the checkbook before you send the proposal. If there's a second decision-maker, you want them on the follow-up call.)

**Write everything down.** Verbatim quotes are gold for tomorrow's email.

---

## Minute 10 — End the call

> "Alright, that's everything I need. Report hits your inbox by [tomorrow 9am]. If the number's small, no worries, keep the PDF. If it's not, we'll talk about whether it makes sense to do something about it. Either way, thanks for the 10 minutes."

**Do NOT:**
- Ask for the install on this call
- Mention pricing
- Offer to "send over some info"
- Schedule the next meeting (yet)

**The report schedules the next meeting for you.** If the numbers are ugly, they'll reply asking what to do. That reply is the warmest lead you'll ever get.

---

## After the call — generate the report

1. Drop the CSV into `hvac-toolkit/`
2. Run:
   ```
   node missed-call-audit.js <their-export.csv> <shop-slug>-report.html --shop "Their Shop Name" --ticket <number they gave you>
   ```
3. Open the HTML file in a browser, print to PDF (Cmd/Ctrl+P → Save as PDF)
4. Email the PDF the next morning. Email body below.

## The follow-up email template

**Subject:** Your missed call numbers — [Shop Name]

> Hey [first name],
>
> PDF attached. Short version:
>
> - You missed **[X] calls** over the 7-day window we looked at
> - That's roughly **[$Y] in lost revenue** over the week
> - Annualized, that's **[$Z] a year** of jobs walking to the next contractor
>
> I know those numbers are ugly. They're also conservative — we used industry averages, not your real ticket size, so the real number is probably worse.
>
> What I'd normally do next is get you on a 30-minute walkthrough of exactly how we'd fix it — flat $1,950, 7 days, your team doesn't learn anything new. If that's something you want to look at, reply with a time that works and I'll send a calendar invite.
>
> If not, keep the PDF. No hard feelings.
>
> Jay
>
> Agavi AI · Phoenix
> jay@agaviai.com

---

## What you're NOT doing on this call

- Pitching anything
- Showing slides
- Explaining how AI works
- Talking about yourself
- Walking through the offer tiers
- Naming a price

All of that happens tomorrow, over email, after they've seen the number. The audit call is a data-gathering call disguised as a favor.

## If the numbers come back small

Some shops actually do answer 90%+ of their calls. It happens, especially at 3-truck owner-operator shops where the owner IS the CSR. If that's what you find:

- Still send the PDF (credibility matters)
- In the email, skip the install pitch entirely and say: *"Good news — your call capture is actually strong. The number I'd focus on for a shop your size is what's happening after the call ends: review requests, follow-ups, and how fast you're turning estimates into invoices. Happy to walk you through that if you're curious."*
- That's a pivot to the **Tier 2 Shop Operations Sprint** without ever mentioning Tier 1

The audit is never a waste. Even a clean call log gives you an opening to the bigger engagement.
