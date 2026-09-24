import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./styles/TimelineItem.css";

export default function TimelineItem({ title, subtitle, period, details, index, isFuture = false }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.35 });

  return (
    <div ref={ref} className="timeline-item timeline-node">
      {/* Central/Left Dot with Pulsing Spring Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isInView ? 1.15 : 0.9, 
          opacity: 1,
          boxShadow: isInView 
            ? isFuture 
              ? [
                  "0 0 15px rgba(236, 72, 153, 0.6)",
                  "0 0 30px rgba(168, 85, 247, 0.95)",
                  "0 0 15px rgba(236, 72, 153, 0.6)"
                ]
              : [
                  "0 0 10px rgba(0, 229, 255, 0.6)",
                  "0 0 25px rgba(123, 97, 255, 0.95)",
                  "0 0 10px rgba(0, 229, 255, 0.6)"
                ]
            : "0 0 8px rgba(255, 255, 255, 0.2)"
        }}
        transition={isInView ? {
          boxShadow: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          },
          scale: { type: "spring", stiffness: 300, damping: 15 }
        } : {
          duration: 0.3
        }}
        className={`timeline-dot ${isFuture ? "timeline-dot-future" : ""} ${isInView ? "timeline-dot-active" : ""}`}
      />

      {/* Slide-in Card Container based on layout side */}
      <motion.div
        initial={index === 0 ? {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)"
        } : { 
          opacity: 0, 
          x: isEven ? -100 : 100, 
          y: 20,
          scale: 0.95,
          filter: "blur(10px)"
        }}
        whileInView={index === 0 ? undefined : { 
          opacity: 1, 
          x: 0, 
          y: 0,
          scale: 1,
          filter: "blur(0px)"
        }}
        viewport={{ once: true, margin: "-180px 0px -80px 0px" }}
        transition={{ 
          type: "spring", 
          stiffness: 70, 
          damping: 14, 
          mass: 0.9,
          delay: 0.1
        }}
        className={`timeline-card-wrapper ${
          isEven ? "timeline-card-wrapper-even" : "timeline-card-wrapper-odd"
        }`}
      >
        <motion.div 
          whileHover={{ 
            scale: 1.025, 
            y: -5,
            boxShadow: isFuture 
              ? "0 25px 50px rgba(168, 85, 247, 0.25)"
              : "0 20px 40px rgba(0, 229, 255, 0.2)"
          }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          className={`glass-card timeline-card ${isFuture ? "future-goal-card" : ""} ${isInView ? "timeline-card-active" : ""}`}
        >
          {/* Vercel-style Animated Glowing Border Effect */}
          <div className="card-border-glow" />

          <div className="timeline-card-header">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-wide">{title}</h3>
              {subtitle && <p className="text-xs text-cyan-300/80 font-medium mt-1">{subtitle}</p>}
            </div>
            <span className={`timeline-period-badge ${isFuture ? "timeline-period-badge-future" : ""}`}>
              {period}
            </span>
          </div>
          <p className="text-slate-300/90 leading-7 text-sm relative z-10">{details}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
