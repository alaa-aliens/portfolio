import imgImage4 from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { useMode } from "./ModeContext";
import { useState, useEffect } from "react";
import { AnimatePresence, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { StickerArt } from "./play/Stickers";
import { Link, useLocation, useNavigate } from "react-router";
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
              <motion.span
                aria-hidden
                className="inline-flex"
                animate={active ? { rotate: [0, -18, 14, -8, 0], scale: [1, 1.3, 1] } : { rotate: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                style={{ filter: active ? "none" : "grayscale(1) opacity(.55)" }}
              >
                <StickerArt kind={m === "professional" ? "tie" : "popper"} size={compact ? 20 : 24} />
              </motion.span>
              {m === "professional" ? "Professional" : "Fun"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type Item = { label: [string, string]; to: string; hash?: string };
const ITEMS: Item[] = [
  { label: ["Work", "Stuff"], to: "/work" },
  { label: ["About", "Me"], to: "/about" },
  { label: ["Skills", "Table"], to: "/skills" },
  { label: ["Experience", "Lore"], to: "/experience" },
  { label: ["Play", "Game"], to: "/play" },
  { label: ["Contact", "Say hi"], to: "/contact" },
];

/** Ala'a's doodle head: rolls as you scroll, and spins faster the faster you scroll. */
function RollingHead({ size }: { size: number }) {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const spin = useSpring(useTransform(v, [-3000, 0, 3000], [-25, 0, 25]), { stiffness: 120, damping: 14 });
  const roll = useTransform(scrollY, (y) => y / 6);
  const rotate = useTransform([roll, spin], ([r, s]: number[]) => r + s);
  return (
    <motion.div style={{ rotate, width: size, height: size * 1.2 }} className="relative overflow-hidden shrink-0">
      <img alt="" className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none" src={imgImage4} />
    </motion.div>
  );
}

export function Navbar() {
  const { mode, setMode, lang, setLang, isArabic, isProfessional } = useMode();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverItem, setHoverItem] = useState<number | null>(null);
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
  const activeIndex = ITEMS.findIndex((it) => pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to)));
  const arrowAt = hoverItem ?? (activeIndex >= 0 ? activeIndex : null);
  const compact = scrolled;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-4 md:px-8"
        animate={{ paddingTop: compact ? 10 : 18, paddingBottom: compact ? 10 : 14 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[#fdecd0]/90 backdrop-blur-md border-b-2 border-black"
          initial={false}
          animate={{ opacity: compact ? 1 : 0 }}
        />

        {/* Logo + stacked menu */}
        <div className="relative flex items-start gap-4 md:gap-7">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2"
            aria-label="Ala'a Ali, home"
          >
            <RollingHead size={compact ? 36 : 44} />
            <motion.span
              className="font-display text-[24px] md:text-[30px] text-black lowercase whitespace-nowrap overflow-hidden leading-none"
              initial={false}
              animate={{ width: compact ? 0 : "auto", opacity: compact ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              ala'a ali
            </motion.span>
          </Link>

          <AnimatePresence initial={false}>
            {!compact && !isArabic && (
              <motion.ul
                key="stack"
                className="hidden lg:flex flex-col pt-1"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onMouseLeave={() => setHoverItem(null)}
              >
                {ITEMS.map((it, i) => (
                  <li key={it.label[0]}>
                    <button
                      onClick={() => go(it)}
                      onMouseEnter={() => setHoverItem(i)}
                      className="relative flex items-center gap-2 font-['Work_Sans'] font-semibold uppercase tracking-[0.12em] text-[11.5px] leading-[1.55] text-black/80 hover:text-black"
                    >
                      {it.label[isProfessional ? 0 : 1]}
                      {arrowAt === i && (
                        <motion.span layoutId="nav-arrow" className="text-[#ff614c]" transition={{ type: "spring", stiffness: 500, damping: 30 }}>
                          →
                        </motion.span>
                      )}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Mode toggle */}
        <div className="relative hidden md:flex items-center rounded-full border-2 border-black/80 bg-[#fdecd0] p-[4px] w-[300px] lg:w-[340px]">
          <ModeToggle mode={mode} setMode={setMode} id="desktop" />
        </div>

        {/* Language + menu button */}
        <div className="relative flex items-center gap-3 md:gap-4 font-['IBM_Plex_Serif'] font-bold text-[16px] md:text-[18px] pt-1.5">
          <div className="flex items-center gap-1.5">
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
          <AnimatePresence initial={false}>
            {(compact || true) && (
              <motion.button
                key="menu"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-label="Open menu"
                className={`${compact ? "flex" : "flex lg:hidden"} items-center gap-2 bg-black text-white rounded-full pl-3.5 pr-3 py-1.5 font-['Work_Sans'] font-semibold text-[13px] uppercase tracking-[0.1em]`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                whileHover={{ rotate: -4, scale: 1.05 }}
              >
                Menu
                <span className="flex flex-col gap-[3px]" aria-hidden>
                  <span className="block w-3.5 h-[2px] bg-white rounded" />
                  <span className="block w-2.5 h-[2px] bg-white rounded" />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile mode toggle */}
      <div className="md:hidden fixed bottom-4 left-4 z-50 flex items-center rounded-full border-2 border-black bg-[#fdecd0] p-[4px] w-[220px] shadow-[3px_3px_0_0_black]">
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
                  className="w-11 h-11 rounded-full bg-[#fffaf1] text-black text-[18px] border-2 border-black shadow-[3px_3px_0_0_black] hover:rotate-90 transition-transform"
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
                      <span className="font-display lowercase text-[52px] md:text-[104px] leading-[0.95] transition-transform duration-300 group-hover:translate-x-3 group-hover:-rotate-2 group-hover:text-black">
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
              className="absolute right-[6%] bottom-[12%] w-[120px] md:w-[220px] h-[144px] md:h-[264px] overflow-hidden pointer-events-none"
              initial={{ y: 200, rotate: 20 }}
              animate={{ y: 0, rotate: [-6, 6, -6] }}
              transition={{ y: { delay: 0.3, type: "spring", stiffness: 140, damping: 14 }, rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
            >
              <img alt="" className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none" src={imgImage4} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
