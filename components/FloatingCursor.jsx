"use client";

import { useEffect, useRef, useState } from "react";
import "./styles/FloatingCursor.css";

export default function FloatingCursor() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true, will verify on mount
  const hoverStateRef = useRef("normal"); // use ref to access directly in the high-frequency animation loop
  const lastHoveredCard = useRef(null);

  // Detect touch device on mount
  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);



  // Main interaction and animation logic
  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize mouse and cursor positions to center of screen initially
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseRef.current = { x: centerX, y: centerY };
    prevMouseRef.current = { x: centerX, y: centerY };
    cursorRef.current = { x: centerX, y: centerY };

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Global event delegation for hover states
    const handlePointerOver = (e) => {
      const target = e.target;
      if (!target) return;

      // 1. Check for buttons/links
      if (target.closest("a, button, input[type='submit'], input[type='button'], [role='button'], .cursor-pointer")) {
        hoverStateRef.current = "button";
        return;
      }

      // 2. Check for hero portrait / container
      if (target.closest(".profile-portrait-glow, .animate-float-portrait")) {
        hoverStateRef.current = "hero";
        return;
      }

      // 3. Check for cards
      const card = target.closest(".glass-card, [data-hover='card']");
      if (card) {
        if (lastHoveredCard.current !== card) {
          lastHoveredCard.current = card;
          triggerBurst(e.clientX, e.clientY);
        }
        hoverStateRef.current = "card";
        return;
      }

      hoverStateRef.current = "normal";
    };

    const handlePointerOut = (e) => {
      if (!e.relatedTarget) {
        hoverStateRef.current = "normal";
        lastHoveredCard.current = null;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });

    // Particle Pool setup
    const maxParticles = 160;
    const particles = Array.from({ length: maxParticles }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      maxSize: 0,
      color: "#00E5FF",
      alpha: 0,
      decay: 0,
      spark: false,
    }));

    const spawnParticle = (x, y, vx, vy, hoverState) => {
      const p = particles.find((part) => !part.active);
      if (!p) return;

      p.active = true;
      p.x = x;
      p.y = y;

      // Decide particle type: spark vs soft dot
      const isSpark = Math.random() > 0.4;
      p.spark = isSpark;

      // Select colors based on weights (Primary: #00E5FF, Secondary: #38BDF8, Accent: #7C3AED)
      const colorRand = Math.random();
      if (colorRand < 0.5) {
        p.color = "#00E5FF";
      } else if (colorRand < 0.8) {
        p.color = "#38BDF8";
      } else {
        p.color = "#7C3AED";
      }

      // Physics configuration based on hoverState and particle type
      let speedMult = 1.0;
      if (hoverState === "button") speedMult = 1.6;
      else if (hoverState === "hero") speedMult = 1.3;
      else if (hoverState === "card") speedMult = 1.2;

      if (isSpark) {
        // Sparks are tiny, fast, short-lived
        const angle = Math.random() * Math.PI * 2;
        const velocityMagnitude = (Math.random() * 2 + 1) * speedMult;
        p.vx = Math.cos(angle) * velocityMagnitude + vx * 0.1;
        p.vy = Math.sin(angle) * velocityMagnitude + vy * 0.1;
        p.size = Math.random() * 1.5 + 0.8;
        p.maxSize = p.size;
        p.alpha = 1.0;
        p.decay = Math.random() * 0.035 + 0.025; // short lifetime
      } else {
        // Dots are soft, slow, and live slightly longer
        p.vx = (Math.random() - 0.5) * 0.6 + vx * 0.05;
        p.vy = (Math.random() - 0.5) * 0.6 + vy * 0.05;
        p.size = Math.random() * 4 + 2.5;
        p.maxSize = p.size;
        p.alpha = 0.85;
        p.decay = Math.random() * 0.018 + 0.012; // longer lifetime
      }
    };

    const triggerBurst = (x, y) => {
      // Spawn burst particles in all directions
      const burstCount = 18;
      for (let i = 0; i < burstCount; i++) {
        const p = particles.find((part) => !part.active);
        if (!p) break;

        p.active = true;
        p.x = x;
        p.y = y;

        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 3 + 1.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        p.spark = Math.random() > 0.3;
        const colorRand = Math.random();
        p.color = colorRand < 0.4 ? "#00E5FF" : colorRand < 0.7 ? "#38BDF8" : "#7C3AED";

        if (p.spark) {
          p.size = Math.random() * 1.5 + 0.8;
          p.alpha = 1.0;
          p.decay = Math.random() * 0.03 + 0.02;
        } else {
          p.size = Math.random() * 3.5 + 2.0;
          p.alpha = 0.8;
          p.decay = Math.random() * 0.015 + 0.01;
        }
        p.maxSize = p.size;
      }
    };

    // Animation Loop
    let animationFrameId;
    
    const tick = () => {
      // 1. Smooth out cursor position using lerp interpolation
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      
      const dx = targetX - cursorRef.current.x;
      const dy = targetY - cursorRef.current.y;
      
      // Calculate velocity of cursor movement
      const velX = targetX - prevMouseRef.current.x;
      const velY = targetY - prevMouseRef.current.y;
      const velocity = Math.sqrt(velX * velX + velY * velY);
      
      // Lerp mouse follow speed (slightly slower when hovering elements for magnetic feel)
      const currentHover = hoverStateRef.current;
      const lerpFactor = currentHover === "button" ? 0.12 : 0.18;
      cursorRef.current.x += dx * lerpFactor;
      cursorRef.current.y += dy * lerpFactor;

      // 2. Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 3. Emit particles if the mouse is moving
      if (velocity > 0.3) {
        // Base emit rate
        let emitProbability = 0.35;
        if (currentHover === "button") emitProbability = 0.65;
        else if (currentHover === "hero") emitProbability = 0.55;
        else if (currentHover === "card") emitProbability = 0.45;

        // Spawn multiple particles when moving fast
        const particlesToSpawn = Math.min(Math.floor(velocity / 3) + 1, 4);
        for (let i = 0; i < particlesToSpawn; i++) {
          if (Math.random() < emitProbability) {
            // Jitter the spawn position along the movement vector for smoother trail spacing
            const lerpRatio = Math.random();
            const spawnX = prevMouseRef.current.x + velX * lerpRatio;
            const spawnY = prevMouseRef.current.y + velY * lerpRatio;
            spawnParticle(spawnX, spawnY, velX, velY, currentHover);
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        if (!p.active) return;

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        
        // Add subtle natural friction / deceleration
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Decay particle lifetime
        p.alpha -= p.decay;
        
        // Reduce scale over time
        p.size = p.maxSize * (p.alpha > 0 ? p.alpha : 0);

        if (p.alpha <= 0) {
          p.active = false;
          return;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.spark ? p.alpha : p.alpha * 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 4. Draw primary interactive cursor (ring + dot)
      ctx.save();
      
      let cursorColor = "#00E5FF"; // cyan primary
      let ringRadius = 14;
      let dotRadius = 3;
      let glowBlur = 12;

      // Adjust cursor visual feedback based on state
      if (currentHover === "button") {
        cursorColor = "#7C3AED"; // purple accent
        ringRadius = 26;
        dotRadius = 1.5;
        glowBlur = 24;
      } else if (currentHover === "hero") {
        cursorColor = "#00E5FF"; // cyan
        ringRadius = 18;
        dotRadius = 3;
        glowBlur = 18;
      } else if (currentHover === "card") {
        cursorColor = "#38BDF8"; // blue secondary
        ringRadius = 16;
        dotRadius = 4;
        glowBlur = 16;
      }

      const curX = cursorRef.current.x;
      const curY = cursorRef.current.y;

      // Draw Outer Ring
      ctx.beginPath();
      ctx.arc(curX, curY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = cursorColor;
      ctx.lineWidth = currentHover === "button" ? 1.5 : 1.2;
      ctx.shadowColor = cursorColor;
      ctx.shadowBlur = glowBlur;
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      // Draw Inner Dot
      ctx.beginPath();
      ctx.arc(curX, curY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = cursorColor;
      ctx.shadowColor = cursorColor;
      ctx.shadowBlur = glowBlur / 2;
      ctx.globalAlpha = 0.95;
      ctx.fill();

      ctx.restore();

      // Store mouse position for velocity tracking in the next frame
      prevMouseRef.current.x = targetX;
      prevMouseRef.current.y = targetY;

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="custom-cursor-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
}
