import Link from "next/link";

const PILLARS = [
  { name: "Revenue Leakage", icon: "💸" },
  { name: "Founder Bottleneck", icon: "⚡" },
  { name: "Follow-Up Reliability", icon: "📬" },
  { name: "Execution Discipline", icon: "⚙️" },
  { name: "Visibility Clarity", icon: "📊" },
  { name: "Data Stewardship", icon: "🗂️" },
  { name: "Sovereign AI Fit", icon: "🤖" },
  { name: "Team Scalability", icon: "📈" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl grid place-items-center"
              style={{
                background:
                  "radial-gradient(circle at 50% 38%, rgba(94,246,238,.22), transparent 56%), linear-gradient(180deg, rgba(11,24,40,.98), rgba(8,17,28,.98))",
                border: "1px solid rgba(111,160,214,.18)",
              }}
            >
              {/* Agave leaf mark */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20 C10 14 10.5 8 12 3 C13.5 8 14 14 12 20Z"
                  fill="url(#lg)"
                />
                <path
                  d="M12 14 C9 11 5 10 2 8 C6 9 10 11 12 14Z"
                  fill="url(#lg)"
                  opacity=".7"
                />
                <path
                  d="M12 14 C15 11 19 10 22 8 C18 9 14 11 12 14Z"
                  fill="url(#lg)"
                  opacity=".7"
                />
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#5ef6ee" />
                    <stop offset="1" stopColor="#57d6ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-surface leading-none">
                Agavi AI
              </div>
              <div className="text-muted text-[10px] tracking-widest uppercase font-bold leading-none mt-0.5">
                Operational Diagnostic
              </div>
            </div>
          </Link>
          <a
            href="mailto:jay@agaviai.com"
            className="text-muted text-sm hover:text-surface transition-colors"
          >
            jay@agaviai.com
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="eyebrow mb-6">Free Diagnostic Tool</div>
        <h1
          className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-surface leading-[1.1] mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Where is your business
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #5ef6ee, #57d6ff, #6d91ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            leaving money on the table?
          </span>
        </h1>
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          The Agavi Operational Diagnostic identifies the exact gaps where AI
          integration would move the needle — across revenue, operations, and
          growth. Honest answers produce honest results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-bg text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
              boxShadow: "0 0 32px rgba(94,246,238,.25)",
            }}
          >
            Begin the Diagnostic
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <p className="text-muted text-sm">
          8 questions · 5 minutes · No email required to see your results
        </p>
      </section>

      {/* Dimensions grid */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="panel-card p-8 md:p-10">
          <div className="eyebrow mb-6 text-center">What We Measure</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.06)",
                }}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-surface text-sm font-semibold leading-tight">
                  {p.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="eyebrow text-center mb-8">How It Works</div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Answer 8 questions",
              desc: "One question per operational dimension. No trick questions. Answer what's actually true about your business.",
            },
            {
              step: "02",
              title: "See your full results",
              desc: "Your diagnostic report appears immediately. Every dimension, every score. Nothing locked, nothing hidden.",
            },
            {
              step: "03",
              title: "Decide what to do next",
              desc: "If you'd like a personal follow-up from Jay, you can share your contact info — or take the results and run with them yourself.",
            },
          ].map((item) => (
            <div key={item.step} className="panel-card p-6">
              <div
                className="font-heading font-bold text-3xl mb-4"
                style={{ color: "rgba(94,246,238,.3)" }}
              >
                {item.step}
              </div>
              <h3 className="font-heading font-bold text-surface text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div
          className="rounded-panel p-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(94,246,238,.07), rgba(109,145,255,.07))",
            border: "1px solid rgba(94,246,238,.15)",
          }}
        >
          <h2 className="font-heading font-bold text-surface text-2xl md:text-3xl mb-3">
            Ready to see where you stand?
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            This diagnostic is built on the same framework Agavi AI uses in
            paid engagements. You get the honest version.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-bg text-base transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
              boxShadow: "0 0 32px rgba(94,246,238,.2)",
            }}
          >
            Start the Diagnostic
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted text-sm">
          <span>© {new Date().getFullYear()} Agavi AI</span>
          <a
            href="https://agaviai.com"
            className="hover:text-surface transition-colors"
          >
            agaviai.com
          </a>
          <a
            href="mailto:jay@agaviai.com"
            className="hover:text-surface transition-colors"
          >
            jay@agaviai.com
          </a>
        </div>
      </footer>
    </main>
  );
}
