"use client";

import { motion } from "framer-motion";
import { GitBranch, Link2, ExternalLink, Mail, FileText, Terminal } from "lucide-react";

const LINKS = [
  {
    icon: GitBranch,
    label: "GitHub",
    handle: "@vixel-iiitd",
    href: "https://github.com/vixel-iiitd",
    desc: "30+ repositories, competitive programming solutions",
    accent: "#e0e0e0",
  },
  {
    icon: Link2,
    label: "LinkedIn",
    handle: "rahul19191",
    href: "https://www.linkedin.com/in/rahul19191/",
    desc: "Professional profile and network",
    accent: "#0a66c2",
  },
  {
    icon: Terminal,
    label: "Codeforces",
    handle: "Vixel",
    href: "https://codeforces.com/profile/Vixel",
    desc: "Expert rank, 195+ contests, peak 1677",
    accent: "#4f8ef7",
  },
  {
    icon: Terminal,
    label: "LeetCode",
    handle: "rahul19191",
    href: "https://leetcode.com/u/rahul19191/",
    desc: "Algorithm practice and interview prep",
    accent: "#f59e0b",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "114rahul.k@gmail.com",
    href: "mailto:114rahul.k@gmail.com",
    desc: "Direct contact for opportunities",
    accent: "#34d399",
  },
  {
    icon: FileText,
    label: "Resume",
    handle: "View PDF",
    href: "https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view",
    desc: "Full engineering profile and experience",
    accent: "#a78bfa",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-padding relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(79,142,247,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-code text-xs text-[#4f8ef7]">06</span>
            <div className="h-px w-10 bg-[#1a1a1a]" />
            <span className="text-xs text-[#444] font-code uppercase tracking-widest">Contact</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] tracking-tight mb-4">
            Let&apos;s build something
            <br />
            <span className="text-gradient-blue">worth shipping.</span>
          </h2>
          <p className="text-[#666] text-base max-w-md mx-auto leading-relaxed">
            Open to backend engineering roles, internships, and interesting
            problems. I respond to every message.
          </p>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          <a
            href="mailto:114rahul.k@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4f8ef7] hover:bg-[#3d7de6] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-[#4f8ef7]/20"
          >
            <Mail size={15} />
            Send Email
          </a>
          <a
            href="https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#2a2a2a] text-[#aaa] hover:text-[#f0f0f0] hover:border-[#3a3a3a] text-sm font-medium rounded-xl transition-all duration-200"
          >
            <FileText size={15} />
            Download Resume
          </a>
        </motion.div>

        {/* Links grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -3 }}
              className="group flex items-start gap-4 p-5 border border-[#161616] bg-[#0a0a0a] rounded-xl card-hover"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${link.accent}14` }}
              >
                <link.icon size={16} style={{ color: link.accent }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-[#e0e0e0] group-hover:text-[#f0f0f0] transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink
                    size={11}
                    className="text-[#444] group-hover:text-[#666] transition-colors"
                  />
                </div>
                <div className="font-code text-sm text-[#555] mb-1.5 truncate">
                  {link.handle}
                </div>
                <p className="text-sm text-[#555] leading-relaxed">{link.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] bg-[#0a0a0a] rounded-full text-xs text-[#666] font-code">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] animate-pulse" />
            Currently: SWE II at Google · Open to interesting conversations
          </div>
        </motion.div>
      </div>
    </section>
  );
}
