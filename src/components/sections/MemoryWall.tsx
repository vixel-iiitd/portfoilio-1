"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const WALL_W = 5300;
const WALL_H = 680;

// ─── Types ────────────────────────────────────────────────────────────────────
type MemType = "polaroid" | "sticky" | "note" | "ticket" | "postcard";

interface Mem {
  id: string; type: MemType;
  x: number; y: number; rotation: number; scale: number; z: number;
  quote: string; story?: string;
  flutter?: boolean; flutterDur?: number; flutterDelay?: number;
  // polaroid
  grad?: string; caption?: string; img?: string;
  // sticky / note
  bg?: string; lines?: string; text?: string; accent?: string;
  // ticket / postcard
  label?: string; tag?: string;
}

// ─── Memory data ──────────────────────────────────────────────────────────────
const ITEMS: Mem[] = [
  // Zone 1 — IIIT / Student
  { id:"iiit", type:"polaroid", x:80, y:80, rotation:-4, scale:1, z:10,
    grad:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
    img:"/memories/batch photo.jpg",
    caption:"IIIT Delhi",
    quote:"The place that changed everything.",
    story:"First day on campus. The monsoon was pouring. I had no idea what the next 4 years would bring — or that I'd end up at Google.",
  },
  { id:"first-code", type:"sticky", x:330, y:28, rotation:4, scale:1.05, z:12,
    bg:"#fef9c3", lines:"First C++ program:\nHello, World!\n\n(took me 2 hours)",
    quote:"Everyone starts somewhere.",
    flutter:true, flutterDur:3.2, flutterDelay:0.5,
  },
  { id:"iiit-culture", type:"note", x:590, y:220, rotation:-2, scale:0.95, z:8,
    accent:"#4f8ef7",
    text:"The best part of IIIT was the culture — everyone was obsessed with building things.",
    quote:"Curiosity is contagious.",
  },
  { id:"dsa-todo", type:"sticky", x:160, y:400, rotation:7, scale:1, z:9,
    bg:"#dbeafe", lines:"TODO: Learn DSA properly\n(still doing this tbh)",
    quote:"The journey never really ends.",
    flutter:true, flutterDur:4.1, flutterDelay:2.1,
  },
  { id:"late-nights", type:"polaroid", x:710, y:55, rotation:5, scale:0.92, z:11,
    grad:"linear-gradient(135deg,#1a0533,#2d1b69,#11998e)",
    img:"/memories/me.jpg",
    caption:"Me in Goa",
    quote:"Some trips stay with you forever.",
    story:"Goa. One of those rare breaks where I genuinely switched off. The sea, the food, the people — perfect reset.",
  },
  { id:"chai", type:"sticky", x:450, y:510, rotation:-3, scale:0.88, z:6,
    bg:"#fef3c7", lines:"Chai > coffee\n(fight me)",
    quote:"The best ideas come between sips.",
    flutter:true, flutterDur:3.8, flutterDelay:1.3,
  },

  // Zone 2 — CP Journey
  { id:"first-cf", type:"ticket", x:980, y:38, rotation:-3, scale:1, z:14,
    accent:"#4f8ef7", label:"CODEFORCES",
    text:"First Rated Contest", tag:"APR 2020 · VIXEL",
    quote:"Rating 1371. I was hooked immediately.",
    story:"Solved one problem and felt like a genius. I had absolutely no idea what was ahead.",
  },
  { id:"quit-note", type:"note", x:1370, y:95, rotation:4, scale:1, z:13,
    accent:"#f472b6",
    text:"I almost quit competitive programming at rating 529.\n\nGlad I didn't.",
    quote:"The best view comes after the hardest climb.",
    story:"I wrote this note after hitting 529 and pinned it above my desk. Read it every morning for six months.",
  },
  { id:"five-star", type:"ticket", x:1642, y:195, rotation:2, scale:1, z:13,
    accent:"#f59e0b", label:"CODECHEF",
    text:"5★ Achieved", tag:"FEB 2022 · DIV 1",
    quote:"Two platforms. Two ways to sharpen the same skill.",
    story:"Hit 5 stars on CodeChef in February 2022 while grinding alongside college. The consistency was starting to compound.",
  },
  { id:"grind", type:"sticky", x:1590, y:355, rotation:-5, scale:1.1, z:10,
    bg:"#fce7f3", lines:"Solved 500 problems.\nUnderstood maybe 200.\n\n(still counts)",
    quote:"Repetition is the mother of skill.",
    flutter:true, flutterDur:4.5, flutterDelay:3.2,
  },
  { id:"dp-lesson", type:"postcard", x:960, y:510, rotation:3, scale:0.95, z:8,
    accent:"#fb923c", label:"LESSON LEARNED",
    text:"DP is not about memorizing states. It's about understanding the problem deeply enough to not need memorization.",
    quote:"Understanding beats memorizing. Always.",
  },

  // ── Zone 3: 2022-2024 ── (TOP band y:55-180, MID band y:270-390, BOT band y:450-580)
  // TOP band
  { id:"iiit-farewell", type:"polaroid", x:2260, y:78, rotation:-5, scale:1.0, z:13,
    grad:"linear-gradient(135deg,#2d1b69,#6b21a8)",
    img:"/memories/farewell.jpg",
    caption:"IIIT Farewell, May 2023",
    quote:"Four years. A lifetime of lessons.",
    story:"The last day on campus. Everyone going their separate ways. Bittersweet doesn't begin to cover it — these people shaped who I am.",
  },
  { id:"50m", type:"sticky", x:3160, y:68, rotation:4, scale:1.05, z:15,
    bg:"#fef9c3", lines:"50M concurrent users.\n\nFifty. Million.",
    quote:"Scale changes everything.",
    story:"IPL 2024 peak. Watching metrics in real-time at midnight. The system held. That feeling is indescribable.",
    flutter:true, flutterDur:3.0, flutterDelay:0.8,
  },
  // MID band
  { id:"peak", type:"ticket", x:2020, y:285, rotation:6, scale:0.95, z:12,
    accent:"#22d3ee", label:"PERSONAL BEST",
    text:"Rating 1677", tag:"195 CONTESTS · CF EXPERT",
    quote:"195 contests. Each one a lesson.",
  },
  { id:"scribble-day", type:"polaroid", x:2530, y:278, rotation:5, scale:0.95, z:11,
    grad:"linear-gradient(135deg,#7c3aed,#c084fc)",
    img:"/memories/scribble day 2023.jpg",
    caption:"Scribble Day, April 2023",
    quote:"One last adventure before the real world.",
    story:"April 2023. A few weeks before IIIT farewell. Campus event, great people, zero responsibilities. I didn't know how rare that feeling would become.",
  },
  { id:"ipl", type:"postcard", x:3010, y:345, rotation:-3, scale:1, z:9,
    accent:"#f59e0b", label:"IPL 2024",
    text:"The system stayed up. I stayed up. Both of us barely.",
    quote:"Good systems fail gracefully. Great ones don't fail.",
    story:"Night before IPL final. Me and the team monitoring dashboards. The gratification system hit 60% of all users. Best night of my engineering career.",
  },
  // BOT band
  { id:"delhi-zoo", type:"polaroid", x:2210, y:462, rotation:4, scale:0.97, z:10,
    grad:"linear-gradient(135deg,#134e5e,#71b280)",
    img:"/memories/me at zoo.jpg",
    caption:"Delhi, March 2023",
    quote:"Best days happen between deadlines.",
    story:"March 2023 — right between my Expert milestone and IIIT farewell. A spontaneous Delhi trip I still smile about.",
  },
  { id:"jio-fulltime", type:"ticket", x:2620, y:470, rotation:-5, scale:1, z:10,
    accent:"#f12711", label:"JIO PLATFORMS",
    text:"Full-time SWE", tag:"AUG 2023 · GURUGRAM",
    quote:"First full-time job. Everything just got real.",
    story:"August 2023. First day as a full-time software engineer at Jio Platforms. The intern badge was gone. This was real.",
  },
  { id:"system-design", type:"sticky", x:2970, y:540, rotation:5, scale:0.9, z:7,
    bg:"#f0fdf4", lines:"Never optimize\nbefore you measure.\n\nNever measure\nbefore it works.",
    quote:"Premature optimization is still the root of all evil.",
    flutter:true, flutterDur:3.8, flutterDelay:2.5,
  },
  { id:"bug-comma", type:"sticky", x:1720, y:545, rotation:8, scale:1, z:7,
    bg:"#fee2e2", lines:"The bug was a missing comma.\n\n6 hours.\n\nMissing. Comma.",
    quote:"Every bug is a lesson in humility.",
  },

  // ── Zone 4: Google 2025 + Future ──
  // TOP band
  { id:"google", type:"polaroid", x:3580, y:55, rotation:-5, scale:1.15, z:20,
    grad:"linear-gradient(135deg,#4285F4 0%,#34A853 35%,#FBBC05 65%,#EA4335 100%)",
    img:"/memories/google.jpg",
    caption:"Google. June 2025.",
    quote:"The email that changed everything. Again.",
    story:"Read the offer letter six times. Called my parents. Went for a long walk. Sat with it before it finally felt real.",
  },
  { id:"beginning", type:"note", x:4080, y:105, rotation:2, scale:1, z:11,
    accent:"#4f8ef7",
    text:"This is not the destination.\n\nThis is still the beginning.",
    quote:"The best is still ahead.",
  },
  { id:"gym", type:"sticky", x:4520, y:148, rotation:6, scale:1, z:9,
    bg:"#ede9fe", lines:"Gym > debugging\n(sometimes)\n\n(rarely)",
    quote:"Balance is a myth. Energy management is real.",
    flutter:true, flutterDur:3.6, flutterDelay:1.9,
  },
  // MID band
  { id:"swe2", type:"ticket", x:3780, y:280, rotation:4, scale:1, z:14,
    accent:"#34A853", label:"GOOGLE",
    text:"Play Analytics Eng", tag:"SWE II · BENGALURU · 2025",
    quote:"Backend at the scale of billions.",
    story:"Every stat you see in the Play Console — we make that work. The responsibility still hits me sometimes.",
  },
  { id:"to-future", type:"postcard", x:4260, y:342, rotation:-4, scale:0.95, z:8,
    accent:"#8b5cf6", label:"TO FUTURE ME",
    text:"Every hard problem you solved was once impossible.\n\nKeep going.",
    quote:"You've solved harder problems than this.",
  },
  { id:"jan2026", type:"polaroid", x:4720, y:255, rotation:-2, scale:1.0, z:12,
    grad:"linear-gradient(135deg,#1a1a2e,#0f3460)",
    img:"/memories/PXL_20260125_125947440.jpg",
    caption:"Mysore, Jan 2026",
    quote:"Sometimes you need to step away and just breathe.",
    story:"Took a trip to Mysore in January 2026. Palaces, silk, dosas, and a much-needed reset. Life outside the terminal is pretty good too.",
  },
  // BOT band
  { id:"day1", type:"sticky", x:3620, y:468, rotation:-7, scale:1.1, z:13,
    bg:"#d1fae5", lines:"Day 1 at Google:\nImpostor syndrome: MAX\nLearning curve: vertical\nExcitement: infinite",
    quote:"Being the dumbest in the room is a privilege.",
    flutter:true, flutterDur:4.2, flutterDelay:4.1,
  },
  { id:"pressure", type:"note", x:4040, y:522, rotation:-4, scale:0.95, z:6,
    accent:"#22d3ee",
    text:"Competitive programming didn't teach me algorithms.\n\nIt taught me to think clearly under pressure.",
    quote:"Clarity under pressure. The real skill.",
  },
];

// ─── Tape decorations ─────────────────────────────────────────────────────────
function Tape({ ox = 55, oy = -8, rot = -5 }: { ox?: number; oy?: number; rot?: number }) {
  return (
    <div className="absolute pointer-events-none" style={{
      width: 42, height: 13, left: ox, top: oy,
      background: "rgba(215,195,165,0.55)", transform: `rotate(${rot}deg)`,
      borderRadius: 2, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.07)",
    }} />
  );
}

function Pin({ color = "#ef4444" }: { color?: string }) {
  return (
    <div className="absolute pointer-events-none" style={{ top: -13, left: "50%", transform: "translateX(-50%)", zIndex: 20 }}>
      <div style={{
        width: 12, height: 12, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}bb, ${color})`,
        boxShadow: `0 2px 5px rgba(0,0,0,0.45), inset 0 -2px 3px rgba(0,0,0,0.2)`,
      }} />
    </div>
  );
}

// ─── Quote overlay (shared) ───────────────────────────────────────────────────
function QuoteOverlay({ quote, bg = "rgba(0,0,0,0.82)" }: { quote: string; bg?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: bg, padding: 12, zIndex: 30 }}
    >
      <p style={{ color: "white", fontSize: 11, textAlign: "center", fontStyle: "italic",
        fontFamily: "Georgia,'Times New Roman',serif", lineHeight: 1.55 }}>
        &ldquo;{quote}&rdquo;
      </p>
    </motion.div>
  );
}

// ─── Polaroid ─────────────────────────────────────────────────────────────────
function Polaroid({ item, hovered, quoted }: { item: Mem; hovered: boolean; quoted: boolean }) {
  return (
    <div style={{
      background: "white", padding: "10px 10px 30px", width: 188, position: "relative",
      boxShadow: hovered ? "0 22px 55px rgba(0,0,0,0.42),0 8px 20px rgba(0,0,0,0.28)" : "0 4px 20px rgba(0,0,0,0.26),0 2px 8px rgba(0,0,0,0.18)",
      transition: "box-shadow 0.3s ease",
    }}>
      <Tape ox={58} oy={-8} rot={-4} />
      <div style={{ width: "100%", height: 152, background: item.grad, position: "relative", overflow: "hidden" }}>
        {item.img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.img} alt={item.caption ?? "memory"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center top" }}
          />
        )}
        <motion.div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.45) 100%)" }}
          animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        />
        <AnimatePresence>{quoted && <QuoteOverlay quote={item.quote!} />}</AnimatePresence>
      </div>
      <p style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: "#555",
        fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "0.01em" }}>
        {item.caption}
      </p>
    </div>
  );
}

// ─── Sticky note ──────────────────────────────────────────────────────────────
function StickyNote({ item, hovered, quoted }: { item: Mem; hovered: boolean; quoted: boolean }) {
  const lines = (item.lines ?? "").split("\n");
  return (
    <div style={{
      background: item.bg ?? "#fef3c7", padding: "18px 14px 14px",
      width: 155, minHeight: 115, position: "relative",
      boxShadow: hovered ? "0 14px 40px rgba(0,0,0,0.32),-2px 4px 8px rgba(0,0,0,0.15)" : "3px 5px 14px rgba(0,0,0,0.2),-1px 2px 5px rgba(0,0,0,0.1)",
      clipPath: "polygon(0 0,calc(100% - 13px) 0,100% 13px,100% 100%,0 100%)",
      transition: "box-shadow 0.3s ease",
    }}>
      <Pin color="#94a3b8" />
      {/* Fold corner shadow */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: 13, height: 13,
        background: "linear-gradient(225deg,rgba(0,0,0,0.18) 50%,transparent 50%)",
      }} />
      {/* Ruled lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 26 + i * 16, height: 1, background: "#4444ff" }} />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {lines.map((l, i) => (
          <p key={i} style={{ fontSize: 12, lineHeight: 1.55, color: "#374151",
            fontFamily: "Georgia,'Times New Roman',serif",
            ...(l === "" ? { height: 8 } : {}) }}>
            {l}
          </p>
        ))}
      </div>
      <AnimatePresence>{quoted && <QuoteOverlay quote={item.quote!} bg="rgba(0,0,0,0.88)" />}</AnimatePresence>
    </div>
  );
}

// ─── Handwritten note ─────────────────────────────────────────────────────────
function Note({ item, hovered, quoted }: { item: Mem; hovered: boolean; quoted: boolean }) {
  const acc = item.accent ?? "#4f8ef7";
  return (
    <div style={{
      background: "#faf8f4", borderLeft: `3px solid ${acc}`,
      padding: "14px 16px 14px 14px", width: 218, position: "relative",
      boxShadow: hovered ? "0 18px 52px rgba(0,0,0,0.32)" : "2px 4px 18px rgba(0,0,0,0.18)",
      transition: "box-shadow 0.3s ease",
    }}>
      <Pin color={acc} />
      {/* Ruled lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.09 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 16 + i * 18, height: 1, background: "#888" }} />
        ))}
      </div>
      <p style={{ position: "relative", zIndex: 1, fontSize: 12, lineHeight: 1.75, color: "#374151",
        fontFamily: "Georgia,'Times New Roman',serif", whiteSpace: "pre-line" }}>
        {item.text}
      </p>
      <AnimatePresence>
        {quoted && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", bottom: 8, left: 14, right: 14, fontSize: 10,
              fontStyle: "italic", color: acc, fontFamily: "Georgia,serif",
              borderTop: `1px solid ${acc}30`, paddingTop: 6, zIndex: 2 }}>
            &ldquo;{item.quote}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Ticket ───────────────────────────────────────────────────────────────────
function Ticket({ item, hovered, quoted }: { item: Mem; hovered: boolean; quoted: boolean }) {
  const acc = item.accent ?? "#4f8ef7";
  return (
    <div style={{
      background: "#0d0d18", border: `1px solid ${acc}38`,
      padding: "14px 18px", width: 212, position: "relative", overflow: "hidden",
      boxShadow: hovered ? `0 18px 55px rgba(0,0,0,0.55),0 0 22px ${acc}28` : "2px 4px 18px rgba(0,0,0,0.42)",
      transition: "box-shadow 0.3s ease",
    }}>
      {/* Ticket holes */}
      <div style={{ position:"absolute", left:-6, top:"50%", width:12, height:12, borderRadius:"50%", background:"#ede8df", transform:"translateY(-50%)" }} />
      <div style={{ position:"absolute", right:-6, top:"50%", width:12, height:12, borderRadius:"50%", background:"#ede8df", transform:"translateY(-50%)" }} />
      {/* Dashed mid-line */}
      <div style={{ position:"absolute", top:"48%", left:8, right:8, borderTop:`1px dashed ${acc}25` }} />
      {item.label && (
        <p style={{ fontSize: 9, letterSpacing: "0.18em", color: acc, fontFamily: "monospace",
          textTransform: "uppercase", marginBottom: 6 }}>{item.label}</p>
      )}
      <p style={{ fontSize: 19, fontWeight: 700, color: "#f0f0f0", fontFamily: "monospace", marginBottom: 4 }}>
        {item.text}
      </p>
      {item.tag && (
        <p style={{ fontSize: 9, letterSpacing: "0.1em", color: "#666", fontFamily: "monospace" }}>{item.tag}</p>
      )}
      <AnimatePresence>
        {quoted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${acc}18,rgba(10,10,24,0.92))`, padding: 14 }}>
            <p style={{ color: acc, fontSize: 11, textAlign: "center", fontStyle: "italic",
              fontFamily: "Georgia,serif", lineHeight: 1.5 }}>
              &ldquo;{item.quote}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Postcard ─────────────────────────────────────────────────────────────────
function Postcard({ item, hovered, quoted }: { item: Mem; hovered: boolean; quoted: boolean }) {
  const acc = item.accent ?? "#f59e0b";
  return (
    <div style={{
      background: "#faf8f4", border: "1px solid #e5ddd3",
      padding: "14px", width: 262, display: "flex", gap: 12, position: "relative",
      boxShadow: hovered ? "0 18px 52px rgba(0,0,0,0.28)" : "2px 4px 18px rgba(0,0,0,0.16)",
      transition: "box-shadow 0.3s ease",
    }}>
      <Pin color={acc} />
      <div style={{ flex: 1 }}>
        {item.label && (
          <p style={{ fontSize: 8, letterSpacing: "0.2em", color: acc, fontFamily: "monospace",
            textTransform: "uppercase", marginBottom: 7 }}>✉ {item.label}</p>
        )}
        <p style={{ fontSize: 12, lineHeight: 1.65, color: "#374151", fontFamily: "Georgia,'Times New Roman',serif", whiteSpace: "pre-line" }}>
          {item.text}
        </p>
      </div>
      {/* Stamp */}
      <div style={{ width: 46, height: 54, flexShrink: 0, border: `2px solid ${acc}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 18, color: acc }}>✦</span>
        <span style={{ fontSize: 7, letterSpacing: 1, fontFamily: "monospace", color: acc, marginTop: 3 }}>2025</span>
      </div>
      <AnimatePresence>
        {quoted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.82)", padding: 16 }}>
            <p style={{ color: "white", fontSize: 11, textAlign: "center", fontStyle: "italic",
              fontFamily: "Georgia,serif", lineHeight: 1.55 }}>
              &ldquo;{item.quote}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MemoryCard ───────────────────────────────────────────────────────────────
function MemoryCard({ item, onOpen, getIsDragging }: {
  item: Mem; onOpen: (m: Mem) => void; getIsDragging: () => boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [quoted, setQuoted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    setHovered(true);
    timer.current = setTimeout(() => setQuoted(true), 900);
  }, []);
  const onLeave = useCallback(() => {
    setHovered(false); setQuoted(false);
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const onClick = useCallback(() => {
    if (getIsDragging() || !item.story) return;
    onOpen(item);
  }, [item, onOpen, getIsDragging]);

  const baseAnim = item.flutter ? {
    rotate: [item.rotation, item.rotation + 1.5, item.rotation - 0.8, item.rotation + 0.4, item.rotation],
    y: [0, -1, 0.5, 0],
  } : { rotate: item.rotation, scale: item.scale, y: 0 };

  const baseTransition = item.flutter ? {
    duration: item.flutterDur ?? 3.5,
    delay: item.flutterDelay ?? 0,
    repeat: Infinity, ease: "easeInOut" as const,
  } : { type: "spring" as const, stiffness: 180, damping: 22 };

  const content = (() => {
    switch (item.type) {
      case "polaroid": return <Polaroid item={item} hovered={hovered} quoted={quoted} />;
      case "sticky":   return <StickyNote item={item} hovered={hovered} quoted={quoted} />;
      case "note":     return <Note item={item} hovered={hovered} quoted={quoted} />;
      case "ticket":   return <Ticket item={item} hovered={hovered} quoted={quoted} />;
      case "postcard": return <Postcard item={item} hovered={hovered} quoted={quoted} />;
    }
  })();

  return (
    <motion.div
      className="absolute select-none"
      style={{ left: item.x, top: item.y, zIndex: hovered ? 100 : item.z,
        cursor: item.story ? "pointer" : "default", willChange: "transform" }}
      animate={hovered ? { rotate: item.rotation * 0.45, scale: item.scale * 1.07, y: -10 } : baseAnim}
      transition={hovered ? { type: "spring", stiffness: 380, damping: 24 } : baseTransition}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onClick={onClick}
    >
      {content}
    </motion.div>
  );
}

// ─── Journal modal ────────────────────────────────────────────────────────────
function JournalModal({ item, onClose }: { item: Mem | null; onClose: () => void }) {
  if (!item) return null;
  const title = item.caption ?? item.label ?? "Memory";
  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#faf8f4", borderRadius: 14, padding: "36px 32px",
          maxWidth: 480, width: "100%", boxShadow: "0 28px 90px rgba(0,0,0,0.6)",
          position: "relative", border: "1px solid #e5ddd3" }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 16, background: "none", border: "none",
          color: "#aaa", fontSize: 22, cursor: "pointer", lineHeight: 1,
        }}>×</button>
        <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "#bbb", fontFamily: "monospace",
          textTransform: "uppercase", marginBottom: 10 }}>📖 Memory</p>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 16,
          fontFamily: "Georgia,'Times New Roman',serif" }}>{title}</h3>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "#374151",
          fontFamily: "Georgia,'Times New Roman',serif" }}>{item.story}</p>
        <p style={{ marginTop: 18, fontSize: 13, fontStyle: "italic", color: "#999",
          fontFamily: "Georgia,serif", borderTop: "1px solid #e5ddd3", paddingTop: 14 }}>
          &ldquo;{item.quote}&rdquo;
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Dust particles ───────────────────────────────────────────────────────────
const DUST = [
  { left:8, top:70, w:1.5, dur:5.2, delay:0 },
  { left:22, top:55, w:1, dur:7.1, delay:1.4 },
  { left:37, top:80, w:2, dur:4.8, delay:2.8 },
  { left:53, top:65, w:1.2, dur:6.5, delay:0.6 },
  { left:68, top:75, w:1.8, dur:5.9, delay:3.5 },
  { left:81, top:60, w:1, dur:8.0, delay:1.9 },
  { left:92, top:72, w:1.5, dur:6.2, delay:4.2 },
  { left:15, top:85, w:1.2, dur:7.5, delay:2.1 },
  { left:44, top:78, w:0.8, dur:5.6, delay:3.8 },
  { left:75, top:82, w:1.4, dur:6.8, delay:0.9 },
];

function DustParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 45 }}>
      {DUST.map((d, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: d.w, height: d.w, left: `${d.left}%`, top: `${d.top}%`,
            background: "rgba(160,120,80,0.55)" }}
          animate={{ y: [0, -(80 + i * 18)], x: [(i % 3 - 1) * 20, (i % 3 - 1) * 45], opacity: [0, 0.5, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export default function MemoryWall() {
  const [openedItem, setOpenedItem] = useState<Mem | null>(null);
  const [constraints, setConstraints] = useState({ left: -2700, right: 0, top: 0, bottom: 0 });
  const [showHint, setShowHint] = useState(true);
  const isDragging = useRef(false);
  const wallX = useMotionValue(0);
  const [winW, setWinW] = useState(1280);

  useEffect(() => {
    const update = () => {
      setWinW(window.innerWidth);
      setConstraints({ left: -(WALL_W - window.innerWidth), right: 0, top: 0, bottom: 0 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const progressPct = useTransform(wallX, [-(WALL_W - winW), 0], [100, 0]);

  return (
    <section id="memory" className="relative" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">06</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a30]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Memory Wall</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Fragments of a life
            <br /><span className="text-gradient-blue">in progress.</span>
          </h2>
          <p className="mt-3 text-[#666] text-base max-w-lg leading-relaxed">
            Drag to explore. Hover to feel. Click the ones that glow.
          </p>
        </motion.div>
      </div>

      {/* Wall container */}
      <div className="relative overflow-hidden" style={{ height: WALL_H, background: "#ede8df", cursor: "grab" }}>
        {/* Film grain overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 48,
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>")`,
          opacity: 0.35,
          mixBlendMode: "multiply",
        }} />

        {/* Dust particles */}
        <DustParticles />

        {/* Drag hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 46 }}>
              <motion.div animate={{ x: [-6, 6, -6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-code"
                style={{ background: "rgba(8,8,24,0.7)", color: "#ccc", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 16 }}>←</span>
                drag to explore memories
                <span style={{ fontSize: 16 }}>→</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal string lines */}
        <div className="absolute pointer-events-none" style={{ zIndex: 2, inset: 0 }}>
          <div style={{ position: "absolute", top: 190, left: 0, right: 0, height: 1, background: "rgba(101,63,30,0.14)" }} />
          <div style={{ position: "absolute", top: 420, left: 0, right: 0, height: 1, background: "rgba(101,63,30,0.10)" }} />
        </div>

        {/* Draggable canvas */}
        <motion.div
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.04}
          dragTransition={{ bounceStiffness: 180, bounceDamping: 28 }}
          style={{ x: wallX, width: WALL_W, height: "100%", position: "relative", touchAction: "pan-y", cursor: "inherit" }}
          onDragStart={() => { isDragging.current = true; setShowHint(false); }}
          onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 60); }}
          whileDrag={{ cursor: "grabbing" }}
        >
          {/* Cork texture overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(ellipse at 30% 40%, rgba(180,140,100,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 60%, rgba(160,120,80,0.06) 0%, transparent 50%)`,
          }} />

          {/* Memory items */}
          {ITEMS.map((item) => (
            <MemoryCard
              key={item.id}
              item={item}
              onOpen={setOpenedItem}
              getIsDragging={() => isDragging.current}
            />
          ))}

        </motion.div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2" style={{ zIndex: 49 }}>
          <div style={{ width: 100, height: 3, background: "rgba(101,63,30,0.2)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div style={{ height: "100%", background: "#92400e", width: progressPct }} />
          </div>
        </div>
      </div>

      {/* Journal modal */}
      <AnimatePresence>
        {openedItem && <JournalModal item={openedItem} onClose={() => setOpenedItem(null)} />}
      </AnimatePresence>
    </section>
  );
}
