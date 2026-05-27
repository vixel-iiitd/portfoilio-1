"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, GitBranch, Terminal, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS: Command[] = [
    {
      id: "nav-about",
      label: "Go to About",
      icon: ArrowRight,
      action: () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "nav-cp",
      label: "Go to Competitive Programming",
      icon: ArrowRight,
      action: () => {
        document.getElementById("competitive")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "nav-projects",
      label: "Go to Projects",
      icon: ArrowRight,
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "nav-skills",
      label: "Go to Skills",
      icon: ArrowRight,
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      icon: ArrowRight,
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation",
    },
    {
      id: "open-github",
      label: "Open GitHub",
      description: "github.com/vixel-iiitd",
      icon: GitBranch,
      action: () => window.open("https://github.com/vixel-iiitd", "_blank"),
      category: "Links",
    },
    {
      id: "open-cf",
      label: "Open Codeforces Profile",
      description: "rating: 1677, max: 1677 · Expert",
      icon: Terminal,
      action: () => window.open("https://codeforces.com/profile/Vixel", "_blank"),
      category: "Links",
    },
    {
      id: "open-lc",
      label: "Open LeetCode Profile",
      icon: Terminal,
      action: () => window.open("https://leetcode.com/u/rahul19191/", "_blank"),
      category: "Links",
    },
    {
      id: "open-resume",
      label: "View Resume",
      icon: FileText,
      action: () => window.open("https://drive.google.com/file/d/1vf6juzBnN4DDvbw_gH95cMx7KWgzyITc/view", "_blank"),
      category: "Links",
    },
    {
      id: "email",
      label: "Send Email",
      description: "114rahul.k@gmail.com",
      icon: Mail,
      action: () => window.open("mailto:114rahul.k@gmail.com"),
      category: "Contact",
    },
  ];

  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && filtered[selected]) {
        filtered[selected].action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <>
      {/* Trigger hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => { setOpen(true); setQuery(""); setSelected(0); }}
          className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#222] rounded-lg text-xs text-[#555] hover:text-[#888] hover:border-[#333] transition-all duration-200 font-code shadow-lg"
        >
          <Search size={12} />
          <span className="hidden sm:inline">Command palette</span>
          <span className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[10px]">
            ⌘K
          </span>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(79,142,247,0.08)" }}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#141414]">
                <Search size={15} className="text-[#444] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, navigate, open links..."
                  className="flex-1 bg-transparent text-sm text-[#e0e0e0] placeholder-[#444] outline-none font-code"
                />
                <kbd className="text-[10px] text-[#444] border border-[#222] px-1.5 py-0.5 rounded font-code">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#444] font-code">
                    No results for &quot;{query}&quot;
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, cmds]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-[10px] font-code uppercase tracking-widest text-[#3a3a3a]">
                        {category}
                      </div>
                      {cmds.map((cmd) => {
                        const globalIdx = filtered.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75",
                              globalIdx === selected
                                ? "bg-[#161616] text-[#f0f0f0]"
                                : "text-[#888] hover:bg-[#111]"
                            )}
                          >
                            <cmd.icon
                              size={14}
                              className={
                                globalIdx === selected ? "text-[#4f8ef7]" : "text-[#444]"
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{cmd.label}</div>
                              {cmd.description && (
                                <div className="text-[11px] text-[#444] font-code truncate">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {globalIdx === selected && (
                              <ArrowRight size={12} className="text-[#4f8ef7] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#141414] flex items-center gap-4 text-[10px] text-[#333] font-code">
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#222] px-1 rounded">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#222] px-1 rounded">↵</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-[#222] px-1 rounded">esc</kbd> close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
