import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSubmission, getSubmissionIndex } from "@/lib/kv";
import AdminTable from "@/components/AdminTable";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const index = await getSubmissionIndex();

  // Fetch full submissions for all index entries
  const submissions: Submission[] = (
    await Promise.all(index.map((entry) => getSubmission(entry.id)))
  ).filter((s): s is Submission => s !== null);

  return (
    <main className="min-h-screen">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-heading font-bold text-surface text-sm">
            Agavi AI — Admin
          </span>
          <div className="flex items-center gap-4">
            <span className="text-muted text-sm">
              {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
            </span>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="text-muted text-sm hover:text-surface transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="eyebrow mb-2">Submissions</div>
          <h1 className="font-heading font-bold text-surface text-2xl">
            Diagnostic Leads
          </h1>
        </div>

        {submissions.length === 0 ? (
          <div className="panel-card p-12 text-center">
            <p className="text-muted">No submissions yet. Share the diagnostic to start collecting leads.</p>
          </div>
        ) : (
          <AdminTable submissions={submissions} />
        )}
      </div>
    </main>
  );
}
