import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Counter({ value, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const num = parseInt(value, 10) || 0;
  const suffix = value.replace(String(num), "");

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = num;
      if (start === end) return;

      const totalMilliseconds = duration * 1000;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / totalMilliseconds, 1);

        // Quadratic ease-out formula
        const easeProgress = progress * (2 - progress);

        setCount(Math.floor(easeProgress * (end - start) + start));

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, num, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const statsData = [
  {
    value: "5+",
    label: "Projects Built",
    color: "cyan",
    glowClass: "from-cyan-400 to-blue-500",
  },
  {
    value: "3+",
    label: "Certifications",
    color: "purple",
    glowClass: "from-purple-400 to-indigo-500",
  },
  {
    value: "15+",
    label: "Technologies",
    color: "pink",
    glowClass: "from-pink-400 to-rose-500",
  },
  {
    value: "50+",
    label: "LeetCode Active Days",
    color: "emerald",
    glowClass: "from-emerald-400 to-teal-500",
  },
];

export default function AchievementStats() {
  return (
    <section className="relative w-full py-16 px-6 lg:px-16 overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cyan glow blob behind first card */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

        {/* Purple glow blob behind third card */}
        <div className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Responsive layout: 4 columns on desktop, 2 columns on tablet, 1 column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover="hover"
              className="relative group overflow-hidden rounded-[24px] p-8 transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 8px 40px rgba(6, 182, 212, 0.08)"
              }}
              variants={{
                hover: {
                  y: -10,
                  scale: 1.02,
                  borderColor: "rgba(6, 182, 212, 0.35)",
                  boxShadow: "0 20px 48px rgba(6, 182, 212, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                }
              }}
            >
              {/* Glass reflection sheen sweep overlay */}
              <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                variants={{
                  hover: {
                    x: "200%",
                    transition: { duration: 1, ease: "easeInOut" }
                  }
                }}
              />

              {/* Card content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                {/* Large Bold Typography for Value */}
                <h3 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3">
                  <span className={`bg-gradient-to-r ${stat.glowClass} bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                    <Counter value={stat.value} />
                  </span>
                </h3>

                {/* Secondary Text for Label */}
                <p className="text-sm font-medium tracking-wide text-[#CBD5E1] uppercase">
                  {stat.label}
                </p>
              </div>

              {/* Accent bottom bar border */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
