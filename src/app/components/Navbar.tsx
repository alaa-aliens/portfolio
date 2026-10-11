import imgImage4 from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { useMode } from "./ModeContext";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion } from "motion/react";

type Mode = "professional" | "fun";

/** Professional / Fun switch with a pill that slides between the two. */
function ModeToggle({ mode, setMode, id, compact = false }: { mode: Mode; setMode: (m: Mode) => void; id: string; compact?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Site mode" className="relative flex items-center w-full">
      {(["professional", "fun"] as Mode[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            role="radio"
            aria-checked={active}
            onClick={() => setMode(m)}
            className={`relative flex-1 rounded-full font-['DM_Serif_Display'] transition-colors duration-300 ${
              compact ? "py-2 px-3 text-[15px]" : "py-2 px-4 text-[17px] md:text-[19px]"
            } ${active ? "text-black" : "text-[#979797] hover:text-black/70"}`}
          >
            {active && (
              <motion.span
                layoutId={`mode-pill-${id}`}
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {m === "professional" ? "Professional" : (
                <>
                  Fun
                  <motion.span
                    aria-hidden
                    animate={active ? { rotate: [0, -15, 15, -10, 0], scale: [1, 1.25, 1] } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block"
                  >
                    {active ? "🤪" : ""}
                  </motion.span>
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const { mode, setMode, lang, setLang, isArabic } = useMode();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#fdecd0] flex items-center justify-between px-6 md:px-10 h-[80px] md:h-[100px] transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : ""}`}>
      {/* Logo */}
      <Link
        to="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group flex items-center gap-3 cursor-pointer"
        aria-label="Ala'a Ali — home"
      >
        <div className="w-10 h-12 relative overflow-hidden shrink-0 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
          <img
            alt="Logo"
            className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none"
            src={imgImage4}
          />
        </div>
        <span className="font-['IBM_Plex_Serif'] font-bold text-[22px] md:text-[28px] text-black">
          Ala'a Ali
        </span>
      </Link>

      {/* Toggle */}
      <div className="hidden md:flex items-center rounded-full border border-[#c9b9a0] p-[6px] w-[340px] md:w-[400px]">
        <ModeToggle mode={mode} setMode={setMode} id="desktop" />
      </div>

      {/* Work link + Language */}
      <div className="flex items-center gap-2 font-['IBM_Plex_Serif'] font-bold text-[18px] md:text-[20px]">
        <NavLink
          to="/work"
          className={({ isActive }) =>
            `mr-3 md:mr-6 relative transition-colors ${isActive || pathname.startsWith("/work") ? "text-[#ff614c]" : "text-black hover:text-[#ff614c]"}`
          }
        >
          Work
        </NavLink>
        <button
          onClick={() => {
            setLang("en");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`cursor-pointer transition-colors ${lang === "en" ? "text-black" : "text-[#999]"}`}
        >
          En
        </button>
        <span className="text-[#c9b9a0]">|</span>
        <button
          onClick={() => {
            setLang("ar");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`cursor-pointer transition-colors ${lang === "ar" ? "text-black" : "text-[#999]"}`}
        >
          Ar
        </button>
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center rounded-full border border-[#c9b9a0] bg-[#fdecd0] p-[5px] w-[260px] shadow-lg">
        <ModeToggle mode={mode} setMode={setMode} id="mobile" compact />
      </div>
    </nav>
  );
}