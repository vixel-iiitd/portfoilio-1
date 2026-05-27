"use client";

import { motion } from "framer-motion";

const LINKS = [
  { label: "GitHub", href: "https://github.com/vixel-iiitd" },
  { label: "Codeforces", href: "https://codeforces.com/profile/Vixel" },
  { label: "LeetCode", href: "https://leetcode.com/u/rahul19191/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rahul19191/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#141414] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#444] text-sm font-code"
        >
          <span className="text-[#4f8ef7]">{">"}</span> rahul.kumar — built with Next.js &amp; Framer Motion
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6"
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#444] hover:text-[#888] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
