"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowDown, GitBranch, FileText, Terminal } from "lucide-react";
const ROTATING_TITLES = [
  "Backend Engineer",
  "Competitive Programmer",
  "Problem Solver",
  "System Thinker",
  "Builder",
  "Algorithm Designer",
];

function useTypingEffect(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = words[wordIdx];

    if (!deleting && charIdx < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, speed);
    } else if (!deleting && charIdx === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((w) => (w + 1) % words.length);
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

const STATS = [
  { label: "Current Role", value: "SWE II", sub: "Google" },
  { label: "CF Max Rating", value: "1677", sub: "Expert" },
  { label: "Contests", value: "195+", sub: "Codeforces" },
  { label: "Repositories", value: "30+", sub: "GitHub" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.7 } },
};

function PhotoPlaceholder() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Guard against the race where the image finishes loading before React
  // attaches the onLoad handler (e.g. cached image on fast connections).
  const handleRef = useCallback((node: HTMLImageElement | null) => {
    (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
    if (!node) return;
    if (node.complete) {
      node.naturalWidth > 0 ? setImgLoaded(true) : setImgError(true);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4f8ef7]/15 via-transparent to-[#22d3ee]/15 blur-2xl scale-110" />

      {/* Decorative corner brackets */}
      <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#4f8ef7]/40 rounded-tl-lg" />
      <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#22d3ee]/40 rounded-br-lg" />

      {/* Photo box */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border border-[#1e1e1e] bg-[#0d0d0d]">

        {/* Layer 1 (bottom): placeholder — always rendered, fades out when photo loads */}
        <div
          className={`absolute inset-0 z-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-[#0a0a0a] transition-opacity duration-500 ${imgLoaded && !imgError ? "opacity-0" : "opacity-100"}`}
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4f8ef7]/20 to-[#22d3ee]/15 border border-[#4f8ef7]/20 flex items-center justify-center mb-5">
            <span className="text-4xl font-bold text-gradient-blue font-code select-none">RK</span>
          </div>
          <p className="text-xs text-[#555] font-code">Loading photo...</p>
        </div>

        {/* Layer 2 (middle): actual photo — sits above placeholder, fades in when ready */}
        {!imgError && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={handleRef}
            src="https://res.cloudinary.com/dcxc2k5hz/image/upload/v1779914574/PXL_20260125_120229392_ruaxic.jpg"
            alt="Rahul Kumar"
            className={`absolute inset-0 z-10 w-full h-full object-cover object-top transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Layer 3 (top): name strip — always on top of everything */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <p className="text-sm font-semibold text-[#f0f0f0]">Rahul Kumar</p>
          <p className="text-xs text-[#4f8ef7] font-code">SWE II · Google</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const typedText = useTypingEffect(ROTATING_TITLES);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,142,247,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-[#4f8ef7]/40 to-transparent" />
      <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-[#4f8ef7]/40 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-[#22d3ee]/30 to-transparent" />
      <div className="absolute top-0 right-0 h-px w-32 bg-gradient-to-l from-[#22d3ee]/30 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">

          {/* Left: text content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 max-w-2xl"
          >
            {/* Badge */}
            <motion.div variants={item} className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#1f1f1f] bg-[#111] rounded-full text-xs text-[#888] font-code">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f8ef7] animate-pulse" />
                SWE II · Google Play Analytics
              </div>
            </motion.div>

            {/* Name */}
            <motion.div variants={item}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f0f0f0] mb-4 leading-[1.05]">
                Rahul
                <br />
                <span className="text-gradient-blue">Kumar</span>
              </h1>
            </motion.div>

            {/* Typed role */}
            <motion.div variants={item} className="mb-6 h-10">
              <div className="flex items-center gap-2">
                <span className="text-[#4f8ef7] font-code text-xl">$</span>
                <span className="text-xl sm:text-2xl font-medium text-[#aaa] font-code">
                  {typedText}
                  <span className="animate-blink text-[#4f8ef7]">_</span>
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={item}
              className="text-[#777] text-base sm:text-lg leading-relaxed max-w-xl mb-10"
            >
              Software Engineer II at Google, Play Analytics. IIIT Delhi ECE graduate.
              I build backend systems at scale — from 50M-concurrent microservices
              at Jio to production analytics infrastructure at Google.
              Codeforces Expert, algorithmic thinker.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3 mb-12">
              <a
                href="https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4f8ef7] hover:bg-[#3d7de6] text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-[#4f8ef7]/20"
              >
                <FileText size={15} />
                Resume
              </a>
              <a
                href="https://github.com/vixel-iiitd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2a] text-[#bbb] hover:text-[#f0f0f0] hover:border-[#3a3a3a] text-sm font-medium rounded-lg transition-all duration-200"
              >
                <GitBranch size={15} />
                GitHub
              </a>
              <a
                href="https://codeforces.com/profile/Vixel"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2a] text-[#bbb] hover:text-[#f0f0f0] hover:border-[#3a3a3a] text-sm font-medium rounded-lg transition-all duration-200"
              >
                <Terminal size={15} />
                Codeforces
              </a>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2a] text-[#bbb] hover:text-[#f0f0f0] hover:border-[#3a3a3a] text-sm font-medium rounded-lg transition-all duration-200"
              >
                Contact
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 border border-[#161616] bg-[#0d0d0d] rounded-xl hover:border-[#222] transition-colors duration-200"
                >
                  <div className="text-2xl font-bold text-[#f0f0f0] mb-0.5 font-code">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#4f8ef7] font-medium mb-0.5">{stat.sub}</div>
                  <div className="text-xs text-[#666]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: photo */}
          <div className="flex justify-center lg:justify-end lg:flex-shrink-0">
            <PhotoPlaceholder />
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-[#333]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
