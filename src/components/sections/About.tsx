"use client";

import { motion, type Variants } from "framer-motion";
import { useRef } from "react";
import { Cpu, Layers, Zap, Brain, Code2, Globe } from "lucide-react";

const TRAITS = [
  {
    icon: Brain,
    title: "Algorithmic Thinking",
    desc: "195+ Codeforces contests. Expert rank (max 1677). Fluent in DP, Graph theory, and constructive approaches.",
    color: "#4f8ef7",
  },
  {
    icon: Layers,
    title: "Production Scale",
    desc: "Designed microservices handling 50M+ concurrent users at Jio. Scale isn't theory — it's a daily constraint.",
    color: "#22d3ee",
  },
  {
    icon: Cpu,
    title: "Performance-Oriented",
    desc: "Cut API response times 80% via multi-layer caching at Jio. C++ competitive programming sharpens the instinct.",
    color: "#34d399",
  },
  {
    icon: Zap,
    title: "Shipped at Google",
    desc: "Currently SWE II at Google, Play Analytics Eng. Backend infrastructure at the largest app distribution platform.",
    color: "#a78bfa",
  },
  {
    icon: Code2,
    title: "Language Polyglot",
    desc: "C++, Java, TypeScript, Python, Django, Node.js. I pick the right tool for the problem, not the comfortable one.",
    color: "#fb923c",
  },
  {
    icon: Globe,
    title: "Growth Mindset",
    desc: "0 → Expert on Codeforces, intern → SWE II at Google in 3 years. Deliberate learning compounds fast.",
    color: "#f472b6",
  },
];

const TECH_STACK = [
  "C++20", "Java", "TypeScript", "Python",
  "Node.js", "Django", "Spring Boot", "Express.js",
  "React", "Next.js", "REST APIs", "Microservices",
  "PostgreSQL", "MongoDB", "Redis", "GCP",
  "Docker", "Linux", "Git", "OAuth 2.0",
  "PySpark", "Azure Synapse",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(34,211,238,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">01</span>
            <div className="h-px flex-1 max-w-[40px] bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">About</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight">
            Engineering depth,
            <br />
            <span className="text-gradient-blue">not just code.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left: bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <p className="text-[#888] text-base leading-7">
              I'm a{" "}
              <span className="text-[#f0f0f0] font-medium">Software Engineer II at Google</span>,
              working on Play Analytics infrastructure. I graduated from{" "}
              <span className="text-[#f0f0f0] font-medium">IIIT Delhi</span> with a B.Tech in
              Electronics and Communication Engineering in 2023. My engineering identity is
              built around backend systems, algorithmic depth, and production-grade thinking.
            </p>
            <p className="text-[#888] text-base leading-7">
              Before Google, I spent nearly two years at{" "}
              <span className="text-[#4f8ef7] font-medium">Jio Platforms Limited</span>,
              where I built microservices handling 50M+ concurrent users during IPL 2024,
              cut API response times by 80%, and shipped indirect gratification systems
              that reached 60% of the user base. Scale wasn't a talking point — it was a
              daily constraint.
            </p>
            <p className="text-[#888] text-base leading-7">
              Alongside industry work, I reached{" "}
              <span className="text-[#4f8ef7] font-medium">Codeforces Expert</span> (peak
              1677) across 195+ contests — not through grinding, but deliberate
              pattern recognition. The same first-principles discipline I bring to
              algorithm design carries directly into how I design systems.
            </p>

            {/* Quote */}
            <div className="border-l-2 border-[#4f8ef7]/40 pl-4 py-1 mt-6">
              <p className="text-[#666] text-base italic leading-relaxed">
                "The best engineers I know don't just write code.
                They understand constraints deeply — then build systems
                that hold up when everything else breaks."
              </p>
            </div>
          </motion.div>

          {/* Right: floating tech stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div
              ref={constraintsRef}
              className="relative border border-[#161616] bg-[#0a0a0a] rounded-2xl p-6 min-h-[280px] overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 grid-bg opacity-30 rounded-2xl" />

              <p className="relative z-10 text-xs text-[#444] font-code mb-5 uppercase tracking-widest">
                // tech stack
              </p>

              <div className="relative z-10 flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-3 py-1 text-xs font-code border border-[#1e1e1e] bg-[#111] text-[#888] rounded-md cursor-default hover:border-[#4f8ef7]/30 hover:text-[#f0f0f0] transition-all duration-150"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Traits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRAITS.map((trait, i) => (
            <motion.div
              key={trait.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="p-5 border border-[#161616] bg-[#0a0a0a] rounded-xl card-hover group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${trait.color}14` }}
              >
                <trait.icon size={16} style={{ color: trait.color }} />
              </div>
              <h3 className="text-base font-semibold text-[#e0e0e0] mb-1.5">
                {trait.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">{trait.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
