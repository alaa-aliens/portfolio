import imgHeadCut from "../../assets/head.webp";
import { stories } from "../blog/posts";
import imgImage4 from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { ScoreHUD } from "./play/Score";
import { HeadBadge } from "./play/HeadBadge";
import { useMode } from "./ModeContext";
import { useState, useEffect } from "react";
import { AnimatePresence, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";

type Mode = "professional" | "fun";

/** Professional / Fun switch: his original pill, the active word in its own font (serif for pro, marker for fun). */
function ModeToggle({ mode, setMode, id, compact = false }: { mode: Mode; setMode: (m: Mode) => void; id: string; compact?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Site mode" className="relative flex items-center w-full">
      {(["professional", "fun"] as Mode[]).map((m) => {
        const active = mode === m;
        const fun = m === "fun";
        return (
          <button
            key={m}
            role="radio"
            aria-checked={active}
            onClick={() => setMode(m)}
            className={`relative flex-1 rounded-full transition-colors duration-300 ${
              fun ? "font-display" : "font-['DM_Serif_Display']"
            } ${compact ? "py-2 px-3 text-[15px]" : "py-2 px-4 text-[17px] md:text-[19px]"} ${
              active ? (fun ? "text-[#ff614c]" : "text-black") : "text-[#979797] hover:text-black/70"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`mode-pill-${id}`}
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <motion.span
              className="relative z-10 inline-block"
              animate={active ? { rotate: fun ? [0, -6, 4, 0] : 0, scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              {fun ? "fun!" : "Professional"}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

const ITEMS: Item[] = [
  { label: ["Work", "Stuff"], to: "/work" },
  { label: ["About", "Me"], to: "/about" },
  { label: ["Skills", "Table"], to: "/skills" },
  { label: ["Experience", "Lore"], to: "/experience" },
  ...(stories.length ? [{ label: ["Blog", "Notes"], to: "/blog" }] : []),
  { label: ["Contact", "Say hi"], to: "/contact" },
];

/** Hand-drawn menu button: three wobbly lines that turn into a face on hover. */
function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-expanded={open}
      aria-label="Open menu"
      className="relative w-12 h-12 md:w-[52px] md:h-[52px] rounded-full border border-black bg-[#ff614c] shadow-[3px_3px_0_0_#1d1a17] flex items-center justify-center"
      whileHover={{ rotate: -8, scale: 1.06 }}
      whileTap={{ scale: 0.94, rotate: 8 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#1d1a17" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        {/* top line → eyes */}
        <motion.path animate={{ d: hover ? "M9 10.5 C 9.3 10.2, 9.7 10.2, 10 10.5" : "M6 9.5 C 11 8.8, 18 9.9, 24 9.2" }} transition={{ duration: 0.25 }} />
        <motion.path animate={{ d: hover ? "M19.5 10.5 C 19.8 10.2, 20.2 10.2, 20.5 10.5" : "M7 15.4 C 13 15.9, 17 14.6, 23 15.3", opacity: 1 }} transition={{ duration: 0.25 }} />
        {/* bottom line → smile */}
        <motion.path animate={{ d: hover ? "M9 17.5 C 11.5 22.5, 18.5 22.5, 21 17.5" : "M8 21 C 12 20.3, 19 21.6, 22 20.8" }} transition={{ duration: 0.3 }} />
      </svg>
    </motion.button>
  );
}

/** Ala'a's doodle head: rolls as you scroll, and spins faster the faster you scroll. */
function RollingHead({ size }: { size: number }) {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const spin = useSpring(useTransform(v, [-3000, 0, 3000], [-25, 0, 25]), { stiffness: 120, damping: 14 });
  const roll = useTransform(scrollY, (y) => y / 6);
  const rotate = useTransform([roll, spin], ([r, s]: number[]) => r + s);
  return (
    <motion.div style={{ rotate, width: size, height: size * 1.2 }} className="relative overflow-hidden shrink-0">
      <img alt="" className="absolute inset-0 w-full h-full object-contain max-w-none" src={imgHeadCut} />
    </motion.div>
  );
}

export function Navbar() {
  const { mode, setMode, lang, setLang, isProfessional } = useMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (it: Item) => {
    setMenuOpen(false);
    navigate(it.hash ? `${it.to}#${it.hash}` : it.to);
  };
  const compact = scrolled;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8"
        animate={{ paddingTop: compact ? 10 : 18, paddingBottom: compact ? 10 : 14 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[#fdecd0]/90 backdrop-blur-md border-b border-black/60"
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
        />

        {/* Logo + stacked menu */}
        <div className="relative flex items-center">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2"
            aria-label="Ala'a Ali, home"
          >
            <RollingHead size={compact ? 40 : 64} />
            <motion.span
              className="font-display text-[24px] md:text-[30px] text-black lowercase whitespace-nowrap overflow-hidden leading-none"
              initial={false}
              animate={{ width: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              ala'a ali
            </motion.span>
          </Link>

        </div>

        {/* Mode toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex items-center rounded-full border border-black/80 bg-[#fdecd0] p-[4px] w-[300px] lg:w-[340px]">
          <ModeToggle mode={mode} setMode={setMode} id="desktop" />
        </div>

        {/* Score + language + menu button */}
        <div className="relative flex items-center gap-3 md:gap-5 font-['IBM_Plex_Serif'] font-bold text-[16px] md:text-[18px]">
          <ScoreHUD compact={compact} />
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => {
                setLang("en");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors ${lang === "en" ? "text-black" : "text-[#999]"}`}
            >
              En
            </button>
            <span className="text-[#c9b9a0]">|</span>
            <button
              onClick={() => {
                setLang("ar");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`transition-colors ${lang === "ar" ? "text-black" : "text-[#999]"}`}
            >
              Ar
            </button>
          </div>
          <MenuButton open={menuOpen} onClick={() => setMenuOpen(true)} />
        </div>
      </motion.nav>

      {/* Mobile mode toggle */}
      <div className="md:hidden fixed bottom-4 left-4 z-50 flex items-center rounded-full border border-black bg-[#fdecd0] p-[4px] w-[220px] shadow-[3px_3px_0_0_black]">
        <ModeToggle mode={mode} setMode={setMode} id="mobile" compact />
      </div>

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[95] bg-[#ff614c] text-[#fffaf1] overflow-y-auto"
            initial={{ clipPath: "circle(0% at calc(100% - 60px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 60px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 60px) 36px)" }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="min-h-full flex flex-col px-5 md:px-12 py-5 md:py-8">
              <div className="flex items-center justify-between">
                <span className="font-['Shantell_Sans',cursive] text-[15px] md:text-[17px] opacity-80">
                  {isProfessional ? "where to?" : "pick a door. any door."}
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 rounded-full bg-[#fffaf1] text-black text-[18px] border border-black shadow-[3px_3px_0_0_black] hover:rotate-90 transition-transform"
                >
                  ✕
                </button>
              </div>
              <ul className="flex-1 flex flex-col justify-center gap-1 md:gap-2 py-8">
                {ITEMS.map((it, i) => (
                  <motion.li
                    key={it.label[0]}
                    initial={{ y: 60, opacity: 0, rotate: 4 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 30, opacity: 0 }}
                    transition={{ delay: 0.18 + i * 0.06, type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <button onClick={() => go(it)} className="group flex items-baseline gap-4 md:gap-6 text-left">
                      <span className="font-['Work_Sans'] text-[13px] md:text-[15px] tabular-nums opacity-60">0{i + 1}</span>
                      <span className="font-display lowercase text-[56px] md:text-[110px] leading-[0.95] transition-transform duration-300 group-hover:translate-x-3 group-hover:-rotate-2 group-hover:text-black">
                        {it.label[isProfessional ? 0 : 1]}
                      </span>
                      <span className="font-display text-[36px] md:text-[64px] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-black">→</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center justify-between gap-4 font-['Work_Sans'] text-[14px] md:text-[15px]">
                <span className="select-all">alaa@alaa-ali.com</span>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/alaa_aliens" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">Instagram</a>
                  <a href="https://www.linkedin.com/in/alaa-aliens" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">LinkedIn</a>
                </div>
              </div>
            </div>
            <motion.div
              aria-hidden
              className="absolute right-[6%] bottom-[12%] pointer-events-none"
              initial={{ y: 200, rotate: 20 }}
              animate={{ y: 0, rotate: [-6, 6, -6] }}
              transition={{ y: { delay: 0.3, type: "spring", stiffness: 140, damping: 14 }, rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
            >
              <HeadBadge size={160} className="md:!w-[220px] md:!h-[220px] shadow-[4px_4px_0_0_#1d1a17]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
