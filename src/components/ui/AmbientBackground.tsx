"use client";

import { useEffect, useRef, useState } from "react";

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const glowPosRef = useRef({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: -400, y: -400 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.3,
      baseOpacity: Math.random() * 0.25 + 0.05,
      opacity: 0,
      twinkle: Math.random() > 0.85,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.02,
    }));

    // Shooting stars
    type ShootingStar = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      opacity: number;
      active: boolean;
    };
    const shootingStars: ShootingStar[] = [];

    let lastShoot = Date.now();
    let nextShootIn = 4000 + Math.random() * 6000;

    const spawnShootingStar = () => {
      const angle = -30 - Math.random() * 20;
      const rad = (angle * Math.PI) / 180;
      const speed = 8 + Math.random() * 6;
      shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed,
        len: 80 + Math.random() * 60,
        opacity: 1,
        active: true,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        if (p.twinkle) {
          p.twinklePhase += p.twinkleSpeed;
          p.opacity = p.baseOpacity + Math.sin(p.twinklePhase) * 0.15;
        } else {
          p.opacity = p.baseOpacity;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 255, ${Math.max(0, p.opacity)})`;
        ctx.fill();
      });

      // Shooting stars
      const now = Date.now();
      if (now - lastShoot > nextShootIn) {
        spawnShootingStar();
        lastShoot = now;
        nextShootIn = 4000 + Math.random() * 6000;
      }

      shootingStars.forEach((s) => {
        if (!s.active) return;
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.018;
        if (
          s.opacity <= 0 ||
          s.x > canvas.width + 200 ||
          s.y > canvas.height + 200
        ) {
          s.active = false;
          return;
        }
        const speed = Math.sqrt(s.vx ** 2 + s.vy ** 2);
        const tailX = s.x - (s.vx * s.len) / speed;
        const tailY = s.y - (s.vy * s.len) / speed;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity * 0.8})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    // Mouse glow with lerp
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let glowRaf: number;
    const updateGlow = () => {
      const dx = mouseRef.current.x - glowPosRef.current.x;
      const dy = mouseRef.current.y - glowPosRef.current.y;
      glowPosRef.current.x += dx * 0.08;
      glowPosRef.current.y += dy * 0.08;
      setGlowPos({ x: glowPosRef.current.x, y: glowPosRef.current.y });
      glowRaf = requestAnimationFrame(updateGlow);
    };
    glowRaf = requestAnimationFrame(updateGlow);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(glowRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Aurora blob 1 — top-left, blue */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,142,247,0.28) 0%, rgba(79,142,247,0.08) 40%, transparent 70%)",
          top: "-20%",
          left: "-15%",
          filter: "blur(55px)",
          animation: "aurora-shift 25s ease-in-out infinite",
        }}
      />
      {/* Aurora blob 2 — top-right, purple */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.24) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          top: "-15%",
          right: "-12%",
          filter: "blur(55px)",
          animation: "aurora-shift 25s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      {/* Aurora blob 3 — bottom-center, cyan */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.20) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
          bottom: "-10%",
          left: "30%",
          filter: "blur(50px)",
          animation: "aurora-shift 25s ease-in-out infinite",
          animationDelay: "-15s",
        }}
      />
      {/* Aurora blob 4 — center-right, pink */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)",
          top: "35%",
          right: "5%",
          filter: "blur(50px)",
          animation: "aurora-shift 25s ease-in-out infinite",
          animationDelay: "-5s",
        }}
      />
      {/* Aurora blob 5 — mid-left, emerald accent */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.03) 40%, transparent 70%)",
          top: "55%",
          left: "5%",
          filter: "blur(50px)",
          animation: "aurora-shift 25s ease-in-out infinite",
          animationDelay: "-20s",
        }}
      />

      {/* Canvas particle field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Mouse cursor glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)",
          transform: `translate(${glowPos.x - 200}px, ${glowPos.y - 200}px)`,
          filter: "blur(40px)",
          transition: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
