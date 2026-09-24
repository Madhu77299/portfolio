import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const techItems = [
  {
    name: "HTML5",
    color: "from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/30",
    glow: "rgba(249, 115, 22, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 0h21l-1.9 21.2L12 24 3.4 21.2zM12 18.8l4.4-1.2.6-6.3H8.3v-2.5h8.9l.2-2.7H5.4v11.5l6.6 1.8z"/>
      </svg>
    )
  },
  {
    name: "CSS3",
    color: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
    glow: "rgba(59, 130, 246, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 0h21l-1.9 21.2L12 24 3.4 21.2zM12 18.8l4.4-1.2.6-6.3H5.7v-2.5h11.4l.2-2.7H5.2V3.4h13.9l-.6 6.3H12v2.5h5l-.5 5.1-4.5 1.2z"/>
      </svg>
    )
  },
  {
    name: "JavaScript",
    color: "from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/30",
    glow: "rgba(234, 179, 8, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M24 0H0v24h24V0zM11.8 19.3c-.7.5-1.5.8-2.5.8-1.7 0-3-1-3.5-2.5h2.6c.3.7 1 1 1.6 1 .6 0 1-.3 1-.8v-7h2.8v7.2c0 1.9-1.2 2.8-2.5 2.8zm7.3-.2c-.8.6-1.8.9-2.9.9-1.9 0-3.3-1.1-3.6-3h2.7c.2.6.8 1 1.4 1 .6 0 1-.3 1-.7s-.3-.6-1-1l-1-.4c-1.8-.7-2.6-1.6-2.6-3.2 0-1.8 1.4-2.9 3.3-2.9 1.4 0 2.4.5 3 1.5l-2.2 1.3c-.3-.5-.7-.8-1.2-.8-.5 0-.8.3-.8.6s.3.5.8.7l1.1.4c2 .8 2.8 1.8 2.8 3.3 0 2-1.3 3.3-3.7 3.3z"/>
      </svg>
    )
  },
  {
    name: "TypeScript",
    color: "from-blue-600/20 to-blue-700/10 text-blue-300 border-blue-500/30",
    glow: "rgba(37, 99, 235, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M0 0h24v24H0V0zm22.4 18.2c-.8.6-1.8.9-2.9.9-1.9 0-3.3-1.1-3.6-3h2.7c.2.6.8 1 1.4 1 .6 0 1-.3 1-.7s-.3-.6-1-1l-1-.4c-1.8-.7-2.6-1.6-2.6-3.2 0-1.8 1.4-2.9 3.3-2.9 1.4 0 2.4.5 3 1.5l-2.2 1.3c-.3-.5-.7-.8-1.2-.8-.5 0-.8.3-.8.6s.3.5.8.7l1.1.4c2 .8 2.8 1.8 2.8 3.3 0 2-1.3 3.3-3.7 3.3zm-11.2.9H6v-2.3h2.3V8.3h-2.3V6h6.9v2.3H10.6v7.6h2.3v2.3h-1.7z"/>
      </svg>
    )
  },
  {
    name: "React.js",
    color: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30",
    glow: "rgba(6, 182, 212, 0.15)",
    icon: (
      <svg className="w-5 h-5 animate-[spin_12s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
        <ellipse rx="10" ry="4" transform="matrix(1 0 0 1 12 12)"/>
        <ellipse rx="10" ry="4" transform="matrix(0.5 0.866 -0.866 0.5 12 12)"/>
        <ellipse rx="10" ry="4" transform="matrix(0.5 -0.866 0.866 0.5 12 12)"/>
      </svg>
    )
  },
  {
    name: "Next.js",
    color: "from-slate-100/15 to-slate-200/5 text-slate-200 border-white/20",
    glow: "rgba(255, 255, 255, 0.1)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm5.062 18.257l-4.821-6.223v6.223h-1.554V9.076h1.554l4.47 5.766V9.076h1.554v9.181zM10.15 9.076h-1.55v4.59h1.55zm0 0"/>
      </svg>
    )
  },
  {
    name: "Node.js",
    color: "from-green-500/20 to-green-600/10 text-green-400 border-green-500/30",
    glow: "rgba(34, 197, 94, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5L7.5 14l1.41-1.41L11 14.67l5.09-5.09L17.5 11 11 17.5z" fill="none"/>
        <path d="M2.08 10.3l3.65-6.32a1 1 0 0 1 .86-.5h7.3a1 1 0 0 1 .86.5l3.65 6.32a1 1 0 0 1 0 1l-3.65 6.32a1 1 0 0 1-.86.5H6.59a1 1 0 0 1-.86-.5L2.08 11.3a1 1 0 0 1 0-1z"/>
      </svg>
    )
  },
  {
    name: "Express.js",
    color: "from-gray-500/20 to-gray-600/10 text-gray-300 border-gray-500/30",
    glow: "rgba(156, 163, 175, 0.1)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    )
  },
  {
    name: "MongoDB",
    color: "from-green-600/20 to-green-700/10 text-green-300 border-green-600/30",
    glow: "rgba(22, 163, 74, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.18 11.3c-.63-2.92-2.18-5.7-5.18-8.3-3 2.6-4.55 5.38-5.18 8.3C6.18 14.22 8 16.5 12 21.3c4-4.8 5.82-7.08 5.18-10zM12 18.5V4.5c2.3 2.1 3.5 4.3 3.9 6.5.3 2-.6 3.6-3.9 7.5z"/>
      </svg>
    )
  },
  {
    name: "MySQL",
    color: "from-cyan-600/20 to-cyan-700/10 text-cyan-300 border-cyan-600/30",
    glow: "rgba(6, 182, 212, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.2 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm2.3 14.5c-.8.6-2 .9-3.2.9-2.3 0-4-1.5-4-4s1.7-4 4-4c1.2 0 2.4.3 3.2.9l-1 1.7c-.6-.4-1.3-.6-2.2-.6-1.3 0-2.3.8-2.3 2s1 2 2.3 2c.9 0 1.6-.2 2.2-.6l1 1.7z"/>
      </svg>
    )
  },
  {
    name: "Java",
    color: "from-red-500/20 to-orange-600/10 text-red-400 border-red-500/30",
    glow: "rgba(239, 68, 68, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 19.3c3.7-.8 7.3-.8 11-.1 2.2.4 4.5.3 6.7-.2v1.5c-2.3.6-4.7.7-7 .2-3.6-.8-7.2-.8-10.7-.1v-1.3zm12.3-5.2c-.3 0-.6.1-.8.2-1.3 1-3.6 1.1-4.9.2.5-.2.9-.6 1.2-1.1-.9.1-1.8-.2-2.4-.8.5-.2 1-.3 1.6-.2-.7-.5-1.1-1.3-1-2.1.5.2.9.3 1.4.3-.8-.9-.9-2.2-.3-3.2.9 1.1 2.3 1.8 3.8 2 .1-1 .7-2 1.6-2.5.4 1-.2 2.2-1.2 2.6 1.4-.2 2.8-.8 4-1.7-.5 1-1.4 1.7-2.5 2 1.2.2 2.3.7 3.3 1.4-1.1.2-2.2-.1-3-.7-.2.4-.5.6-.8.7z"/>
      </svg>
    )
  },
  {
    name: "Python",
    color: "from-blue-500/20 to-yellow-500/10 text-yellow-300 border-blue-400/30",
    glow: "rgba(59, 130, 246, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5zm-.1-4.7c0 .2-.1.4-.3.4h-2.2c-.2 0-.3-.2-.3-.4v-4c0-.2.1-.4.3-.4h2.2c.2 0 .3.2.3.4v4z"/>
      </svg>
    )
  },
  {
    name: "Git",
    color: "from-orange-500/20 to-red-500/10 text-orange-400 border-orange-500/30",
    glow: "rgba(249, 115, 22, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.3 11.7L12.3.7c-.9-.9-2.5-.9-3.4 0L6.7 2.9l3.2 3.2c.8-.3 1.8-.1 2.4.5.6.6.8 1.6.5 2.4l3.2 3.2c.8-.3 1.8-.1 2.4.5.9.9.9 2.5 0 3.4s-2.5.9-3.4 0c-.6-.6-.8-1.6-.5-2.4L11.3 10.5c-.3.3-.3.8 0 1.1l3.2 3.2c-.3.8-.1 1.8.5 2.4.9.9 2.5.9 3.4 0l4.9-4.9c1-.9 1-2.5 0-3.6z"/>
      </svg>
    )
  },
  {
    name: "GitHub",
    color: "from-purple-500/20 to-slate-800/25 text-slate-100 border-white/20",
    glow: "rgba(168, 85, 247, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    )
  },
  {
    name: "REST APIs",
    color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    glow: "rgba(16, 185, 129, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    )
  },
  {
    name: "Tailwind CSS",
    color: "from-cyan-400/20 to-blue-500/10 text-cyan-300 border-cyan-400/30",
    glow: "rgba(34, 211, 238, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
      </svg>
    )
  },
  {
    name: "Bootstrap",
    color: "from-purple-600/20 to-purple-700/10 text-purple-300 border-purple-500/30",
    glow: "rgba(147, 51, 234, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 0h16c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4zm4.8 6v12h4.5c1.8 0 3-.9 3-2.3 0-1-.6-1.8-1.6-2.1.8-.3 1.2-1 1.2-1.9 0-1.3-1.1-2.1-2.8-2.1H8.8zm2.2 2.2h1.8c.6 0 1 .3 1 .8s-.4.8-1 .8h-1.8V8.2zm0 3.8h2c.7 0 1.1.3 1.1.9s-.4.9-1.1.9h-2V12z"/>
      </svg>
    )
  },
  {
    name: "Firebase",
    color: "from-amber-500/20 to-orange-600/10 text-amber-400 border-amber-500/30",
    glow: "rgba(245, 158, 11, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.9 17.6L12 .9l2.8 5.4 1.3-2.4zM12.3 8.3L9.6 13.6l6.6-6.6zM20.1 17.6L12 23.1 3.9 17.6l8.1-4.8z"/>
      </svg>
    )
  },
  {
    name: "Cloud Computing",
    color: "from-sky-500/20 to-blue-600/10 text-sky-400 border-sky-500/30",
    glow: "rgba(14, 165, 233, 0.15)",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
      </svg>
    )
  }
];

// Duplicate list for a seamless infinite scroll loop
const doubleTechItems = [...techItems, ...techItems];

export default function TechStackShowcase() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (!marqueeRef.current) return;
    
    // Width of a single full set of badges (half of the duplicated list)
    const singleSetWidth = marqueeRef.current.scrollWidth / 2;

    // Speeds: pixels per second
    let currentSpeed = 35; // Default marquee speed
    if (isHovered) {
      currentSpeed = 8; // Pause on hover, or extremely slow so it looks suspended
    }
    if (isClicked) {
      currentSpeed = 75; // Fast forward on click / interact
    }

    const currentX = x.get();
    
    // Standard modular wrapper to prevent x drift
    const startX = currentX <= -singleSetWidth ? currentX % singleSetWidth : currentX;
    x.set(startX);

    const distanceLeft = singleSetWidth + startX;
    const duration = distanceLeft / currentSpeed;

    let controls = animate(x, [startX, -singleSetWidth], {
      ease: "linear",
      duration: duration,
      onComplete: () => {
        x.set(0);
        triggerLoop();
      }
    });

    function triggerLoop() {
      controls = animate(x, [0, -singleSetWidth], {
        ease: "linear",
        duration: singleSetWidth / currentSpeed,
        repeat: Infinity,
        repeatType: "loop"
      });
    }

    return () => controls?.stop();
  }, [isHovered, isClicked]);

  return (
    <section className="relative w-full pt-12 pb-2 overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-32 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-32 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating particles inside the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
            style={{
              left: `${15 + i * 14}%`,
              top: `${25 + (i % 2) * 40}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full relative z-10">
        {/* Horizontal Ticker Bar */}
        <div 
          ref={containerRef}
          className="relative w-full border-y border-white/10 bg-slate-950/45 backdrop-blur-xl py-6 px-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] group/ticker"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsClicked(false);
          }}
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
          onTouchStart={() => setIsClicked(true)}
          onTouchEnd={() => setIsClicked(false)}
        >
          {/* Subtle Internal Neon Reflections */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-blue-500/5 pointer-events-none" />

          {/* Left & Right Edge Blur Masks */}
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-slate-950/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-slate-950/90 to-transparent z-20 pointer-events-none" />

          {/* Scrolling Badges Row */}
          <motion.div
            ref={marqueeRef}
            className="flex gap-4 items-center w-max cursor-grab active:cursor-grabbing"
            style={{ x }}
          >
            {doubleTechItems.map((tech, idx) => (
              <motion.div
                key={idx}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border bg-gradient-to-br ${tech.color} backdrop-blur-md transition-all duration-300 relative overflow-hidden`}
                whileHover={{
                  scale: 1.06,
                  y: -2,
                  boxShadow: `0 8px 24px -4px ${tech.glow}, 0 4px 12px -2px rgba(0, 0, 0, 0.4)`,
                  borderColor: "rgba(255,255,255,0.3)"
                }}
              >
                {/* Glow layer behind item */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                  style={{
                    boxShadow: `inset 0 0 12px ${tech.glow}`,
                  }}
                />

                <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {tech.icon}
                </span>
                <span className="text-xs md:text-sm font-semibold tracking-wider uppercase select-none">
                  {tech.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
