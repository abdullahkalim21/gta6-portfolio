import Link from "next/link";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { isAdmin } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!env.databaseEnabled || !env.adminEnabled) {
    return <SetupNeeded db={env.databaseEnabled} admin={env.adminEnabled} />;
  }
  if (!(await isAdmin())) redirect("/admin/login");

  return <AdminDashboard branches={siteConfig.skillBranches.map((b) => b.id)} />;
}

function SetupNeeded({ db, admin }: { db: boolean; admin: boolean }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24">
      <p className="font-hud text-xs text-pink">ADMIN · LOCKED</p>
      <h1 className="font-display mt-2 text-6xl">Setup required</h1>
      <p className="mt-4 text-[var(--muted)]">
        The admin dashboard needs a database and a password. Without them the site still works perfectly — it just reads content from{" "}
        <code className="text-orange">src/content/</code>.
      </p>
      <ol className="glass mt-8 space-y-4 rounded-2xl p-6 text-sm">
        <li className="flex gap-3">
          <span className={db ? "text-mint" : "text-pink"}>{db ? "✓" : "✗"}</span>
          <span>
            <b>DATABASE_URL</b> — a PostgreSQL connection string (Supabase, Neon, Railway or local Docker). Then run{" "}
            <code className="text-orange">npm run db:setup</code>.
          </span>
        </li>
        <li className="flex gap-3">
          <span className={admin ? "text-mint" : "text-pink"}>{admin ? "✓" : "✗"}</span>
          <span>
            <b>ADMIN_PASSWORD</b> and <b>AUTH_SECRET</b> — the password you&apos;ll log in with and a long random secret for signing sessions.
          </span>
        </li>
      </ol>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Full walkthrough in <code className="text-orange">docs/DATABASE.md</code>. Restart the dev server after editing <code>.env</code>.
      </p>
      <Link href="/" className="btn btn-ghost mt-8">
        ‹ Back to the site
      </Link>
    </main>
  );
}
