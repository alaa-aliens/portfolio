import imgHeadCut from "../../../assets/head.webp";
/*
 * Ala'a as the tour guide: a little doodle of his head in the corner that
 * comments on whichever section you're looking at. Tap him to hear it again.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";
import { useMode } from "../ModeContext";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

type Lines = Record<string, [pro: string, fun: string]>;

const HOME: Lines = {
  hero: ["Hi! I'm your tour guide. Also the designer.", "I'm the tour guide. Unpaid. Please hire me."],
  about: ["Yes, I really started by stitching couches.", "Couches → pixels. Don't ask."],
  services: ["Four things I'm good at. Coffee isn't listed.", "Drawing at 2am counts as a skill."],
  skills: ["Drag them around. Gently, they're my skills.", "Throw them. I've survived worse critiques."],
  projects: ["Siba is the newest. I built it for my kids.", "Open a folder. I dare you."],
  experience: ["Try the tabs. There's a podcast in there.", "Yes, the PlayStation years count."],
};
const WORK: Lines = {
  top: ["Black tag = full case study. The rest, just ask.", "The untagged ones are stuck in my drafts."],
};
const CASE: Lines = {
  top: ["Scroll down, there's a before & after.", "Spoiler: it has a happy ending."],
};

export function TourGuide() {
  const { isProfessional, mode } = useMode();
  const { pathname } = useLocation();
  const [section, setSection] = useState("hero");
  const [bubble, setBubble] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timer = useRef<number>();

  const lines = pathname === "/" ? HOME : pathname === "/work" ? WORK : CASE;
  const key = pathname === "/" ? section : "top";
  const line = lines[key]?.[isProfessional ? 0 : 1];

  const say = (ms = 4800) => {
    setBubble(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBubble(false), ms);
  };

  // Which section is in the middle of the screen? Hide when the footer shows up.
  useEffect(() => {
    let io: IntersectionObserver | undefined;
    let footerIo: IntersectionObserver | undefined;
    const t = window.setTimeout(() => {
      const ids = Object.keys(HOME);
      const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setSection(e.target.id)),
        { rootMargin: "-45% 0px -50% 0px" },
      );
      els.forEach((el) => io!.observe(el));
      const footer = document.getElementById("contact");
      if (footer) {
        footerIo = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.05 });
        footerIo.observe(footer);
      }
    }, 400);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
      footerIo?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (dismissed || hidden) return;
    if (!window.matchMedia("(min-width: 1180px)").matches) return; // on smaller screens, only talk when tapped
    const t = window.setTimeout(() => say(), 500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, pathname, mode, hidden, dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 140 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="fixed z-[75] right-3 md:right-6 bottom-3 md:bottom-4 flex items-end gap-2"
        >
          <AnimatePresence>
            {bubble && line && (
              <motion.div
                key={line}
                initial={{ opacity: 0, scale: 0.6, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 10 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative mb-12 md:mb-14 max-w-[210px] md:max-w-[250px] origin-bottom-right bg-white border border-black rounded-[16px] rounded-br-[4px] px-3 py-2 shadow-[3px_3px_0_0_black] font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] leading-snug text-black"
              >
                {line}
                <button
                  onClick={() => setDismissed(true)}
                  aria-label="Hide the tour guide"
                  className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-black text-white text-[11px] leading-none"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => (bubble ? setBubble(false) : say())}
            aria-label="Tour guide: tap to hear what Ala'a says about this section"
            className="relative w-[58px] h-[70px] md:w-[78px] md:h-[94px] shrink-0"
            animate={{ y: [0, -5, 0], rotate: bubble ? [-4, 4, -4] : 0 }}
            transition={{ y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.8, repeat: bubble ? Infinity : 0 } }}
            whileHover={{ scale: 1.08 }}
          >
            <span aria-hidden className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-2 rounded-full bg-black/15 blur-[1px]" />
            <span className="absolute inset-0 overflow-hidden">
              <img alt="" src={imgHeadCut} className="absolute inset-0 w-full h-full object-contain max-w-none" />
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
