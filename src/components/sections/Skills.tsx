"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SkillGroup {
  id: string;
  label: string;
  accent: string;
  skills: { name: string; level: "expert" | "proficient" | "familiar" }[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    accent: "#4f8ef7",
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
    skills: [
      { name: "Node.js", level: "expert" },
      { name: "Django", level: "proficient" },
      { name: "Spring Boot", level: "proficient" },
      { name: "REST APIs", level: "expert" },
      { name: "Microservices", level: "expert" },
      { name: "WebSockets", level: "proficient" },
      { name: "Express.js", level: "proficient" },
      { name: "OAuth 2.0 / SSO", level: "proficient" },
      { name: "GraphQL", level: "familiar" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "#34d399",
    skills: [
      { name: "React", level: "proficient" },
      { name: "Next.js", level: "proficient" },
      { name: "Tailwind CSS", level: "proficient" },
      { name: "Framer Motion", level: "proficient" },
      { name: "HTML/CSS", level: "expert" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    accent: "#a78bfa",
    skills: [
      { name: "MongoDB", level: "expert" },
      { name: "Redis", level: "expert" },
      { name: "PostgreSQL", level: "proficient" },
      { name: "MySQL", level: "proficient" },
      { name: "NoSQL", level: "proficient" },
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms & DS",
    accent: "#fb923c",
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

const LEVEL_CONFIG = {
  expert: { label: "Expert", bg: "#4f8ef7", opacity: "20" },
  proficient: { label: "Proficient", bg: "#22d3ee", opacity: "15" },
  familiar: { label: "Familiar", bg: "#555", opacity: "12" },
};

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const displayed =
    activeGroup
      ? SKILL_GROUPS.filter((g) => g.id === activeGroup)
      : SKILL_GROUPS;

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
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">05</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Skills</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Tools of the trade,
            <br />
            <span className="text-gradient-blue">applied with depth.</span>
          </h2>
        </motion.div>

        {/* Group filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setActiveGroup(null)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
              !activeGroup
                ? "bg-[#4f8ef7] text-white"
                : "border border-[#1e1e1e] text-[#666] hover:text-[#aaa]"
            )}
          >
            All
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(activeGroup === g.id ? null : g.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
                activeGroup === g.id
                  ? "text-white"
                  : "border border-[#1e1e1e] text-[#666] hover:text-[#aaa]"
              )}
              style={
                activeGroup === g.id
                  ? { backgroundColor: g.accent }
                  : undefined
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
          className="flex items-center gap-5 mb-8"
        >
          {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.bg, opacity: level === "familiar" ? 0.5 : 1 }}
              />
              <span className="text-sm text-[#555]">{config.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Skill groups */}
        <motion.div layout className="space-y-6">
          {displayed.map((group, gi) => (
            <motion.div
              key={group.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: gi * 0.05, duration: 0.5 }}
              className="border border-[#161616] bg-[#0a0a0a] rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: group.accent }}
                />
                <h3 className="text-base font-semibold text-[#e0e0e0]">
                  {group.label}
                </h3>
                <span className="text-sm text-[#444] font-code">
                  — {group.skills.length} skills
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, i) => {
                  const lvl = LEVEL_CONFIG[skill.level];
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group relative px-3 py-1.5 rounded-lg text-sm font-code cursor-default transition-all duration-150"
                      style={{
                        color:
                          skill.level === "expert"
                            ? group.accent
                            : skill.level === "proficient"
                            ? "#aaa"
                            : "#666",
                        backgroundColor:
                          skill.level === "expert"
                            ? `${group.accent}18`
                            : skill.level === "proficient"
                            ? "#141414"
                            : "#0e0e0e",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor:
                          skill.level === "expert"
                            ? `${group.accent}30`
                            : "#1e1e1e",
                      }}
                    >
                      {skill.name}
                      {/* Tooltip */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-code px-2 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {lvl.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
