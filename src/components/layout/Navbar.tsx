"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TRACK_NAME = "bg music"; // update after you upload your MP3

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [attracting, setAttracting] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Stop the attract animation after 3 seconds
    const t = setTimeout(() => setAttracting(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAttracting(false);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.35;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex items-center">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Pulsing glow ring — visible for first 3 s */}
      {attracting && (
        <>
          <motion.span
            className="absolute inset-0 rounded-md border border-[#4f8ef7]"
            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.1, repeat: 2, ease: "easeOut", repeatDelay: 0.15 }}
          />
          <motion.span
            className="absolute inset-0 rounded-md border border-[#4f8ef7]"
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ duration: 1.1, repeat: 2, ease: "easeOut", delay: 0.3, repeatDelay: 0.15 }}
          />
        </>
      )}

      <motion.button
        onClick={toggle}
        whileHover={{
          boxShadow: "0 0 14px 4px rgba(79,142,247,0.35)",
          borderColor: "rgba(79,142,247,0.6)",
        }}
        animate={attracting ? {
          borderColor: ["rgba(79,142,247,0.2)", "rgba(79,142,247,0.7)", "rgba(79,142,247,0.2)"],
          boxShadow: [
            "0 0 0px 0px rgba(79,142,247,0)",
            "0 0 12px 3px rgba(79,142,247,0.3)",
            "0 0 0px 0px rgba(79,142,247,0)",
          ],
        } : {}}
        transition={attracting ? { duration: 1.1, repeat: 2, ease: "easeInOut", repeatDelay: 0.15 } : { duration: 0.2 }}
        title={playing ? `Pause — ${TRACK_NAME}` : `Play music`}
        className={cn(
          "relative flex items-center gap-2 px-2.5 py-1.5 rounded-md border transition-colors duration-200 cursor-pointer",
          playing ? "border-[#4f8ef7]/40 bg-[#4f8ef7]/[0.04]" : "border-[#222]"
        )}
      >
        {/* Waveform bars */}
        <div className="flex items-end gap-[2.5px] h-3.5">
          {[0.9, 0.6, 1.0, 0.7].map((duration, i) => (
            <motion.span
              key={i}
              className="w-[2px] rounded-full"
              style={{ backgroundColor: playing ? "#4f8ef7" : attracting ? "#4f8ef7" : "#444" }}
              animate={
                playing
                  ? { height: ["3px", "12px", "5px", "10px", "3px"] }
                  : attracting
                  ? { height: ["3px", "9px", "4px", "11px", "3px"] }
                  : { height: "4px" }
              }
              transition={
                playing || attracting
                  ? { duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }
                  : { duration: 0.2 }
              }
            />
          ))}
        </div>

        {/* Label */}
        <span className={cn(
          "text-[11px] font-code leading-none transition-colors duration-200",
          playing ? "text-[#4f8ef7]" : attracting ? "text-[#4f8ef7]" : "text-[#555]"
        )}>
          {playing ? TRACK_NAME : "music"}
        </span>
      </motion.button>
    </div>
  );
}

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Competitive", href: "#competitive" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    const sections = NAV_ITEMS.map((item) => item.href.slice(1));
    for (const section of sections.reverse()) {
      const el = document.getElementById(section);
      if (el && window.scrollY >= el.offsetTop - 100) {
        setActiveSection(section);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#080808]/80 backdrop-blur-xl border-b border-[#1a1a1a]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-code text-sm text-[#888] hover:text-[#f0f0f0] transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-[#4f8ef7]">{">"}</span>
            <span className="font-semibold tracking-wider">RK</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={cn(
                    "relative px-3 py-1.5 text-sm transition-all duration-200 rounded-md",
                    isActive
                      ? "text-[#f0f0f0]"
                      : "text-[#666] hover:text-[#aaa]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[#1a1a1a] rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Resume CTA + Music Player */}
          <div className="hidden md:flex items-center gap-3">
            <MusicPlayer />
            <a
              href="https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 text-sm border border-[#2a2a2a] text-[#aaa] hover:text-[#f0f0f0] hover:border-[#4f8ef7]/40 rounded-md transition-all duration-200"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={cn("w-5 h-0.5 bg-[#888] transition-all duration-200", mobileOpen && "rotate-45 translate-y-2")} />
            <span className={cn("w-5 h-0.5 bg-[#888] transition-all duration-200", mobileOpen && "opacity-0")} />
            <span className={cn("w-5 h-0.5 bg-[#888] transition-all duration-200", mobileOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a] md:hidden"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left py-2 px-3 text-sm text-[#888] hover:text-[#f0f0f0] hover:bg-[#141414] rounded-md transition-all duration-150"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 py-2 px-3 text-sm text-center border border-[#2a2a2a] text-[#aaa] rounded-md"
              >
                Resume
              </a>
              <div className="mt-2 px-1">
                <MusicPlayer />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress */}
      <ScrollProgress />
    </>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-[#4f8ef7] to-[#22d3ee]"
        style={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0 }}
      />
    </div>
  );
}
