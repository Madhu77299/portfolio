import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./styles/DeveloperIDCard.css";

export default function DeveloperIDCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const cardRef = useRef(null);

  // Motion values for mouse hover tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth 3D tilt
  const springConfig = { stiffness: 150, damping: 20, mass: 0.8 };
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Springs for lanyard flex (bends slightly based on hover position)
  const lanyardBendX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const lanyardBendY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-5, 10]), springConfig);

  // Reset rotation when mouse leaves
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates to range [-0.5, 0.5]
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    // Reset mouse coordinates on flip to avoid weird 3D offset
    mouseX.set(0);
    mouseY.set(0);
  };

  // Handle load state to trigger drop animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Drop animation variants using spring physics
  const containerVariants = {
    hidden: { 
      y: -800,
      rotate: -35
    },
    visible: { 
      y: 0,
      rotate: 0,
      transition: {
        y: { type: "spring", stiffness: 70, damping: 14, mass: 1.1 },
        rotate: { type: "spring", stiffness: 12, damping: 2.0, mass: 2.2 }
      }
    }
  };

  return (
    <div className="relative w-full min-h-[480px] sm:h-[550px] flex flex-col items-center justify-center overflow-visible z-30 scale-[0.88] xs:scale-95 sm:scale-100 origin-center">

      {/* SVG Lanyard / Strap */}
      <div className="absolute top-[-150px] sm:top-[-180px] w-[300px] sm:w-[340px] h-[190px] sm:h-[220px] pointer-events-none z-10 flex justify-center overflow-visible">
        <svg width="100%" height="100%" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
          {/* Lanyard Navy Strap */}
          <motion.path
            d={useTransform(
              [lanyardBendX, lanyardBendY],
              ([bx, by]) => `M 100 0 C 70 40, 65 90, ${100 + bx} ${130 + by} C ${135 + bx} 90, 130 40, 100 0`
            )}
            stroke="#0d1e36"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
            }}
          />
          {/* Strap Inner Woven Texture Detail */}
          <motion.path
            d={useTransform(
              [lanyardBendX, lanyardBendY],
              ([bx, by]) => `M 100 0 C 70 40, 65 90, ${100 + bx} ${130 + by} C ${135 + bx} 90, 130 40, 100 0`
            )}
            stroke="#1d4ed8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
            className="opacity-70"
          />
          {/* Metal Clip Ring Attachment */}
          <motion.g
            style={{
              x: lanyardBendX,
              y: lanyardBendY
            }}
          >
            {/* Triangular Ring D-Clip */}
            <path
              d="M 92 128 L 108 128 L 100 142 Z"
              fill="#94a3b8"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            {/* Metallic Clip Hook clasp */}
            <rect
              x="96"
              y="142"
              width="8"
              height="15"
              rx="2"
              fill="url(#metalGradient)"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Little bolt accent on clip */}
            <circle cx="100" cy="148" r="1.5" fill="#334155" />
          </motion.g>

          <defs>
            <linearGradient id="metalGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Card Drop and Swing Wrapper */}
      <motion.div
        ref={cardRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative perspective-1000 w-[300px] sm:w-[340px] h-[480px] sm:h-[520px] cursor-pointer max-w-full"
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Floating Idle Animation Wrapper (only active after entering) */}
        <motion.div
          animate={{
            rotateY: isFlipped ? 180 : 0,
            ...(hasEntered && !isHovered
              ? {
                y: [0, -6, 0],
                rotate: [-0.6, 0.6, -0.6]
              }
              : { y: 0, rotate: 0 })
          }}
          transition={{
            y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 2.0, ease: "easeInOut" },
            rotateY: { type: "spring", stiffness: 320, damping: 25 }
          }}
          style={{
            rotateX: isFlipped ? 0 : rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: "preserve-3d"
          }}
          className="w-full h-full preserve-3d"
        >

          {/* ==================== FRONT SIDE ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-[24px] backface-hidden id-card-front-glow border border-white/15 bg-white/5 backdrop-blur-[24px] p-5 flex flex-col justify-between overflow-hidden select-none">
            {/* Glassmorphic sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.04] to-white/[0.12] pointer-events-none rounded-[24px]" />

            {/* Top Bar: Lanyard hole, Icon & Company Title */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                {/* Developer Icon */}
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Personal</span>
                  <span className="text-[9px] font-semibold text-cyan-400/90 uppercase tracking-wider">Portfolio</span>
                </div>
              </div>

              {/* Lanyard Slot Cutout */}
              <div className="w-10 h-3 rounded-full bg-slate-950/40 border border-white/10 flex items-center justify-center">
                <div className="w-6 h-1 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Portrait Image (40% height container) */}
            <div className="relative w-full h-[240px] rounded-xl overflow-hidden border border-white/10 bg-slate-950/40 my-3 flex items-center justify-center">
              {/* Profile Image with subtle scale on hover */}
              <motion.img
                src="/images/hero-profile.png"
                alt="Voonna Madhusudhana Rao"
                className="w-full h-full object-cover object-top"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

              {/* Decorative Tech Overlay on portrait corner */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-cyan-500/20 backdrop-blur border border-cyan-400/30 text-[8px] font-bold text-cyan-300 uppercase tracking-wider">
                ID VERIFIED
              </div>
            </div>

            {/* Middle Section: Name & Role */}
            <div className="text-center flex flex-col items-center justify-center gap-1.5 z-10 pb-4">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                Voonna Madhusudhana Rao
              </h2>
              <p className="text-sm font-semibold text-cyan-300 uppercase tracking-widest">
                Full Stack Developer
              </p>
            </div>
          </div>

          {/* ==================== BACK SIDE ==================== */}
          <div className="absolute inset-0 w-full h-full rounded-[24px] backface-hidden id-card-back-glow border border-white/15 bg-white/5 backdrop-blur-[24px] p-6 flex flex-col justify-between rotate-y-180 overflow-hidden select-none">
            {/* Glassmorphic sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tl from-white/0 via-white/[0.04] to-white/[0.12] pointer-events-none rounded-[24px]" />

            {/* Top Bar: Lanyard hole & Logo */}
            <div className="flex justify-between items-center z-10">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">BACKPLATE v1.0</span>
              <div className="w-10 h-3 rounded-full bg-slate-950/40 border border-white/10 flex items-center justify-center">
                <div className="w-6 h-1 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* QR Code Placeholder with tech scanner lines */}
            <div className="relative w-[130px] h-[130px] mx-auto rounded-xl border border-white/10 bg-slate-950/50 p-2 flex items-center justify-center overflow-hidden my-3">
              {/* Tech background matrix grid */}
              <div className="absolute inset-0 qr-code-grid opacity-30" />

              {/* Simulated QR Code using HTML elements for high fidelity */}
              <div className="relative w-full h-full border border-cyan-500/20 bg-slate-950/90 rounded p-1 flex flex-col justify-between">
                {/* 3 Corner Positioning Boxes */}
                <div className="absolute top-1.5 left-1.5 w-6 h-6 border-2 border-cyan-400 flex items-center justify-center rounded-sm">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
                </div>
                <div className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-cyan-400 flex items-center justify-center rounded-sm">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
                </div>
                <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-2 border-cyan-400 flex items-center justify-center rounded-sm">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
                </div>

                {/* Center / filler QR patterns */}
                <div className="absolute inset-0 m-8 flex flex-wrap gap-1 items-center justify-center opacity-85">
                  <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
                </div>
              </div>

              {/* Dynamic scan line overlay */}
              <motion.div
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                animate={{ top: ["5%", "95%", "5%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Interactive/Social Links */}
            <div className="flex flex-col gap-2.5 z-10 w-full px-2 text-xs">
              <a
                href="https://github.com/Madhu77299"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-white transition-all"
              >
                <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="font-medium tracking-wide">GitHub</span>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-white transition-all"
              >
                <svg className="w-4 h-4 text-slate-400 hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="font-medium tracking-wide">LinkedIn</span>
              </a>

              <a
                href="mailto:msvvoonna@gmail.com"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-white transition-all"
              >
                <svg className="w-4 h-4 text-slate-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium tracking-wide">Email</span>
              </a>
            </div>

            {/* Tagline / Footer quote on card back */}
            <div className="text-center z-10 px-1 border-t border-white/10 pt-3">
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                "Building safe, intelligent, and human-centric software ecosystems."
              </p>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}
