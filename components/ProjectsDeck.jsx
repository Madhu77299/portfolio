"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function ProjectsDeck({ projects }) {
  const [viewState, setViewState] = useState("stacked"); // "stacked", "spread", "focus"
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200);
  const containerRef = useRef(null);

  // Responsive layout tracking
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parallax calculations
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    if (!containerRef.current || isMobile || viewState === "focus") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // range -1 to 1
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // range -1 to 1
    setTilt({ x, y });

    if (viewState === "stacked") {
      setViewState("spread");
    }
  };

  const handleMouseLeave = () => {
    setActiveCardIndex(null);
    setTilt({ x: 0, y: 0 });
    if (viewState === "spread") {
      setViewState("stacked");
    }
  };

  // If mobile, render as a clean grid layout
  if (isMobile) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} {...project} index={index} />
        ))}
      </div>
    );
  }

  // Animation configuration for stacked and spread states
  const getCardTransform = (index) => {
    if (viewState === "stacked") {
      switch (index) {
        case 0:
          return {
            x: -24 + tilt.x * 12,
            y: -16 + tilt.y * 12,
            rotate: -6 + tilt.x * 2,
            scale: 0.96,
            filter: "blur(1.5px)",
            zIndex: 10,
            opacity: 0.85
          };
        case 1:
          return {
            x: 0 + tilt.x * 15,
            y: 0 + tilt.y * 15,
            rotate: 0 + tilt.x * 2,
            scale: 1.0,
            filter: "blur(0.5px)",
            zIndex: 20,
            opacity: 0.95
          };
        case 2:
        default:
          return {
            x: 24 + tilt.x * 18,
            y: 16 + tilt.y * 18,
            rotate: 6 + tilt.x * 2,
            scale: 1.04,
            filter: "blur(0px)",
            zIndex: 30,
            opacity: 1
          };
      }
    } else {
      // Exploded / Spread state
      let targetX = 0;
      let targetY = 0;
      let targetRotate = 0;
      let targetScale = 1.0;
      let zIndexVal = 20;

      // Calculate dynamic spread based on window width (min 150px, max 380px)
      const spreadX = Math.max(150, Math.min(380, (windowWidth / 2) - 220));

      if (index === 0) {
        targetX = -spreadX + tilt.x * 20;
        targetY = -10 + tilt.y * 20;
        targetRotate = -6 + tilt.x * 3;
        zIndexVal = 10;
      } else if (index === 1) {
        targetX = 0 + tilt.x * 25;
        targetY = -40 + tilt.y * 25;
        targetRotate = 0 + tilt.x * 3;
        targetScale = 1.03;
        zIndexVal = 30;
      } else {
        targetX = spreadX + tilt.x * 20;
        targetY = -10 + tilt.y * 20;
        targetRotate = 6 + tilt.x * 3;
        zIndexVal = 20;
      }

      if (activeCardIndex === index) {
        targetScale = 1.06;
        targetY -= 15;
        zIndexVal = 40;
      }

      return {
        x: targetX,
        y: targetY,
        rotate: targetRotate,
        scale: targetScale,
        filter: "blur(0px)",
        zIndex: zIndexVal,
        opacity: 1
      };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[580px] py-8 overflow-visible"
    >
      {/* Background glow trail */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/5 to-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {viewState === "focus" && selectedIndex !== null ? (
        <motion.div
          key="focus-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="w-full flex flex-col items-center z-10"
        >
          <button
            onClick={() => {
              setViewState("spread");
              setSelectedIndex(null);
            }}
            className="btn-glass-pill mb-8 text-xs uppercase tracking-wider flex items-center gap-2 px-5 py-2 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-colors"
          >
            ← Back to Projects Grid
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr] gap-10 w-full mx-auto min-h-[500px]">
            {/* Left Column: Featured Hero Project */}
            <div className="relative flex items-center justify-center">
              <div className="spotlight-blur" />
              <motion.div
                key={`hero-${projects[selectedIndex].title}`}
                className="w-full h-full min-h-[480px] relative z-10"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <ProjectCard
                  {...projects[selectedIndex]}
                  index={selectedIndex}
                  isFeatured={true}
                  className="shadow-[0_24px_80px_rgba(34,211,238,0.25)] border-cyan-400/40"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                />
              </motion.div>
            </div>

            {/* Right Column: Other Projects List */}
            <div className="flex flex-col gap-6 justify-center">
              {projects.map((project, i) => {
                if (i === selectedIndex) return null;
                return (
                  <motion.div
                    key={`mini-${project.title}`}
                    onClick={() => setSelectedIndex(i)}
                    className="h-[140px] relative cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: i * 0.05 }}
                  >
                    <ProjectCard
                      {...project}
                      index={i}
                      isMini={true}
                      className="hover:border-cyan-400/30 hover:shadow-[0_10px_30px_rgba(34,211,238,0.15)] transition-all duration-300"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="deck-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="relative flex flex-col items-center justify-center w-full"
        >
          {/* Instruction tooltip */}
          <div className="mb-12 text-xs uppercase tracking-[0.25em] text-cyan-300/90 font-bold bg-white/5 border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-md pointer-events-none animate-pulse shadow-glass">
            {viewState === "stacked" ? "Hover Stack to Unveil Projects" : "Click Card to Focus Details"}
          </div>

          {/* Deck / Spread Area */}
          <div 
            className="relative w-[340px] sm:w-[440px] md:w-[480px] h-[320px] sm:h-[360px] flex items-center justify-center max-w-full"
          >
            {/* Stack floating animation wrapper */}
            <motion.div
              animate={viewState === "stacked" ? {
                y: [0, -12, 0],
                rotateX: -tilt.y * 12,
                rotateY: tilt.x * 12,
                perspective: 1200
              } : {
                y: 0,
                rotateX: -tilt.y * 12,
                rotateY: tilt.x * 12,
                perspective: 1200
              }}
              transition={viewState === "stacked" ? {
                y: {
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                },
                default: { type: "spring", stiffness: 120, damping: 20 }
              } : {
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {projects.map((project, index) => {
                const transformProps = getCardTransform(index);

                return (
                  <motion.div
                    key={project.title}
                    layoutId={`project-card-container-${project.title}`}
                    onMouseEnter={() => {
                      if (viewState === "spread") setActiveCardIndex(index);
                    }}
                    onMouseLeave={() => {
                      if (viewState === "spread") setActiveCardIndex(null);
                    }}
                    onClick={(e) => {
                      if (viewState === "spread") {
                        e.stopPropagation();
                        setSelectedIndex(index);
                        setViewState("focus");
                      }
                    }}
                    animate={transformProps}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 16,
                      delay: viewState === "spread" ? index * 0.05 : (2 - index) * 0.05
                    }}
                    className="absolute w-full h-full cursor-pointer"
                    style={{
                      transformOrigin: "center center"
                    }}
                  >
                    <ProjectCard
                      {...project}
                      index={index}
                      className={`transition-shadow duration-300 bg-slate-950/90 backdrop-blur-3xl ${
                        activeCardIndex === index
                          ? "shadow-[0_24px_80px_rgba(34,211,238,0.25)] border-cyan-400/40"
                          : "shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Stack Deck Back button */}
          {viewState === "spread" && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setViewState("stacked");
              }}
              className="btn-glass-pill mt-12 text-xs uppercase tracking-wider py-2 px-6 hover:bg-white/10 hover:border-white/20 transition-colors"
            >
              Stack Projects Deck
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
