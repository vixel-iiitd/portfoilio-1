"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, TrendingUp, Award, Target, Zap } from "lucide-react";

// All 195 real contest ratings (chronological: oldest → newest), indexed 0-based
// Data extracted from full Codeforces contest history (Apr 2020 – Apr 2023)
const CF_RATINGS: number[] = [
  1371,1278,1187,1093,1037, 994, 893, 959, 889, 917, // 1-10
   819, 934,1000, 941,1033, 996, 996,1036,1027,1056, // 11-20
  1016,1060,1012,1004, 964,1061,1077, 964,1038,1010, // 21-30
   907, 804, 714, 615, 529, 725, 869, 988, 994, 893, // 31-40
  1020,1053,1044, 938,1015, 906, 961, 929, 829, 901, // 41-50
  1024,1046,1071,1159,1160,1116,1011, 999,1032,1061, // 51-60
  1197,1236,1250,1236,1244,1236,1208,1298,1390,1311, // 61-70
  1341,1313,1304,1280,1341,1354,1330,1269,1130,1122, // 71-80
  1227,1163,1245,1306,1299,1320,1354,1310,1309,1389, // 81-90
  1332,1269,1134,1098,1189,1248,1225,1229,1395,1335, // 91-100
  1379,1326,1396,1402,1378,1425,1444,1413,1463,1411, // 101-110
  1338,1356,1384,1346,1366,1255,1280,1386,1483,1469, // 111-120
  1410,1392,1390,1340,1336,1508,1500,1481,1461,1501, // 121-130
  1494,1482,1514,1524,1445,1522,1546,1516,1484,1359, // 131-140
  1222,1282,1482,1547,1420,1480,1537,1438,1462,1489, // 141-150
  1457,1512,1391,1395,1462,1390,1367,1340,1443,1559, // 151-160
  1485,1377,1503,1487,1561,1544,1543,1556,1491,1461, // 161-170
  1576,1587,1527,1467,1422,1372,1361,1341,1390,1467, // 171-180
  1389,1489,1371,1485,1551,1631,1613,1575,1432,1491, // 181-190
  1504,1493,1568,1640,1677,                           // 191-195
];

// X-axis milestone labels: [contestIndex, label]
const X_MILESTONES: [number, string][] = [
  [0,   "Apr'20"],
  [34,  "Jan'21"],
  [107, "Jan'22"],
  [178, "Jan'23"],
  [194, "Apr'23"],
];

// Key annotation points on the graph
const GRAPH_ANNOTATIONS = [
  { idx: 34,  label: "Low 529",   color: "#f472b6", above: false },
  { idx: 185, label: "Expert!",   color: "#34d399", above: true  },
  { idx: 194, label: "Peak 1677", color: "#22d3ee", above: true  },
];

const TOPIC_STRENGTHS = [
  { topic: "Dynamic Programming", strength: 88 },
  { topic: "Graph Algorithms", strength: 82 },
  { topic: "BFS / DFS", strength: 90 },
  { topic: "Greedy", strength: 85 },
  { topic: "Binary Search", strength: 80 },
  { topic: "Constructive", strength: 78 },
  { topic: "Math / Number Theory", strength: 72 },
  { topic: "Data Structures", strength: 76 },
];

const PLATFORM_STATS = [
  {
    platform: "Codeforces",
    handle: "Vixel",
    href: "https://codeforces.com/profile/Vixel",
    stats: [
      { label: "Current Rating", value: "1677" },
      { label: "Peak Rating", value: "1677" },
      { label: "Max Rank", value: "Expert" },
      { label: "Contests", value: "195+" },
    ],
    accent: "#4f8ef7",
    badge: "Expert",
    badgeColor: "#4f8ef7",
  },
  {
    platform: "LeetCode",
    handle: "rahul19191",
    href: "https://leetcode.com/u/rahul19191/",
    stats: [
      { label: "Global Rank", value: "213K" },
      { label: "Reputation", value: "32" },
      { label: "Primary Lang", value: "C++" },
      { label: "Profile", value: "Active" },
    ],
    accent: "#f59e0b",
    badge: "Active",
    badgeColor: "#34d399",
  },
  {
    platform: "GitHub",
    handle: "vixel-iiitd",
    href: "https://github.com/vixel-iiitd",
    stats: [
      { label: "Repositories", value: "30+" },
      { label: "CP Solutions", value: "C++" },
      { label: "Followers", value: "3" },
      { label: "Arctic Vault", value: "Badge" },
    ],
    accent: "#e0e0e0",
    badge: "Contributor",
    badgeColor: "#888",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

function RatingGraph() {
  const VW = 520;
  const VH = 200;
  const ML = 46;   // left margin for Y labels
  const MR = 14;   // right margin
  const MT = 22;   // top margin
  const MB = 26;   // bottom margin for X labels

  const plotW = VW - ML - MR;
  const plotH = VH - MT - MB;

  const n = CF_RATINGS.length;
  const rMax = Math.max(...CF_RATINGS);  // 1677
  const rMin = Math.min(...CF_RATINGS);  // 529
  const rPad = 50;
  const yMax = rMax + rPad;
  const yMin = rMin - rPad;
  const yRange = yMax - yMin;

  const toX = (i: number) => ML + (i / (n - 1)) * plotW;
  const toY = (r: number) => MT + plotH - ((r - yMin) / yRange) * plotH;

  // Build smooth polyline path
  const linePath = CF_RATINGS
    .map((r, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(r).toFixed(1)}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${toX(n - 1).toFixed(1)} ${(MT + plotH).toFixed(1)}` +
    ` L ${ML} ${(MT + plotH).toFixed(1)} Z`;

  // Y ticks
  const yTicks = [600, 800, 1000, 1200, 1400, 1600, 1677];

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="cfAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="cfLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#4f8ef7" />
            <stop offset="50%"  stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#4f8ef7" />
          </linearGradient>
          <clipPath id="cfClip">
            <rect x={ML} y={MT} width={plotW} height={plotH} />
          </clipPath>
        </defs>

        {/* Y-axis grid lines + labels */}
        {yTicks.map((r) => {
          const y = toY(r);
          if (y < MT - 2 || y > MT + plotH + 2) return null;
          const isExpert = r === 1600;
          const isPeak   = r === 1677;
          return (
            <g key={r}>
              <line
                x1={ML} y1={y} x2={ML + plotW} y2={y}
                stroke={isExpert || isPeak ? "#4f8ef7" : "#1c1c1c"}
                strokeWidth={isExpert ? "0.9" : "0.5"}
                strokeDasharray={isExpert ? "4,3" : "0"}
                opacity={isExpert ? "0.45" : isPeak ? "0.2" : "1"}
              />
              <text
                x={ML - 5} y={y + 3.5}
                textAnchor="end"
                fill={isExpert ? "#4f8ef7" : isPeak ? "#22d3ee" : "#4a4a4a"}
                fontSize="9" fontFamily="monospace"
              >
                {r}
              </text>
            </g>
          );
        })}

        {/* "Expert" label next to threshold */}
        <text
          x={ML + 4} y={toY(1600) - 3}
          fill="#4f8ef7" fontSize="7.5" fontFamily="monospace" opacity="0.65"
        >
          Expert threshold
        </text>

        {/* Area fill */}
        <g clipPath="url(#cfClip)">
          <path d={areaPath} fill="url(#cfAreaGrad)" />
        </g>

        {/* Main line — animated draw */}
        <g clipPath="url(#cfClip)">
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#cfLineGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </g>

        {/* Annotation dots + labels at key milestones */}
        {GRAPH_ANNOTATIONS.map((ann) => {
          const x = toX(ann.idx);
          const y = toY(CF_RATINGS[ann.idx]);
          const labelY = ann.above ? y - 8 : y + 16;
          // Keep label inside bounds
          const labelX = Math.min(Math.max(x, ML + 20), ML + plotW - 24);
          return (
            <g key={ann.idx}>
              <motion.circle
                cx={x} cy={y} r="4"
                fill={ann.color}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.4, duration: 0.35 }}
              />
              <motion.circle
                cx={x} cy={y} r="7"
                fill="none" stroke={ann.color} strokeWidth="1"
                opacity="0.35"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.35 }}
                viewport={{ once: true }}
                transition={{ delay: 2.5, duration: 0.35 }}
              />
              <motion.text
                x={labelX} y={labelY}
                textAnchor="middle"
                fill={ann.color}
                fontSize="8.5" fontFamily="monospace" fontWeight="600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2.6 }}
              >
                {ann.label}
              </motion.text>
            </g>
          );
        })}

        {/* X-axis date labels */}
        {X_MILESTONES.map(([idx, label]) => (
          <text
            key={idx}
            x={toX(idx)} y={MT + plotH + 17}
            textAnchor="middle"
            fill="#484848" fontSize="8.5" fontFamily="monospace"
          >
            {label}
          </text>
        ))}

        {/* Plot border */}
        <rect
          x={ML} y={MT} width={plotW} height={plotH}
          fill="none" stroke="#1e1e1e" strokeWidth="0.7" rx="2"
        />
      </svg>
    </div>
  );
}

function SkillBar({ topic, strength, delay }: { topic: string; strength: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <span className="text-sm text-[#888] font-code w-44 shrink-0 leading-tight">{topic}</span>
      <div className="flex-1 h-1.5 bg-[#161616] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#4f8ef7] to-[#22d3ee]"
          initial={{ width: 0 }}
          whileInView={{ width: `${strength}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-sm text-[#666] font-code w-8 text-right tabular-nums">{strength}%</span>
    </motion.div>
  );
}

export default function CompetitiveProgramming() {
  return (
    <section id="competitive" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 60%, rgba(79,142,247,0.05) 0%, transparent 60%)",
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
            <span className="font-code text-xs text-[#4f8ef7]">02</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#555] font-code uppercase tracking-widest">
              Competitive Programming
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Algorithmic depth,
            <br />
            <span className="text-gradient-blue">proven in competition.</span>
          </h2>
          <p className="mt-4 text-[#777] text-base sm:text-lg max-w-xl leading-relaxed">
            195+ rated contests on Codeforces. Peak Expert rank (1677). Not just
            grinding problems — developing genuine algorithmic intuition.
          </p>
        </motion.div>

        {/* Highlight metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: TrendingUp, label: "Peak Rating", value: 1677, suffix: "", color: "#4f8ef7", note: "Expert" },
            { icon: Award, label: "Max Rank", value: 0, display: "Expert", color: "#22d3ee", note: "CF Expert" },
            { icon: Target, label: "Contests", value: 195, suffix: "+", color: "#34d399", note: "Codeforces" },
            { icon: Zap, label: "Problem Tags", value: 18, suffix: "+", color: "#a78bfa", note: "Categories" },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="p-5 border border-[#161616] bg-[#0a0a0a] rounded-xl hover:border-[#222] transition-colors"
            >
              <metric.icon size={16} style={{ color: metric.color }} className="mb-3 opacity-70" />
              <div className="text-3xl font-bold font-code text-[#f0f0f0] mb-1">
                {metric.display ? (
                  metric.display
                ) : (
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                )}
              </div>
              <div className="text-sm text-[#666] mb-0.5">{metric.label}</div>
              <div className="text-sm font-medium" style={{ color: metric.color }}>
                {metric.note}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Rating graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-[#161616] bg-[#0a0a0a] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#e0e0e0]">
                  Rating Trajectory
                </h3>
                <p className="text-sm text-[#555] mt-0.5">
                  Apr 2020 → Apr 2023
                </p>
              </div>
              <a
                href="https://codeforces.com/profile/Vixel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#444] hover:text-[#888] transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mb-4 text-sm font-code text-[#555]">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-gradient-to-r from-[#4f8ef7] to-[#22d3ee] rounded" />
                <span>Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 border-t border-dashed border-[#4f8ef7]/50" />
                <span>Expert threshold (1600)</span>
              </div>
            </div>

            {/* Graph — self-contained, no overflow */}
            <div className="w-full">
              <RatingGraph />
            </div>

            {/* Journey milestones */}
            <div className="mt-5 grid grid-cols-4 gap-2 pt-4 border-t border-[#141414]">
              {[
                { label: "First contest", value: "1371", date: "Apr '20", color: "#555" },
                { label: "Lowest point", value: "529",  date: "Jan '21", color: "#f472b6" },
                { label: "First Expert", value: "1631", date: "Jan '23", color: "#34d399" },
                { label: "Peak rating",  value: "1677", date: "Apr '23", color: "#22d3ee" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-base font-bold font-code" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="text-sm text-[#666] mt-0.5 leading-tight">{m.label}</div>
                  <div className="text-xs text-[#444] mt-0.5">{m.date}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Topic strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="border border-[#161616] bg-[#0a0a0a] rounded-2xl p-6"
          >
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#e0e0e0]">
                Topic Proficiency
              </h3>
              <p className="text-sm text-[#555] mt-1">Based on contest performance &amp; problem history</p>
            </div>

            <div className="space-y-4">
              {TOPIC_STRENGTHS.map((t, i) => (
                <SkillBar
                  key={t.topic}
                  topic={t.topic}
                  strength={t.strength}
                  delay={i * 0.06}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {PLATFORM_STATS.map((p, i) => (
            <motion.a
              key={p.platform}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="block p-5 border border-[#161616] bg-[#0a0a0a] rounded-xl card-hover group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-base font-semibold text-[#e0e0e0] mb-0.5">
                    {p.platform}
                  </div>
                  <div className="font-code text-sm" style={{ color: p.accent }}>
                    @{p.handle}
                  </div>
                </div>
                <div
                  className="px-2 py-0.5 rounded text-xs font-semibold font-code"
                  style={{ color: p.badgeColor, backgroundColor: `${p.badgeColor}15` }}
                >
                  {p.badge}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.stats.map((s) => (
                  <div key={s.label} className="bg-[#0f0f0f] rounded-lg p-2.5">
                    <div className="text-base font-bold font-code text-[#e0e0e0]">
                      {s.value}
                    </div>
                    <div className="text-sm text-[#555] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Contest philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 p-6 border border-[#161616] bg-[#0a0a0a] rounded-2xl"
        >
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                label: "Primary Language",
                value: "C++20",
                note: "GCC 13-64, modern features",
                color: "#4f8ef7",
              },
              {
                label: "Journey Started",
                value: "Apr 2020",
                note: "195+ contests · 3+ years",
                color: "#22d3ee",
              },
              {
                label: "Strongest Areas",
                value: "BFS/DFS, DP",
                note: "Graph + Dynamic Programming",
                color: "#34d399",
              },
            ].map((fact) => (
              <div key={fact.label} className="text-center sm:text-left">
                <div className="text-base font-bold font-code" style={{ color: fact.color }}>
                  {fact.value}
                </div>
                <div className="text-sm text-[#d0d0d0] font-medium mt-0.5">{fact.label}</div>
                <div className="text-sm text-[#666] mt-1">{fact.note}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
