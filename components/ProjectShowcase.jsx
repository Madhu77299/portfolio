"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import "./styles/ProjectShowcase.css";

const themeStyles = {
  cyan: "from-cyan-400 to-sky-500",
  purple: "from-purple-500 to-fuchsia-500",
  blue: "from-sky-400 to-indigo-500",
  violet: "from-violet-500 to-fuchsia-400",
  red: "from-red-500 to-rose-500"
};

export default function ProjectShowcase({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  
  // Touch swipe support
  const touchStartX = useRef(0);
  
  // Responsive variables
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResponsiveValues = useCallback((offset, width) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1200;

    let x = 0, z = 0, scale = 1, rotateY = 0, rotateZ = 0, opacity = 1, blur = 0;
    
    if (offset === 0) {
      x = 0; z = 0; scale = 1; rotateY = 0; opacity = 1; blur = 0;
    } else if (offset === -1) {
      x = isMobile ? -140 : isTablet ? -200 : -320;
      z = isMobile ? -60 : isTablet ? -80 : -100;
      scale = isMobile ? 0.82 : 0.88;
      rotateY = isMobile ? 5 : 10;
      opacity = 0.75;
      blur = isMobile ? 1 : 2;
    } else if (offset === 1) {
      x = isMobile ? 140 : isTablet ? 200 : 320;
      z = isMobile ? -60 : isTablet ? -80 : -100;
      scale = isMobile ? 0.82 : 0.88;
      rotateY = isMobile ? -5 : -10;
      opacity = 0.75;
      blur = isMobile ? 1 : 2;
    } else if (offset < -1) {
      x = isMobile ? -220 : isTablet ? -340 : -560;
      z = isMobile ? -120 : isTablet ? -160 : -220;
      scale = isMobile ? 0.7 : 0.75;
      rotateY = isMobile ? 8 : 16;
      rotateZ = -2;
      opacity = 0.35;
      blur = isMobile ? 2 : 4;
    } else if (offset > 1) {
      x = isMobile ? 220 : isTablet ? 340 : 560;
      z = isMobile ? -120 : isTablet ? -160 : -220;
      scale = isMobile ? 0.7 : 0.75;
      rotateY = isMobile ? -8 : -16;
      rotateZ = 2;
      opacity = 0.35;
      blur = isMobile ? 2 : 4;
    }
    
    return { x, z, scale, rotateY, rotateZ, opacity, blur, zIndex: 100 - Math.abs(offset) };
  }, []);

  const animateCards = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      
      let offset = i - activeIndex;
      const len = projects.length;
      const half = Math.floor(len / 2);
      
      // Calculate infinite wrap-around offset
      if (offset < -half) offset += len;
      else if (offset > half) offset -= len;
      
      // Edge case for even number of items
      if (len % 2 === 0 && offset === half) {
        offset = half; 
      }

      const { x, z, scale, rotateY, rotateZ, opacity, blur, zIndex } = getResponsiveValues(offset, windowWidth);
      
      gsap.to(card, {
        x,
        z: prefersReducedMotion ? 0 : z,
        scale,
        rotationY: prefersReducedMotion ? 0 : rotateY,
        rotationZ: prefersReducedMotion ? 0 : rotateZ,
        opacity,
        filter: prefersReducedMotion ? 'blur(0px)' : `blur(${blur}px)`,
        zIndex,
        duration: 3.0,
        ease: "none",
        onComplete: () => setIsAnimating(false)
      });
    });
  }, [activeIndex, projects.length, windowWidth, getResponsiveValues]);

  useEffect(() => {
    animateCards();
  }, [animateCards]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev + 1) % projects.length);
  }, [isAnimating, projects.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev - 1 + projects.length) % projects.length);
  }, [isAnimating, projects.length]);

  // Autoplay functionality (Continuous without timegap)
  useEffect(() => {
    if (isPaused || expandedProject) return;
    
    // Timeout matches the animation duration exactly. 
    // Linear easing removes the slow-down at the end, eliminating the visual gap.
    const timeout = setTimeout(() => {
      handleNext();
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [activeIndex, isPaused, expandedProject, handleNext]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto py-8 md:py-12 focus:outline-none" 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* View All Works Button */}
      <div className="absolute top-0 right-4 md:right-8 z-50">
        <a href="#projects" className="btn-glass-pill group flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300">
          View All Works
          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Main Carousel Area */}
      <div 
        ref={containerRef} 
        className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] mt-12 md:mt-16 flex justify-center items-center overflow-visible perspective-1200"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {projects.map((project, index) => (
          <div 
            key={project.title}
            ref={el => cardsRef.current[index] = el}
            className="absolute top-1/2 left-1/2 -mt-[225px] md:-mt-[275px] lg:-mt-[300px] -ml-[40vw] sm:-ml-[160px] md:-ml-[200px] lg:-ml-[230px] w-[80vw] sm:w-[320px] md:w-[400px] lg:w-[460px] h-[450px] md:h-[550px] lg:h-[600px] rounded-[1.5rem] md:rounded-[2rem] glass-card border border-white/10 overflow-hidden cursor-pointer flex flex-col showcase-card showcase-card-shadow transform-gpu"
            onClick={() => {
              if (isAnimating) return;
              if (index === activeIndex) {
                setExpandedProject(project);
                return;
              }
              
              // Find the shortest path to the clicked card
              const len = projects.length;
              let diff = index - activeIndex;
              if (diff > Math.floor(len/2)) diff -= len;
              if (diff < -Math.floor(len/2)) diff += len;
              
              if (diff === 1) handleNext();
              else if (diff === -1) handlePrev();
              else {
                // If it's further away, just jump directly for now to preserve smooth GSAP logic
                setIsAnimating(true);
                setActiveIndex(index);
              }
            }}
          >
            <div className="relative w-full h-[45%] md:h-[50%] overflow-hidden bg-slate-900/50">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${themeStyles[project.theme] || themeStyles.cyan}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white shadow-lg">
                  Showcase
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-5 md:p-8 flex flex-col justify-between relative z-10">
              <div>
                <h3 className="text-xl md:text-3xl font-extrabold mb-2 md:mb-3 tracking-tight text-white drop-shadow-md">{project.title}</h3>
                <p className="text-xs md:text-sm line-clamp-3 md:line-clamp-4 leading-relaxed font-light text-slate-300">
                  {project.description}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  {project.tags?.slice(0,3).map(tag => (
                    <span key={tag} className="text-[9px] md:text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-cyan-100">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  {project.demo && project.demo !== "#" && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-solid-pill text-[9px] md:text-[10px] py-2 md:py-2.5 px-0 w-full flex-1 uppercase tracking-widest font-bold text-center" onClick={e => e.stopPropagation()}>
                      Live App
                    </a>
                  )}
                  {project.github && project.github !== "#" && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-glass-pill text-[9px] md:text-[10px] py-2 md:py-2.5 px-0 w-full flex-1 uppercase tracking-widest font-bold text-white text-center border-white/20 hover:border-white/40" onClick={e => e.stopPropagation()}>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          aria-label="Previous project"
          className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-cyan-400/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          aria-label="Next project"
          className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-cyan-400/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Expanded Project Modal */}
      {expandedProject && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setExpandedProject(null)}
        >
          <div 
            className="relative w-full max-w-5xl h-auto max-h-[90vh] md:h-[70vh] glass-card rounded-[2rem] border border-white/20 shadow-2xl flex flex-col md:flex-row overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10"
              onClick={() => setExpandedProject(null)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="w-full md:w-1/2 h-[250px] md:h-[400px] lg:h-full relative shrink-0 overflow-hidden bg-[#07111F]/80 flex items-center justify-center p-4 md:p-8">
              {/* Soft themed glow behind the image */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px] opacity-30 pointer-events-none bg-gradient-to-br ${themeStyles[expandedProject.theme] || themeStyles.cyan}`} />
              
              {expandedProject.image ? (
                <img src={expandedProject.image} alt={expandedProject.title} className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10" />
              ) : (
                <div className={`w-full h-full relative z-10 rounded-xl bg-gradient-to-br ${themeStyles[expandedProject.theme] || themeStyles.cyan}`} />
              )}
              {/* Subtle gradient to blend into content on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] to-transparent md:hidden opacity-80 pointer-events-none z-20" />
            </div>
            
            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col overflow-y-auto relative z-10 bg-[#07111F]/80 md:bg-transparent custom-scrollbar">
              <div className="my-auto">
                <span className="px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 rounded-full w-fit mb-4 md:mb-6 inline-block">
                  Project Showcase
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg">{expandedProject.title}</h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-6 md:mb-8 font-light">
                  {expandedProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                  {expandedProject.tags?.map(tag => (
                    <span key={tag} className="text-[10px] md:text-xs uppercase tracking-wider px-2.5 md:px-3 py-1 md:py-1.5 rounded-md bg-white/5 border border-white/10 text-cyan-100 shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 md:gap-4">
                  {expandedProject.demo && expandedProject.demo !== "#" && (
                    <a href={expandedProject.demo} target="_blank" rel="noopener noreferrer" className="btn-solid-pill text-[10px] md:text-xs py-2.5 md:py-3 px-4 md:px-6 uppercase tracking-widest font-bold flex-1 text-center shadow-lg hover:shadow-cyan-500/25 transition-all">
                      Launch App
                    </a>
                  )}
                  {expandedProject.github && expandedProject.github !== "#" && (
                    <a href={expandedProject.github} target="_blank" rel="noopener noreferrer" className="btn-glass-pill text-[10px] md:text-xs py-2.5 md:py-3 px-4 md:px-6 uppercase tracking-widest font-bold text-white flex-1 text-center border-white/20 hover:bg-white/10 transition-all">
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
