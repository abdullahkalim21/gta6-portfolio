"use client";

import { motion } from "framer-motion";

/**
 * Cinematic fade between pages. Opacity only — transforms/filters would
 * break `position: fixed` overlays rendered inside pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
