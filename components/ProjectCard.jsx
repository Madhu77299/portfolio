"use client";

import { motion } from "framer-motion";
import "./styles/ProjectCard.css";

const themeStyles = {
  cyan: "from-cyan-400 to-sky-500",
  purple: "from-purple-500 to-fuchsia-500",
  blue: "from-sky-400 to-indigo-500",
  violet: "from-violet-500 to-fuchsia-400",
  red: "from-red-500 to-rose-500"
};

export default function ProjectCard({ 
  title, 
  description, 
  tags, 
  theme, 
  index, 
  className = "", 
  style = {}, 
  animate = null, 
  initial = null, 
  transition = null, 
  whileHover = null,
  isFeatured = false,
  isMini = false,
  image = "",
  github = "#",
  demo = "#"
}) {
  const gradient = themeStyles[theme] || themeStyles.cyan;

  const animProps = animate 
    ? { animate, initial, transition, whileHover } 
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.35, ease: "easeOut", delay: index * 0.05 }
      };

  if (isMini) {
    return (
      <motion.article
        {...animProps}
        style={style}
        className={`project-card glass-card project-card-wrapper mini-project-card ${className}`}
      >
        <div className="mini-card-text">
          <span className="mini-card-badge">Showcase</span>
          <h3 className="mini-card-title">{title}</h3>
          <p className="mini-card-desc">{description}</p>
        </div>
        <div className="mini-card-tags">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="project-tag text-[9px] px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </motion.article>
    );
  }

  if (isFeatured) {
    return (
      <motion.article
        {...animProps}
        style={style}
        className={`project-card glass-card project-card-wrapper featured-project-card ${className}`}
      >
        {image && (
          <div className="featured-card-image-container">
            <img src={image} alt={title} className="featured-card-image" />
            <div className="featured-card-image-overlay" />
          </div>
        )}
        <div className="featured-card-header">
          <div className="featured-card-meta">
            <span className="featured-card-badge">Featured Project</span>
            <div className="featured-card-tags">
              {tags.map((tag) => (
                <span key={tag} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="featured-card-content">
            <h3 className="featured-card-title">{title}</h3>
            <p className="featured-card-desc">{description}</p>
          </div>
        </div>
        <div className="featured-card-actions">
          <a href={github} target="_blank" rel="noopener noreferrer" className="btn-glass-pill text-xs uppercase tracking-wider text-white">
            GitHub Repo
          </a>
          <a href={demo} className="btn-solid-pill text-xs uppercase tracking-wider">
            Launch Live App
          </a>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      {...animProps}
      style={style}
      className={`project-card glass-card project-card-wrapper ${className}`}
    >
      <div className="project-card-hero">
        {image ? (
          <div className="project-card-image-bg">
            <img src={image} alt={title} className="card-bg-img" />
            <div className="card-bg-overlay" />
          </div>
        ) : (
          <div className={`project-card-glow bg-gradient-to-br ${gradient}`} />
        )}
        <div className="project-card-decor-left" />
        <div className="project-card-decor-right" />
        <div className="project-card-hero-content">
          <span className="project-card-badge">Showcase</span>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="project-card-body">
        <p className="text-sm leading-6 text-slate-300 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
          <a href={github} target="_blank" rel="noopener noreferrer" className="btn-glass-pill text-[10px] py-1.5 px-4 font-bold uppercase tracking-[0.1em] text-white">
            GitHub
          </a>
          <a href={demo} className="btn-solid-pill text-[10px] py-1.5 px-4 font-bold uppercase tracking-[0.1em]">
            Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
}
