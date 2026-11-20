"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  kicker,
  title,
  accent,
  description,
  align = "left",
}: {
  kicker: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-10 sm:mb-14 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}`}
    >
      <p className="font-hud mb-3 flex items-center gap-3 text-xs text-pink">
        {align === "left" && <span className="h-px w-8 bg-pink" />}
        {kicker}
      </p>
      <h2 className="font-display text-5xl leading-[0.95] sm:text-7xl">
        {title} {accent && <span className="text-sunset">{accent}</span>}
      </h2>
      {description && <p className="mt-4 text-base text-[var(--muted)] sm:text-lg">{description}</p>}
    </motion.header>
  );
}
