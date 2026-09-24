import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";
import ThreeDParticles from "./ThreeDParticles";

const skillCards = [
  {
    id: "frontend",
    morphId: "react",
    title: "Frontend",
    description: "Building modern component-based front-end applications with polished user experience and smooth motion.",
    tags: ["React", "Angular", "Tailwind", "GSAP"]
  },
  {
    id: "backend",
    morphId: "node",
    title: "Backend",
    description: "Designing scalable server-side APIs, real-time endpoints, and secure backend services.",
    tags: ["Node.js", "Express", "Djnago", "REST", "APIs"]
  },
  {
    id: "databases",
    morphId: "mysql",
    title: "Databases",
    description: "Modeling data, optimizing queries, and making data flow reliably across applications.",
    tags: ["MySQL", "SQLite", "MongoDB"]
  },
  {
    id: "languages",
    morphId: "java",
    title: "Languages",
    description: "Writing clean, maintainable code in JavaScript, Python, Java, and other modern languages.",
    tags: ["JavaScript", "Python", "Java", "SQL"]
  },
  {
    id: "tools",
    morphId: "tools",
    title: "Tools",
    description: "Using the right toolchain for automation, deployment, collaboration, and faster development cycles.",
    tags: ["Git", "VS Code", "Docker"]
  }
];

export default function InteractiveSkills() {
  const [activeSkill, setActiveSkill] = useState("vmr");
  const [lockedSkill, setLockedSkill] = useState(null);

  const handleCardHover = (morphId, noMorph) => {
    if (noMorph) return;
    // Only update if no skill is explicitly locked by clicking
    if (!lockedSkill) {
      setActiveSkill(morphId);
    }
  };

  const handleCardLeave = () => {
    // Return to locked skill if clicked, or idle VMR if none is locked
    if (lockedSkill) {
      setActiveSkill(lockedSkill);
    } else {
      setActiveSkill("vmr");
    }
  };

  const handleCardClick = (morphId, noMorph) => {
    if (noMorph) return;
    
    if (lockedSkill === morphId) {
      // Unlock and return to VMR
      setLockedSkill(null);
      setActiveSkill("vmr");
    } else {
      // Lock this skill
      setLockedSkill(morphId);
      setActiveSkill(morphId);
    }
  };

  return (
    <div className="mx-auto max-w-6xl w-full">
      <SectionHeader title="Core Skills" className="mb-10" />

      {/* Two-Column Layout (Canvas left 65%, Cards right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-10 items-stretch">
        
        {/* Left Side: 3D Particle Canvas wrapped in a premium Glass Card panel */}
        <div className="glass-card relative min-h-[300px] md:min-h-[350px] lg:h-full flex items-center justify-center rounded-[1.25rem] overflow-hidden p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Cyber glowing spots inside container */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <ThreeDParticles activeSkill={activeSkill} />
        </div>

        {/* Right Side: Skill Cards Column (appears completely, no scrollbar) */}
        <div className="flex flex-col gap-2 w-full justify-between">
          {skillCards.map((card) => {
            const isHoveredOrActive = activeSkill === card.morphId;
            const isClickedActive = lockedSkill === card.morphId;
            
            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => !card.noMorph && handleCardHover(card.morphId, card.noMorph)}
                onMouseLeave={() => !card.noMorph && handleCardLeave()}
                onClick={() => !card.noMorph && handleCardClick(card.morphId, card.noMorph)}
                className={`glass-card relative overflow-hidden rounded-[1.25rem] p-3.5 sm:p-4 shadow-soft transition-all duration-300 cursor-pointer select-none border w-full
                  ${isHoveredOrActive || isClickedActive
                    ? "border-cyan-400/50 shadow-[0_20px_50px_rgba(34,211,238,0.2)] bg-cyan-950/5" 
                    : "border-white/10 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(34,211,238,0.15)] bg-slate-950/30"
                  }
                `}
                whileHover={card.noMorph ? {} : { scale: 1.02, y: -2 }}
                whileTap={card.noMorph ? {} : { scale: 0.98 }}
              >
                {/* Background glow dot */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl" />

                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-cyan-300/80 mb-0.5">{card.title}</p>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    {card.title}
                    {(isHoveredOrActive || isClickedActive) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </h4>
                  <p className="mt-1 text-[11px] leading-tight text-slate-300/80 line-clamp-2">{card.description}</p>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-slate-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
