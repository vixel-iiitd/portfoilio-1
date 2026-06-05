"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function KonamiCode() {
  const [seq, setSeq] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSeq((prev) => {
        const next = [...prev, e.key].slice(-10);
        if (next.join(",") === KONAMI.join(",")) {
          setActivated(true);
          setTimeout(() => setActivated(false), 3000);
          return [];
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Suppress unused warning — seq is needed to accumulate key presses
  void seq;

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(79,142,247,0.15) 0%, transparent 70%)",
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <div className="text-2xl font-bold text-gradient-blue font-code">
              // KONAMI CODE ACTIVATED
            </div>
            <div className="text-sm text-[#888] font-code mt-2">
              You found the Easter egg! Achievement unlocked 🏆
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
