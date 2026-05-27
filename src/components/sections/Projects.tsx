"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, ExternalLink, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  why: string;
  architecture: string;
  challenges: string;
  learnings: string;
  tech: string[];
  category: string;
  accent: string;
  github?: string;
  demo?: string;
  status: "production" | "active" | "archived";
}

const PROJECTS: Project[] = [
  {
    id: "wrod",
    title: "wrod",
    tagline: "A word-game engine with real-time state management",
    problem:
      "Most word games have poor feedback loops and laggy state sync. Designed a real-time word game with clean game state management.",
    why: "Wanted to explore TypeScript-first full-stack development with tight client-server state synchronization.",
    architecture:
      "TypeScript monorepo. Client-side game engine handles state transitions as a finite state machine. Server validates moves and broadcasts updates.",
    challenges:
      "Ensuring consistent game state across clients without race conditions. Solved using a server-authoritative model with optimistic UI.",
    learnings:
      "FSM-based UI design is significantly cleaner than ad-hoc state. TypeScript's strict mode caught 40% of bugs before runtime.",
    tech: ["TypeScript", "Node.js", "WebSockets", "FSM"],
    category: "Full-Stack",
    accent: "#4f8ef7",
    github: "https://github.com/vixel-iiitd/wrod",
    status: "active",
  },
  {
    id: "safarnama",
    title: "Safarnama",
    tagline: "Travel planning app with itinerary optimization",
    problem:
      "Travel planning is fragmented across dozens of apps. Built a unified platform for route planning and itinerary management.",
    why: "Explored graph-based route optimization applied to real-world travel problems — connecting competitive programming to product engineering.",
    architecture:
      "React frontend with a Node.js backend. Route optimization implemented using a greedy graph traversal approach adapted from competitive programming.",
    challenges:
      "Translating abstract graph algorithms into a usable travel planning interface. The optimization model had to balance complexity with speed.",
    learnings:
      "CP algorithms are directly applicable to product problems. Graph traversal powers more software than most engineers realize.",
    tech: ["React", "Node.js", "Graph Algorithms", "REST API"],
    category: "Full-Stack",
    accent: "#34d399",
    github: "https://github.com/vixel-iiitd/safarnama",
    status: "active",
  },
  {
    id: "mavvex",
    title: "Mavvex",
    tagline: "Professional website for an independent creative studio",
    problem:
      "A creative studio needed a polished web presence that reflected their brand identity with strong performance.",
    why: "First significant production website deployment — focused on performance, UX polish, and responsive design fundamentals.",
    architecture:
      "Static JavaScript website with clean component architecture. Optimized for fast loading with minimal JS payload.",
    challenges:
      "Achieving pixel-perfect design fidelity across screen sizes. Mobile optimization required careful layout restructuring.",
    learnings:
      "Performance is a feature. A 200ms improvement in load time measurably affects user engagement.",
    tech: ["JavaScript", "HTML/CSS", "Responsive Design"],
    category: "Frontend",
    accent: "#a78bfa",
    github: "https://github.com/vixel-iiitd/Mavvex",
    status: "archived",
  },
  {
    id: "spring-boot",
    title: "Spring Boot API",
    tagline: "Production-ready REST API with Java Spring Boot",
    problem:
      "Exploring enterprise-grade Java backend development — building scalable REST APIs with Spring Boot's ecosystem.",
    why: "Spring Boot represents the backbone of enterprise Java. Understanding it deeply is essential for backend engineering roles.",
    architecture:
      "Layered MVC architecture with service, repository, and controller separation. RESTful endpoints with proper HTTP semantics.",
    challenges:
      "Dependency injection complexity and transaction management. Understanding the Spring container model required significant depth.",
    learnings:
      "Spring's convention-over-configuration philosophy dramatically reduces boilerplate when understood correctly.",
    tech: ["Java", "Spring Boot", "REST API", "Maven"],
    category: "Backend",
    accent: "#22d3ee",
    github: "https://github.com/vixel-iiitd/spring-boot-hello-world",
    status: "archived",
  },
  {
    id: "segtree",
    title: "Generic Segment Tree",
    tagline: "Template-based C++ segment tree for competitive programming",
    problem:
      "Segment trees are frequently needed in CP with varying merge functions. A generic, reusable template eliminates repetitive code.",
    why: "Building a proper abstraction for a core data structure tests both C++ template metaprogramming skills and algorithmic understanding.",
    architecture:
      "C++ template class parameterized on node type and merge function. Supports lazy propagation, range queries, and point updates.",
    challenges:
      "Getting the template generics right for all use cases while maintaining O(log n) guarantees. Lazy propagation edge cases were particularly subtle.",
    learnings:
      "Template metaprogramming in C++ enables zero-overhead abstractions that feel impossible in other languages.",
    tech: ["C++20", "Templates", "Data Structures", "Algorithms"],
    category: "Competitive Programming",
    accent: "#fb923c",
    github: "https://github.com/vixel-iiitd/Generic_all_purpose_segtree",
    status: "active",
  },
  {
    id: "peptides",
    title: "Peptide Classifier",
    tagline: "ML-based classification of peptide sequences",
    problem:
      "Biological peptide sequences have complex structural patterns. Built an ML pipeline to classify them from raw sequence data.",
    why: "Bridging my ECE background with software — applying signal processing intuition to bioinformatics data representation.",
    architecture:
      "Jupyter-based ML pipeline. Feature extraction from sequence data, followed by classification with scikit-learn models.",
    challenges:
      "Feature engineering from raw biological sequences was the hardest part — representing discrete sequence data for ML models.",
    learnings:
      "Domain knowledge is irreplaceable in ML. The feature engineering choices matter more than model selection.",
    tech: ["Python", "Jupyter", "scikit-learn", "NumPy", "Bioinformatics"],
    category: "ML / Data Science",
    accent: "#f472b6",
    github: "https://github.com/vixel-iiitd/ClassificationOfPeptides",
    status: "archived",
  },
];

const STATUS_COLORS = {
  production: { bg: "#34d399", label: "Production" },
  active: { bg: "#4f8ef7", label: "Active" },
  archived: { bg: "#555", label: "Archived" },
};

const CATEGORIES = ["All", "Backend", "Full-Stack", "Frontend", "Competitive Programming", "ML / Data Science"];

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="group relative border border-[#161616] bg-[#0a0a0a] rounded-2xl p-5 cursor-pointer card-hover overflow-hidden"
    >
      {/* Accent border top */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-50"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-code px-2 py-0.5 rounded"
              style={{
                color: project.accent,
                backgroundColor: `${project.accent}15`,
              }}
            >
              {project.category}
            </span>
            <span
              className="text-[11px] font-code px-1.5 py-0.5 rounded"
              style={{
                color: STATUS_COLORS[project.status].bg,
                backgroundColor: `${STATUS_COLORS[project.status].bg}12`,
              }}
            >
              {STATUS_COLORS[project.status].label}
            </span>
          </div>
          <h3 className="text-base font-bold text-[#e0e0e0] group-hover:text-[#f0f0f0] transition-colors">
            {project.title}
          </h3>
        </div>
        <ChevronDown
          size={14}
          className="text-[#444] group-hover:text-[#888] transition-colors mt-1 shrink-0"
        />
      </div>

      <p className="text-sm text-[#666] leading-relaxed mb-4">{project.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-xs font-code px-2 py-0.5 bg-[#111] border border-[#1e1e1e] text-[#666] rounded"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 4 && (
          <span className="text-xs font-code px-2 py-0.5 text-[#444]">
            +{project.tech.length - 4}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl"
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#0d0d0d] border-b border-[#141414]"
          style={{
            boxShadow: `0 1px 0 0 ${project.accent}20`,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-code px-2 py-0.5 rounded"
                style={{ color: project.accent, backgroundColor: `${project.accent}15` }}
              >
                {project.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#f0f0f0]">{project.title}</h2>
            <p className="text-sm text-[#666] mt-0.5">{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#555] hover:text-[#aaa] hover:bg-[#1a1a1a] rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {[
            { label: "Problem Statement", content: project.problem },
            { label: "Why I Built It", content: project.why },
            { label: "Architecture", content: project.architecture },
            { label: "Key Challenges", content: project.challenges },
            { label: "Learnings", content: project.learnings },
          ].map((section) => (
            <div key={section.label}>
              <h4
                className="text-sm font-code font-semibold uppercase tracking-widest mb-2"
                style={{ color: project.accent }}
              >
                {section.label}
              </h4>
              <p className="text-sm text-[#888] leading-relaxed">{section.content}</p>
            </div>
          ))}

          {/* Tech Stack */}
          <div>
            <h4
              className="text-xs font-code font-semibold uppercase tracking-widest mb-2"
              style={{ color: project.accent }}
            >
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs font-code px-3 py-1 bg-[#111] border border-[#1e1e1e] text-[#888] rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2 border-t border-[#141414]">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#2a2a2a] text-[#aaa] hover:text-[#f0f0f0] hover:border-[#3a3a3a] rounded-lg transition-all"
              >
                <GitBranch size={14} />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#4f8ef7] hover:bg-[#3d7de6] text-white rounded-lg transition-all"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 30%, rgba(52,211,153,0.04) 0%, transparent 60%)",
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
            <span className="font-code text-xs text-[#4f8ef7]">03</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Projects</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            What I&apos;ve built,
            <br />
            <span className="text-gradient-emerald">and why.</span>
          </h2>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150",
                activeCategory === cat
                  ? "bg-[#4f8ef7] text-white"
                  : "border border-[#1e1e1e] text-[#666] hover:text-[#aaa] hover:border-[#2a2a2a]"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelected(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View all github */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://github.com/vixel-iiitd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#888] transition-colors font-code"
          >
            <GitBranch size={14} />
            View all 30+ repositories on GitHub
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
