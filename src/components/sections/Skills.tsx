"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import type { ReactElement } from "react";

interface Skill {
  name: string;
  level: "expert" | "proficient" | "familiar";
}

interface SkillGroup {
  id: string;
  label: string;
  accent: string;
  cx: number;
  cy: number;
  skills: Skill[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    accent: "#4f8ef7",
    cx: 120,
    cy: 130,
    skills: [
      { name: "C++20", level: "expert" },
      { name: "Java", level: "proficient" },
      { name: "TypeScript", level: "proficient" },
      { name: "Python", level: "proficient" },
      { name: "JavaScript", level: "proficient" },
      { name: "MATLAB", level: "familiar" },
      { name: "Scala", level: "familiar" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "#22d3ee",
    cx: 380,
    cy: 100,
    skills: [
      { name: "Node.js", level: "expert" },
      { name: "Django", level: "proficient" },
      { name: "Spring Boot", level: "proficient" },
      { name: "REST APIs", level: "expert" },
      { name: "Microservices", level: "expert" },
      { name: "WebSockets", level: "proficient" },
      { name: "Express.js", level: "proficient" },
      { name: "OAuth 2.0", level: "proficient" },
      { name: "GraphQL", level: "familiar" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    accent: "#a78bfa",
    cx: 650,
    cy: 130,
    skills: [
      { name: "MongoDB", level: "expert" },
      { name: "Redis", level: "expert" },
      { name: "PostgreSQL", level: "proficient" },
      { name: "MySQL", level: "proficient" },
      { name: "NoSQL", level: "proficient" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#34d399",
    cx: 250,
    cy: 300,
    skills: [
      { name: "React", level: "proficient" },
      { name: "Next.js", level: "proficient" },
      { name: "Tailwind CSS", level: "proficient" },
      { name: "Framer Motion", level: "proficient" },
      { name: "HTML/CSS", level: "expert" },
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms & DS",
    accent: "#fb923c",
    cx: 520,
    cy: 300,
    skills: [
      { name: "Dynamic Programming", level: "expert" },
      { name: "Graph Algorithms", level: "expert" },
      { name: "BFS / DFS", level: "expert" },
      { name: "Binary Search", level: "expert" },
      { name: "Segment Trees", level: "proficient" },
      { name: "Union Find", level: "proficient" },
      { name: "Greedy Algorithms", level: "expert" },
      { name: "Divide & Conquer", level: "proficient" },
      { name: "Bit Manipulation", level: "proficient" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Cloud",
    accent: "#f472b6",
    cx: 750,
    cy: 300,
    skills: [
      { name: "GCP", level: "proficient" },
      { name: "Git", level: "expert" },
      { name: "Docker", level: "proficient" },
      { name: "Linux", level: "proficient" },
      { name: "PySpark", level: "proficient" },
      { name: "Azure Synapse", level: "familiar" },
      { name: "Maven", level: "proficient" },
    ],
  },
  {
    id: "systems",
    label: "System Design",
    accent: "#f59e0b",
    cx: 450,
    cy: 450,
    skills: [
      { name: "API Design", level: "expert" },
      { name: "Caching Strategies", level: "expert" },
      { name: "Concurrency Control", level: "proficient" },
      { name: "Database Design", level: "proficient" },
      { name: "Event-Driven Arch.", level: "proficient" },
      { name: "Load Balancing", level: "familiar" },
    ],
  },
];

const LEVEL_RADIUS: Record<string, number> = {
  expert: 8,
  proficient: 6,
  familiar: 4.5,
};

// Pre-calculate node positions around each category center
function layoutNodes(group: SkillGroup) {
  const count = group.skills.length;
  const baseRadius = count <= 4 ? 38 : count <= 6 ? 48 : 58;
  return group.skills.map((skill, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      ...skill,
      x: group.cx + Math.cos(angle) * baseRadius,
      y: group.cy + Math.sin(angle) * baseRadius,
    };
  });
}

interface NodeDatum {
  name: string;
  level: "expert" | "proficient" | "familiar";
  x: number;
  y: number;
  groupId: string;
  groupAccent: string;
}

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    level: string;
  } | null>(null);

  // Build flat node list with group info
  const allNodes = useMemo<NodeDatum[]>(() => {
    return SKILL_GROUPS.flatMap((g) =>
      layoutNodes(g).map((n) => ({
        ...n,
        groupId: g.id,
        groupAccent: g.accent,
      }))
    );
  }, []);

  const visibleGroups =
    activeGroup ? SKILL_GROUPS.filter((g) => g.id === activeGroup) : SKILL_GROUPS;

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    visibleGroups.forEach((g) => {
      g.skills.forEach((s) => ids.add(`${g.id}::${s.name}`));
    });
    return ids;
  }, [visibleGroups]);

  return (
    <section id="skills" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(34,211,238,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">05</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Skills</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Skill constellation,
            <br />
            <span className="text-gradient-blue">mapped by depth.</span>
          </h2>
        </motion.div>

        {/* Constellation map controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => setActiveGroup(null)}
            className={`px-3 py-1.5 text-xs font-code rounded transition-all duration-150 border ${
              !activeGroup
                ? "border-[#4f8ef7] text-[#4f8ef7] bg-[#4f8ef7]/10"
                : "border-[#222] text-[#555] hover:text-[#888] hover:border-[#333]"
            }`}
          >
            ✦ All Systems
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(activeGroup === g.id ? null : g.id)}
              className="px-3 py-1.5 text-xs font-code rounded transition-all duration-150 border"
              style={
                activeGroup === g.id
                  ? {
                      borderColor: g.accent,
                      color: g.accent,
                      backgroundColor: `${g.accent}12`,
                    }
                  : { borderColor: "#222", color: "#555" }
              }
            >
              {g.label}
            </button>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-5 mb-6"
        >
          {[
            { level: "Expert", r: 8, color: "#4f8ef7" },
            { level: "Proficient", r: 6, color: "#22d3ee" },
            { level: "Familiar", r: 4.5, color: "#555" },
          ].map((l) => (
            <div key={l.level} className="flex items-center gap-2">
              <svg width={l.r * 2 + 2} height={l.r * 2 + 2}>
                <circle
                  cx={l.r + 1}
                  cy={l.r + 1}
                  r={l.r}
                  fill={l.color}
                  opacity={0.7}
                />
              </svg>
              <span className="text-xs text-[#555] font-code">{l.level}</span>
            </div>
          ))}
        </motion.div>

        {/* Constellation SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-x-auto"
          style={{ minHeight: 520 }}
        >
          <div className="relative" style={{ position: "relative" }}>
            <svg
              viewBox="0 0 900 520"
              className="w-full"
              style={{ minWidth: 600, maxHeight: 520 }}
            >
              <defs>
                {SKILL_GROUPS.map((g) => (
                  <filter key={g.id} id={`glow-${g.id}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>

              {/* Category connection lines */}
              {SKILL_GROUPS.map((g) => {
                if (activeGroup && activeGroup !== g.id) return null;
                const nodes = layoutNodes(g);
                const lines: ReactElement[] = [];
                for (let i = 0; i < nodes.length; i++) {
                  for (let j = i + 1; j < nodes.length; j++) {
                    const key = `${g.id}-line-${i}-${j}`;
                    const isHoveredGroup =
                      hoveredNode !== null &&
                      allNodes.find((n) => n.name === hoveredNode)?.groupId === g.id;
                    lines.push(
                      <line
                        key={key}
                        x1={nodes[i].x}
                        y1={nodes[i].y}
                        x2={nodes[j].x}
                        y2={nodes[j].y}
                        stroke={g.accent}
                        strokeWidth={isHoveredGroup ? 0.6 : 0.3}
                        opacity={isHoveredGroup ? 0.3 : 0.1}
                        strokeDasharray="3 4"
                      />
                    );
                  }
                }
                // Also draw line from center to each node
                nodes.forEach((n, i) => {
                  lines.push(
                    <line
                      key={`${g.id}-center-${i}`}
                      x1={g.cx}
                      y1={g.cy}
                      x2={n.x}
                      y2={n.y}
                      stroke={g.accent}
                      strokeWidth={0.4}
                      opacity={0.12}
                    />
                  );
                });
                return lines;
              })}

              {/* Category center labels */}
              {SKILL_GROUPS.map((g) => {
                if (activeGroup && activeGroup !== g.id) return null;
                return (
                  <g key={`label-${g.id}`}>
                    <circle
                      cx={g.cx}
                      cy={g.cy}
                      r={14}
                      fill={g.accent}
                      opacity={0.12}
                    />
                    <circle
                      cx={g.cx}
                      cy={g.cy}
                      r={4}
                      fill={g.accent}
                      opacity={0.6}
                    />
                    <text
                      x={g.cx}
                      y={g.cy - 20}
                      textAnchor="middle"
                      fontSize="9"
                      fill={g.accent}
                      opacity={0.8}
                      fontFamily="monospace"
                      letterSpacing="0.5"
                    >
                      {g.label.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* Skill nodes */}
              {allNodes.map((node) => {
                const nodeKey = `${node.groupId}::${node.name}`;
                if (!visibleNodeIds.has(nodeKey)) return null;
                const r = LEVEL_RADIUS[node.level];
                const isHovered = hoveredNode === node.name;
                const isRelated =
                  hoveredNode !== null &&
                  allNodes.find((n) => n.name === hoveredNode)?.groupId === node.groupId;
                const baseOpacity =
                  node.level === "expert" ? 0.85 : node.level === "proficient" ? 0.65 : 0.4;
                const opacity = isHovered
                  ? 1
                  : isRelated
                  ? 0.9
                  : hoveredNode
                  ? 0.25
                  : baseOpacity;

                return (
                  <motion.g
                    key={nodeKey}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.05 + Math.random() * 0.4,
                      duration: 0.5,
                      type: "spring",
                      bounce: 0.3,
                    }}
                    onMouseEnter={() => {
                      setHoveredNode(node.name);
                      setTooltip({
                        x: node.x,
                        y: node.y - r - 14,
                        name: node.name,
                        level: node.level.charAt(0).toUpperCase() + node.level.slice(1),
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredNode(null);
                      setTooltip(null);
                    }}
                    style={{ cursor: "default" }}
                  >
                    {/* Glow ring on hover */}
                    {isHovered && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={r + 6}
                        fill="none"
                        stroke={node.groupAccent}
                        strokeWidth={1}
                        opacity={0.4}
                      />
                    )}

                    {/* Pulsing outer ring */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={r + 3}
                      fill="none"
                      stroke={node.groupAccent}
                      strokeWidth={0.5}
                      animate={{ opacity: [0.1, 0.4, 0.1], r: [r + 2, r + 5, r + 2] } as any}
                      transition={{
                        duration: 2.5 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    />

                    {/* Main node circle */}
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? r + 2 : r}
                      fill={node.groupAccent}
                      opacity={opacity}
                      filter={isHovered ? `url(#glow-${node.groupId})` : undefined}
                      animate={{
                        opacity: [baseOpacity * 0.8, baseOpacity, baseOpacity * 0.8],
                      } as any}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 3,
                      }}
                    />
                  </motion.g>
                );
              })}

              {/* Tooltip */}
              {tooltip && (
                <g>
                  <rect
                    x={tooltip.x - 44}
                    y={tooltip.y - 16}
                    width={88}
                    height={32}
                    rx={6}
                    fill="#0f0f1a"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={tooltip.x}
                    y={tooltip.y - 4}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#e0e0e0"
                    fontFamily="monospace"
                  >
                    {tooltip.name.length > 16 ? tooltip.name.slice(0, 15) + "…" : tooltip.name}
                  </text>
                  <text
                    x={tooltip.x}
                    y={tooltip.y + 8}
                    textAnchor="middle"
                    fontSize="7"
                    fill="#888"
                    fontFamily="monospace"
                  >
                    {tooltip.level}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </motion.div>

        {/* Skill count summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-4 flex items-center gap-2 text-xs text-[#444] font-code"
        >
          <span className="text-[#4f8ef7]">✦</span>
          <span>
            {allNodes.length} skills across {SKILL_GROUPS.length} domains
          </span>
          <span className="text-[#333]">—</span>
          <span>hover nodes to explore</span>
        </motion.div>
      </div>
    </section>
  );
}
