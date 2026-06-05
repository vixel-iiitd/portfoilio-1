"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CatState = "hidden" | "walkRight" | "walkLeft" | "sitting" | "sleeping";

function CatSVG({ state }: { state: CatState }) {
  const isWalking = state === "walkRight" || state === "walkLeft";
  const isSleeping = state === "sleeping";
  const flipped = state === "walkLeft";

  return (
    <svg
      viewBox="0 0 80 65"
      width={80}
      height={65}
      style={{ transform: flipped ? "scaleX(-1)" : undefined, overflow: "visible" }}
    >
      {/* Body */}
      <ellipse cx="30" cy="48" rx="20" ry="13" fill="#e2e8f0" />
      {/* Head */}
      <circle cx="54" cy="28" r="18" fill="#e2e8f0" />

      {/* Left ear */}
      <polygon points="42,14 38,3 48,11" fill="#e2e8f0" />
      <polygon points="42,13 39,5 47,11" fill="#fbcfe8" />
      {/* Right ear */}
      <polygon points="63,13 68,3 59,11" fill="#e2e8f0" />
      <polygon points="63,12 67,5 60,11" fill="#fbcfe8" />

      {/* Eyes */}
      {isSleeping ? (
        <>
          <path d="M47,27 Q50,24 53,27" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M55,27 Q58,24 61,27" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="49" cy="27" rx="3.5" ry="4" fill="#374151" />
          <ellipse cx="59" cy="27" rx="3.5" ry="4" fill="#374151" />
          <circle cx="50.5" cy="25.5" r="1" fill="white" />
          <circle cx="60.5" cy="25.5" r="1" fill="white" />
        </>
      )}

      {/* Nose */}
      <polygon points="54,32 52,35 56,35" fill="#f9a8d4" />
      {/* Mouth */}
      <path d="M52,35 Q54,38 56,35" stroke="#9ca3af" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Whiskers left */}
      <line x1="34" y1="31" x2="48" y2="33" stroke="#9ca3af" strokeWidth="0.7" opacity="0.7" />
      <line x1="34" y1="35" x2="48" y2="34" stroke="#9ca3af" strokeWidth="0.7" opacity="0.7" />
      {/* Whiskers right */}
      <line x1="74" y1="31" x2="60" y2="33" stroke="#9ca3af" strokeWidth="0.7" opacity="0.7" />
      <line x1="74" y1="35" x2="60" y2="34" stroke="#9ca3af" strokeWidth="0.7" opacity="0.7" />

      {/* Tail */}
      {isSleeping ? (
        <path
          d="M10,50 Q2,60 12,62 Q22,64 18,56"
          stroke="#e2e8f0"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : isWalking ? (
        <path
          d="M10,48 Q0,35 8,28 Q16,22 14,35"
          stroke="#e2e8f0"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M10,50 Q0,42 5,30 Q10,18 16,26"
          stroke="#e2e8f0"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* Walking legs — 4 rounded rects */}
      {isWalking && (
        <>
          <rect x="16" y="57" width="5" height="9" rx="2.5" fill="#cbd5e1" />
          <rect x="24" y="57" width="5" height="9" rx="2.5" fill="#cbd5e1" />
          <rect x="32" y="57" width="5" height="9" rx="2.5" fill="#cbd5e1" />
          <rect x="40" y="57" width="5" height="9" rx="2.5" fill="#cbd5e1" />
        </>
      )}

      {/* Sitting legs */}
      {state === "sitting" && (
        <>
          <ellipse cx="20" cy="59" rx="6" ry="4" fill="#cbd5e1" />
          <ellipse cx="38" cy="59" rx="6" ry="4" fill="#cbd5e1" />
        </>
      )}

      {/* Sleeping zzz */}
      {isSleeping && (
        <>
          <text x="66" y="18" fontSize="8" fill="#94a3b8" fontFamily="serif" opacity="0.8">z</text>
          <text x="72" y="12" fontSize="6" fill="#94a3b8" fontFamily="serif" opacity="0.6">z</text>
          <text x="76" y="7" fontSize="5" fill="#94a3b8" fontFamily="serif" opacity="0.4">z</text>
        </>
      )}
    </svg>
  );
}

export default function FloatingCat() {
  const [state, setState] = useState<CatState>("hidden");
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [catY, setCatY] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    const delay = 30000 + Math.random() * 20000;
    timerRef.current = setTimeout(() => triggerCat(), delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerCat = useCallback(() => {
    const roll = Math.random();
    const w = window.innerWidth;
    const y = window.innerHeight - 130;
    setCatY(y);

    if (roll < 0.5) {
      setStartX(-120);
      setEndX(w + 120);
      setState("walkRight");
    } else if (roll < 0.75) {
      setStartX(w + 120);
      setEndX(-120);
      setState("walkLeft");
    } else if (roll < 0.9) {
      setStartX(w * 0.2 + Math.random() * w * 0.6);
      setEndX(w * 0.2 + Math.random() * w * 0.6);
      setState("sitting");
      timerRef.current = setTimeout(() => {
        setState("hidden");
        scheduleNext();
      }, 5000 + Math.random() * 3000);
    } else {
      setStartX(w * 0.2 + Math.random() * w * 0.6);
      setEndX(w * 0.2 + Math.random() * w * 0.6);
      setState("sleeping");
      timerRef.current = setTimeout(() => {
        setState("hidden");
        scheduleNext();
      }, 7000 + Math.random() * 4000);
    }
  }, [scheduleNext]);

  useEffect(() => {
    timerRef.current = setTimeout(triggerCat, 8000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerCat]);

  const isWalking = state === "walkRight" || state === "walkLeft";
  const walkDuration = 12 + Math.random() * 4;

  return (
    <AnimatePresence>
      {state !== "hidden" && (
        <>
          {isWalking ? (
            <motion.div
              style={{
                position: "fixed",
                top: catY,
                left: 0,
                zIndex: 9999,
                pointerEvents: "none",
              }}
              initial={{ x: startX }}
              animate={{ x: endX }}
              transition={{ duration: walkDuration, ease: "linear" }}
              onAnimationComplete={() => {
                setState("hidden");
                scheduleNext();
              }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
              >
                <CatSVG state={state} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: catY,
                left: startX,
                zIndex: 9999,
                pointerEvents: "none",
              }}
            >
              <CatSVG state={state} />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
