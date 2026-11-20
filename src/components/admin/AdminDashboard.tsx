"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminResources, type FieldDef, type ResourceDef } from "@/lib/admin-resources";

type Row = Record<string, unknown> & { id: string };

export function AdminDashboard({ branches }: { branches: string[] }) {
  const router = useRouter();
  const resources = useMemo(
    () =>
      adminResources.map((r) =>
        r.id === "skills" ? { ...r, fields: r.fields.map((f) => (f.name === "branch" ? { ...f, options: branches } : f)) } : r,
      ),
    [branches],
  );
  const [tab, setTab] = useState<ResourceDef["id"]>("projects");
  const resource = resources.find((r) => r.id === tab)!;

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-hud text-xs text-pink">CONTROL ROOM</p>
          <h1 className="font-display text-5xl">Admin dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="btn btn-ghost !py-2">
            View site ↗
          </Link>
          <button type="button" onClick={logout} className="btn btn-ghost !py-2">
            Log out
          </button>
        </div>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Content type">
        {resources.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={tab === r.id}
            onClick={() => setTab(r.id)}
            className={`font-hud rounded-lg border px-4 py-2 text-xs transition ${
              tab === r.id ? "border-pink bg-pink/15 text-white" : "border-white/10 text-[var(--muted)] hover:border-white/30"
            }`}
          >
            {r.label}
          </button>
        ))}
      </nav>

      <ResourcePanel key={resource.id} resource={resource} />
    </main>
  );
}

function ResourcePanel({ resource }: { resource: ResourceDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/${resource.id}`, { cache: "no-store" });
    const json = (await res.json().catch(() => ({}))) as { data?: Row[]; error?: string };
    setLoading(false);
    if (!res.ok) return setError(json.error ?? "Failed to load.");
    setRows(json.data ?? []);
  }, [resource.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(row: Row) {
    if (!confirm(`Delete this ${resource.singular}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/${resource.id}/${row.id}`, { method: "DELETE" });
    if (res.ok) void load();
    else setError("Delete failed.");
  }

  async function toggleRead(row: Row) {
    await fetch(`/api/admin/messages/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !row.read }),
    });
    void load();
  }

  return (
    <section className={`mt-6 grid gap-6 ${editing && resource.creatable ? "lg:grid-cols-[1fr_minmax(0,34rem)]" : ""}`}>
      <div className="glass rounded-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <p className="font-hud text-xs text-[var(--muted)]">
            {rows.length} {resource.label.toLowerCase()}
          </p>
          {resource.creatable && (
            <button type="button" className="btn btn-primary !px-4 !py-2" onClick={() => setEditing("new")}>
              + New {resource.singular}
            </button>
          )}
        </div>
        {error && <p className="px-5 py-3 text-sm text-pink">{error}</p>}
        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--muted)]">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--muted)]">
            Nothing here yet.{" "}
            {resource.creatable ? "Create one, or run `npm run db:seed` to import src/content/." : "Messages from the contact form will show up here."}
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map((row) => (
              <li key={row.id} className="flex items-start gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {resource.id === "messages" && !row.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-pink" aria-label="unread" />}
                    {String(row[resource.titleField] ?? "")}
                  </p>
                  {resource.subtitleField && <p className="truncate text-xs text-[var(--muted)]">{String(row[resource.subtitleField] ?? "")}</p>}
                  {resource.id === "messages" && (
                    <div className="mt-2 rounded-lg bg-black/20 p-3 text-sm">
                      <p className="font-hud mb-1 text-[0.6rem] text-ocean">
                        {String(row.missionType)} {row.budget ? `· ${String(row.budget)}` : ""} · {new Date(String(row.createdAt)).toLocaleString()}
                      </p>
                      <p className="whitespace-pre-wrap text-[var(--muted)]">{String(row.message)}</p>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2 text-xs">
                  {resource.id === "messages" ? (
                    <>
                      <a href={`mailto:${String(row.email)}`} className="text-ocean hover:underline">
                        Reply
                      </a>
                      <button type="button" onClick={() => toggleRead(row)} className="text-[var(--muted)] hover:text-white">
                        {row.read ? "Unread" : "Read"}
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setEditing(row)} className="text-ocean hover:underline">
                      Edit
                    </button>
                  )}
                  <button type="button" onClick={() => remove(row)} className="text-pink hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing && resource.creatable && (
        <Editor
          key={editing === "new" ? "new" : editing.id}
          resource={resource}
          row={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
    </section>
  );
}

function Editor({ resource, row, onClose, onSaved }: { resource: ResourceDef; row: Row | null; onClose: () => void; onSaved: () => void }) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base = { ...resource.defaults, ...(row ?? {}) };
    for (const f of resource.fields) if (base[f.name] === null || base[f.name] === undefined) base[f.name] = f.type === "checkbox" ? false : "";
    return base;
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (name: string, v: unknown) => setValues((s) => ({ ...s, [name]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: Record<string, unknown> = {};
    for (const f of resource.fields) payload[f.name] = values[f.name];
    const res = await fetch(row ? `/api/admin/${resource.id}/${row.id}` : `/api/admin/${resource.id}`, {
      method: row ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) return onSaved();
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    setError(json.error ?? "Save failed.");
  }

  return (
    <form onSubmit={save} className="glass h-fit space-y-4 rounded-2xl p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl">{row ? `Edit ${resource.singular}` : `New ${resource.singular}`}</p>
        <button type="button" onClick={onClose} className="text-sm text-[var(--muted)] hover:text-white" aria-label="Close editor">
          ✕
        </button>
      </div>
      {resource.fields.map((f) => (
        <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
      ))}
      {error && (
        <p className="text-sm text-pink" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn btn-primary flex-1">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${field.name}`;
  if (field.type === "checkbox") {
    return (
      <label htmlFor={id} className="flex items-center gap-3 text-sm">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-pink" />
        {field.label}
      </label>
    );
  }
  let input: React.ReactNode;
  switch (field.type) {
    case "textarea":
    case "markdown":
      input = (
        <textarea
          id={id}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={field.type === "markdown" ? 12 : 3}
          className={`field ${field.type === "markdown" ? "font-mono text-xs" : ""}`}
        />
      );
      break;
    case "number":
      input = <input id={id} type="number" value={String(value ?? 0)} onChange={(e) => onChange(e.target.value)} className="field" />;
      break;
    case "select":
      input = (
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="field">
          {(field.options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
      break;
    case "color":
      input = (
        <div className="flex gap-2">
          <input type="color" value={String(value || "#ff4f91")} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-11 w-14 rounded border border-white/10 bg-transparent" aria-label={`${field.label} picker`} />
          <input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="field" />
        </div>
      );
      break;
    case "date":
      input = (
        <input
          id={id}
          type="date"
          value={String(value ?? "").slice(0, 10)}
          onChange={(e) => e.target.value && onChange(new Date(e.target.value).toISOString())}
          className="field"
        />
      );
      break;
    case "tags":
      input = (
        <input
          id={id}
          value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="field"
          placeholder="Next.js, TypeScript"
        />
      );
      break;
    default:
      input = <input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className="field" />;
  }
  return (
    <div>
      <label htmlFor={id} className="label">
        {field.label}
      </label>
      {input}
      {field.help && <p className="mt-1 text-xs text-[var(--muted)]">{field.help}</p>}
    </div>
  );
}
