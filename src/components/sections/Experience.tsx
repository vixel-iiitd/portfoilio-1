"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Code2, Trophy, Layers, Briefcase, Cpu } from "lucide-react";

interface TimelineEvent {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  highlights: string[];
  type: "education" | "cp" | "project" | "milestone";
}

const TIMELINE: TimelineEvent[] = [
  {
    id: "iiit",
    period: "Aug 2019 – Jun 2023",
    title: "B.Tech, Electronics & Communication Engineering",
    subtitle: "IIIT Delhi",
    description:
      "Four years at IIIT Delhi's research-focused ECE program. Alongside the core curriculum — signal processing, communication systems, VLSI — I built deep self-directed expertise in software engineering, algorithms, and system design.",
    icon: GraduationCap,
    accent: "#4f8ef7",
    highlights: [
      "ECE core: signals, comms, VLSI",
      "Strong math & algorithmic foundation",
      "Self-directed backend & DSA track",
      "Graduated June 2023",
    ],
    type: "education",
  },
  {
    id: "cp-start",
    period: "April 2020",
    title: "Competitive Programming Journey Begins",
    subtitle: "Codeforces — handle: Vixel",
    description:
      "Started competitive programming on Codeforces from scratch alongside college. Committed to structured problem-solving — not just grinding but deeply understanding patterns, one contest at a time.",
    icon: Code2,
    accent: "#22d3ee",
    highlights: [
      "First contest rating: 1371",
      "C++ as primary language",
      "195+ rated contests over 3 years",
      "Peak rating 1677 · Expert",
    ],
    type: "cp",
  },
  {
    id: "jpl-intern",
    period: "May 2022 – Jul 2022",
    title: "Software Engineer Intern",
    subtitle: "Jio Platforms Limited · Mumbai",
    description:
      "Summer internship in the data engineering team. Worked on Azure Synapse Analytics and PySpark to build ETL/ELT pipelines migrating on-premise data to the cloud.",
    icon: Briefcase,
    accent: "#f59e0b",
    highlights: [
      "Azure Synapse Analytics",
      "PySpark ETL/ELT pipelines",
      "On-prem to cloud migration",
      "Automated dataflows & workflows",
    ],
    type: "project",
  },
  {
    id: "expert",
    period: "Jan 2023",
    title: "Reached Expert Rank",
    subtitle: "Codeforces — Rating 1631",
    description:
      "After 2.5+ years of disciplined practice alongside college and an internship, crossed the 1600 Expert threshold. Mastered DP, graph algorithms, and constructive problems.",
    icon: Trophy,
    accent: "#34d399",
    highlights: [
      "Crossed Expert threshold (1600)",
      "Rating: 1631",
      "180+ contests to get here",
      "Mastered BFS/DFS, DP, Greedy",
    ],
    type: "milestone",
  },
  {
    id: "jpl-swe",
    period: "Aug 2023 – Jun 2025",
    title: "Software Engineer",
    subtitle: "Jio Platforms Limited · Gurugram",
    description:
      "Full-time backend engineering across three major products — JioCinema, Tira Beauty, and JioCloud PC. Owned microservices architecture, gratification systems, and high-concurrency data pipelines serving tens of millions of users.",
    icon: Layers,
    accent: "#fb923c",
    highlights: [
      "50M concurrent users · IPL 2024",
      "80% API response time reduction",
      "Indirect gratification → 60% users",
      "OAuth 2.0 SSO · Node.js · MongoDB",
    ],
    type: "project",
  },
  {
    id: "google",
    period: "Jun 2025 – Present",
    title: "Software Engineer II",
    subtitle: "Google · Play Analytics Eng · Bengaluru",
    description:
      "Backend engineering on Play Analytics infrastructure at Google. Building and scaling the systems that power analytics for Google Play — the world's largest app distribution platform.",
    icon: Cpu,
    accent: "#4f8ef7",
    highlights: [
      "Google Play Analytics Eng",
      "Backend infrastructure at scale",
      "GCP-native systems",
      "SWE II · Bengaluru",
    ],
    type: "milestone",
  },
];

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"} md:flex-row`}
    >
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 pb-10 pr-6 md:pr-0 md:flex-none md:w-[calc(50%-2rem)]"
      >
        <div
          className="p-5 border border-[#161616] bg-[#0a0a0a] rounded-xl card-hover group"
        >
          {/* Period */}
          <div
            className="text-xs font-code mb-2"
            style={{ color: event.accent }}
          >
            {event.period}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-[#e0e0e0] mb-0.5 group-hover:text-[#f0f0f0] transition-colors">
            {event.title}
          </h3>
          <div className="text-sm text-[#555] mb-3">{event.subtitle}</div>

          {/* Description */}
          <p className="text-sm text-[#666] leading-relaxed mb-3">
            {event.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5">
            {event.highlights.map((h) => (
              <span
                key={h}
                className="text-xs font-code px-2 py-0.5 rounded"
                style={{ color: event.accent, backgroundColor: `${event.accent}12` }}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Center dot - hidden on mobile, shown on lg */}
      <div className="hidden md:flex flex-col items-center w-16 shrink-0 pt-5">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{
            borderColor: `${event.accent}50`,
            backgroundColor: `${event.accent}10`,
          }}
        >
          <event.icon size={14} style={{ color: event.accent }} />
        </motion.div>
      </div>

      {/* Right spacer on even items */}
      <div className="hidden md:block flex-1 md:flex-none md:w-[calc(50%-2rem)]" />
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 80%, rgba(167,139,250,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">04</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Journey</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Engineering evolution,
            <br />
            <span className="text-gradient-blue">one milestone at a time.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#4f8ef7]/20 via-[#1a1a1a] to-transparent" />

          <div className="space-y-0">
            {TIMELINE.map((event, i) => (
              <TimelineItem key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
