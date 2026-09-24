import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/Navbar.css";

export default function Navbar({ items, activeSection }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          VMSR
        </a>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="navbar-link"
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="navbar-active-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`navbar-link-text ${isActive ? "active" : ""}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <a
            href="#contact"
            className="btn-solid-pill text-[10px] sm:text-xs py-1.5 px-3 sm:px-5 font-bold uppercase tracking-[0.12em] hidden sm:inline-flex"
          >
            Contact
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md transition-all md:hidden flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl rounded-b-3xl px-6 py-4"
          >
            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 btn-solid-pill w-full text-center text-xs py-2.5 font-bold uppercase tracking-widest"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

