import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThreeDLogo from "./ThreeDLogo";
import "./styles/Preloader.css";

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 3500; // Total count-up duration in ms
    const intervalTime = 16; // Approx 60fps updates
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 500); // Small pause at 100% for smooth cinematic transition
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -100,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
      }}
      className="preloader-container"
    >
      <div className="preloader-grid" />
      <div className="preloader-glow-left" />
      <div className="preloader-glow-right" />

      <div className="preloader-content">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="preloader-title"
        >
          Voonna Madhusudhana Rao
        </motion.p>
        
        <div className="preloader-circle-wrapper">
          <svg className="preloader-circle-svg" viewBox="0 0 120 120">
            {/* Ambient Background ring */}
            <circle 
              className="preloader-circle-bg" 
              cx="60" 
              cy="60" 
              r="52" 
            />
            {/* Animated filling gradient ring */}
            <circle 
              className="preloader-circle-fill" 
              cx="60" 
              cy="60" 
              r="52" 
              strokeDasharray="327"
              strokeDashoffset={327 - (327 * progress) / 100}
            />
          </svg>
          <div className="preloader-percentage-inside">
            <ThreeDLogo progress={progress} />
            <span className="absolute bottom-2 text-[11px] font-bold font-mono tracking-widest text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10">
              {progress}%
            </span>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="preloader-subtitle"
        >
          Initiating Portfolio Experience
        </motion.p>
      </div>
    </motion.div>
  );
}
