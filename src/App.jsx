import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import FloatingCursor from "@/components/FloatingCursor";
import SectionHeader from "@/components/SectionHeader";
import TechStackShowcase from "@/components/TechStackShowcase";
import InteractiveSkills from "@/components/InteractiveSkills";
import ProjectsDeck from "@/components/ProjectsDeck";
import TimelineItem from "@/components/TimelineItem";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import AchievementStats, { Counter } from "@/components/AchievementStats";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import DeveloperIDCard from "@/components/DeveloperIDCard";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" }
];

const skillItems = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Building modern component-based front-end applications with polished user experience and smooth motion.",
    tags: ["React", "Angular", "Tailwind", "GSAP"]
  },
  {
    id: "backend",
    title: "Backend",
    description: "Designing scalable server-side APIs, real-time endpoints, and secure backend services.",
    tags: ["Node.js", "Express", "Djnago", "REST", "APIs"]
  },
  {
    id: "databases",
    title: "Databases",
    description: "Modeling data, optimizing queries, and making data flow reliably across applications.",
    tags: ["MySQL", "SQLite", "MongoDB"]

  },
  {
    id: "tools",
    title: "Tools",
    description: "Using the right toolchain for automation, deployment, collaboration, and faster development cycles.",
    tags: ["Git", "VS Code", "Docker"]
  },
  {
    id: "languages",
    title: "Languages",
    description: "Writing clean, maintainable code in JavaScript, Python, Java, and other modern languages.",
    tags: ["JavaScript", "Python", "Java", "SQL"]
  }
];

const projectItems = [
  {
    title: "Project Vault",
    description:
      "A centralized web platform that stores student projects completed throughout their academic journey, including mini and major projects. It enables students to explore previous projects for reference, gain insights from past work, and build more advanced and innovative solutions.",
    tags: ["React", "Node.js", "MySQL", "Web App"],
    theme: "cyan",
    image: "/images/project_vault.png",
    github: "https://github.com/Madhu77299",
    demo: "#"
  },
  {
    title: "Jeevan Gyaan",
    description:
      "An AI-enhanced educational platform that bridges the gap between classroom learning and real-world awareness. Through interactive lessons, personalized guidance, AI-generated stories, and intelligent chat assistance, it empowers students to develop life skills, digital citizenship, civic awareness, and responsible decision-making.",
    tags: ["React", "Express.js", "MongoDB", "FastAPI", "AI"],
    theme: "violet",
    image: "/images/jeevan_gyaan.png",
    github: "https://github.com/Madhu77299",
    demo: "#"
  },
  {
    title: "Blood Bank Management System",
    description:
      "A role-based web application designed to streamline blood bank operations by managing donor, receiver, and blood inventory data. The system enables administrators to monitor blood reserves, track donations and requests, and ensure efficient blood allocation while maintaining accurate records and secure user authentication.",
    tags: ["Python", "Django", "MySQL"],
    theme: "red",
    image: "/images/blood_bank.png",
    github: "https://github.com/Madhu77299",
    demo: "#"
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end center"]
  });
  const lineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [loading]);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const position = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? position / height : 0);

      const sectionEntries = sections.map((section) => {
        const el = document.getElementById(section.id);
        return {
          id: section.id,
          top: el ? el.getBoundingClientRect().top : Infinity
        };
      });

      const current = sectionEntries.reduce((closest, entry) => {
        return Math.abs(entry.top) < Math.abs(closest.top) ? entry : closest;
      }, sectionEntries[0]);

      setActiveSection(current.id);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <main className="relative min-h-screen overflow-hidden bg-slate-950/20">
        {/* Animated Cyber Gradient Mesh & Aurora Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none animate-blob z-0" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none animate-blob animation-delay-2000 z-0" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[110px] pointer-events-none animate-blob animation-delay-4000 z-0" />

        <FloatingCursor />
        
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block">
          <div className="scroll-indicator">
            <span style={{ transform: `scaleY(${scrollProgress})` }} />
          </div>
        </div>

        <Navbar items={sections} activeSection={activeSection} />

        <section 
          id="home" 
          className="relative min-h-screen px-6 pb-24 pt-32 lg:px-16 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* LAYER 1: Deep blue gradient & digital grid background (inherited from body / section) */}
          
          {/* LAYER 2: Ambient glow effects behind portrait */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full pointer-events-none z-0">
            <div 
              className="portrait-aura portrait-aura-cyan w-[300px] h-[300px] md:w-[450px] md:h-[450px] absolute top-[10%] right-[5%]"
              style={{
                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1)`,
              }}
            />
            <div 
              className="portrait-aura portrait-aura-purple w-[250px] h-[250px] md:w-[380px] md:h-[380px] absolute bottom-[10%] right-[15%]"
              style={{
                transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * -25}px) scale(0.95)`,
              }}
            />
            <div 
              className="portrait-aura portrait-aura-blue w-[320px] h-[320px] md:w-[480px] md:h-[480px] absolute top-[20%] right-[10%]"
              style={{
                transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px) scale(1.05)`,
              }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl w-full z-10 overflow-visible px-4">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center overflow-visible"
            >
              {/* LAYER 4: Hero text content (Left side) */}
              <div className="space-y-6 text-left flex flex-col justify-center relative z-20">
                {/* Small Badge */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase tracking-[0.2em] w-fit shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  FULL STACK SYSTEMS & SAFETY DEVELOPER
                </motion.div>

                {/* Large Heading */}
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white tracking-tight"
                >
                  Voonna<br />
                  <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.45)]">Madhusudhana</span><br />
                  Rao
                </motion.h1>

                {/* Description */}
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="text-slate-300/95 text-base sm:text-lg leading-relaxed max-w-lg font-light tracking-wide"
                >
                  Crafting reliable software interfaces, vehicle safety systems, and modern web applications. Passionate about building intelligent solutions with scalable technologies.
                </motion.p>

                {/* Two CTA Buttons */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <motion.a 
                    href="#projects" 
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="btn-solid-pill btn-reflection-container btn-reflection-sweep text-xs uppercase tracking-[0.14em] flex items-center justify-center cursor-pointer"
                    style={{
                      boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)",
                      background: "linear-gradient(135deg, #ffffff 0%, #e2f8ff 100%)",
                      color: "#07111F"
                    }}
                  >
                    View Projects
                  </motion.a>
                  <motion.a 
                    href="#contact" 
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="btn-glass-pill btn-reflection-container btn-reflection-sweep text-xs uppercase tracking-[0.14em] flex items-center justify-center cursor-pointer"
                  >
                    Contact Me
                  </motion.a>
                </motion.div>

                {/* Achievement Statistics */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: { opacity: 1, y: 0, transition: { delay: 0.4 } }
                  }}
                  className="grid grid-cols-2 gap-6 pt-8 mt-4 border-t border-white/10"
                >
                  {[
                    { value: "10+", label: "Projects Built", colorClass: "from-cyan-400 to-blue-500" },
                    { value: "4+", label: "Certifications", colorClass: "from-purple-400 to-indigo-500" },
                    { value: "15+", label: "Technologies", colorClass: "from-pink-400 to-rose-500" },
                    { value: "50+", label: "LeetCode Streak", colorClass: "from-emerald-400 to-teal-500" }
                  ].map((stat, index) => (
                    <div key={index} className="flex flex-col">
                      <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                        <span className={`bg-gradient-to-r ${stat.colorClass} bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]`}>
                          <Counter value={stat.value} />
                        </span>
                      </span>
                      <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase mt-1">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* LAYER 3: Interactive Developer ID Card (Right side) */}
              <div className="relative w-full flex items-center justify-center mt-12 lg:mt-0 overflow-visible z-20">
                <DeveloperIDCard />
              </div>
            </motion.div>
          </div>

          {/* LAYER 5: Floating UI Accents & Down Arrow indicator */}
          <div className="absolute right-6 bottom-6 lg:right-16 z-30">
            <a
              href="#about"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:bg-white/10 hover:scale-105 hover:border-cyan-400/30"
            >
              <span className="text-lg">↓</span>
            </a>
          </div>
        </section>

      {/* Neon Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-[0.5px] max-w-6xl mx-auto opacity-80" />

      <section id="about" className="relative px-6 pb-24 pt-32 lg:px-16 overflow-hidden">
        {/* Luminous light blobs for refraction backdrop */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/15 blur-[110px] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_0.8fr]"
        >
          <div className="glass-card p-8 lg:p-10 rounded-[2rem]">
            <p className="mb-6 max-w-xl text-lg leading-8 text-slate-200/90">
              I am a developer passionate about building automatic vehicle safety systems and sensor-driven
              cloud applications. I blend modern software architecture with hardware awareness to craft solutions
              that feel intelligent and intuitive.
            </p>
            <ul className="space-y-4 text-slate-300/80">
              <li>• Project Vault</li>
              <li>• Blood Bank Management System</li>
              <li>• Jeevan Gyan</li>
              <li>• Innovative product design with an entrepreneurial mindset</li>
            </ul>
          </div>

          <div className="grid gap-4">
            {[
              { label: "Innovation", value: "Design thinking & execution" }
            ].map((item) => (
              <div key={item.label} className="glass-card p-6 rounded-[2rem]">
                <h3 className="mb-3 text-lg font-semibold text-slate-100">{item.label}</h3>
                <p className="text-slate-300/80">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Neon Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-[0.5px] max-w-6xl mx-auto opacity-80" />

      <section id="skills" className="relative px-6 pb-0 pt-32 lg:px-16 overflow-hidden">
        {/* Bright spots for skills canvas container refraction */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/12 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/12 blur-[130px] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <InteractiveSkills />
          <TechStackShowcase />
        </motion.div>
      </section>

      {/* Neon Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-[0.5px] max-w-6xl mx-auto opacity-80" />

      <section id="projects" className="relative px-6 pb-24 pt-32 lg:px-16 overflow-hidden">
        {/* Luminous light blobs for projects card refraction */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-500/12 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/12 blur-[110px] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <SectionHeader title="Featured Projects" />
          <ProjectsDeck projects={projectItems} />
        </motion.div>
      </section>

      {/* Neon Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-[0.5px] max-w-6xl mx-auto opacity-80" />

      <section id="timeline" className="relative px-6 pb-24 pt-32 lg:px-16 overflow-hidden">
        {/* Refraction backdrop glows for timeline cards */}
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

        {/* Floating Particles in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                }}
                animate={{
                  y: [0, -120, 0],
                  x: [0, 40, 0],
                  opacity: [0.15, 0.5, 0.15],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10">
          <SectionHeader title="Education Journey" />

          <div ref={timelineRef} className="mx-auto relative max-w-4xl font-sans">
            {/* Guide Line Track (starts at first node dot, ends at last node dot) */}
            <div className="absolute left-4 md:left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-white/10">
              {/* Animated drawing guide line */}
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute inset-0 w-full bg-gradient-to-b from-cyan-400 via-purple-500 to-fuchsia-500 origin-top z-10"
              />

              {/* Traveling glowing ball */}
              <motion.div
                style={{ top: lineY }}
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(34, 211, 238, 0.6)",
                    "0 0 25px rgba(34, 211, 238, 0.95)",
                    "0 0 10px rgba(34, 211, 238, 0.6)"
                  ]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 z-20 border border-white/20"
              />
            </div>

            <div className="space-y-10">
              <TimelineItem
                title="School"
                subtitle="Abhyudaya High School, Bobbili"
                period="2009 - 2021"
                details="Foundations in science, technology exploration, and early academic achievements."
                index={0}
              />
              <TimelineItem
                title="Intermediate"
                subtitle="Sri Chaitanya, Rajam"
                period="2021 - 2023"
                details="Advanced pre-university education focusing on mathematics, physics, and chemistry."
                index={1}
              />
              <TimelineItem
                title="B.Tech (Information Technology)"
                subtitle="Current Year: 2nd Year"
                period="2023 - Present"
                details="Specializing in Information Technology, engineering intelligent software interfaces, and full stack product architectures."
                index={2}
              />
              <TimelineItem
                title="Future Goal"
                subtitle="Software Engineer & Entrepreneur"
                period="Aspiration"
                details="Aiming to develop bleeding-edge software systems, lead technical teams, and pioneer modern tech startups."
                index={3}
                isFuture={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Neon Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-[0.5px] max-w-6xl mx-auto opacity-80" />

      <section id="contact" className="relative px-6 pb-24 pt-32 lg:px-16 overflow-hidden">
        {/* Luminous light blobs for contact card refraction */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] rounded-full bg-purple-500/15 blur-[120px] pointer-events-none z-0" />

        <SectionHeader title="Connect With Me" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_0.8fr]"
        >
          <div className="glass-card p-8 lg:p-10 rounded-[2rem]">
            <h2 className="mb-4 text-2xl font-semibold text-white">Reach Out</h2>
            <p className="mb-8 text-slate-300/90">
              Send a message or connect on social media for collaboration, mentorship, or project work.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="mailto:voonnamadhusudhanarao@gmail.com"
                className="btn-glass-pill group flex items-center justify-start gap-3.5 px-6 py-3.5 text-sm font-semibold text-slate-200"
              >
                <span className="text-xl">✉</span>
                <span className="text-slate-300 group-hover:text-cyan-300 transition">Email Me</span>
              </a>

              <a
                href="https://www.linkedin.com/in/madhu-sudhana-rao-voonna-42125b28a/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass-pill group flex items-center justify-start gap-3.5 px-6 py-3.5 text-sm font-semibold text-slate-200"
              >
                <span className="text-xl">💼</span>
                <span className="text-slate-300 group-hover:text-cyan-300 transition">LinkedIn Profile</span>
              </a>

              <a
                href="https://github.com/Madhu77299"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass-pill group flex items-center justify-start gap-3.5 px-6 py-3.5 text-sm font-semibold text-slate-200"
              >
                <span className="text-xl">🐙</span>
                <span className="text-slate-300 group-hover:text-cyan-300 transition">GitHub Profile</span>
              </a>

              <a
                href="tel:+917729963937"
                className="btn-glass-pill group flex items-center justify-start gap-3.5 px-6 py-3.5 text-sm font-semibold text-slate-200"
              >
                <span className="text-xl">📞</span>
                <span className="text-slate-300 group-hover:text-cyan-300 transition">Phone Call</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </motion.div>
      </section>

      <Footer />
    </main>
  </>
  );
}
