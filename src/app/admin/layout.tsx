import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(255,79,145,.12),transparent_50%)]">{children}</div>;
}
