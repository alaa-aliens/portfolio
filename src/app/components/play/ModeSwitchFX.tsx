import { play } from "./sfx";
/*
 * What happens when you flip the mode:
 * Fun  → a burst of doodle confetti from the toggle.
 * Pro  → a little "ahem." card straightens its tie.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMode } from "../ModeContext";
import { StickerArt, type Kind } from "./Stickers";

const CONFETTI: Kind[] = ["star", "heart", "sparkle", "swirl", "bolt", "crown", "popper", "sun", "plane", "bubble", "mug", "pencil"];

export function ModeSwitchFX() {
  const { mode } = useMode();
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [burst, setBurst] = useState<{ id: number; mode: string } | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBurst({ id: Date.now(), mode });
    play(mode === "fun" ? "party" : "scribble", 0.45);
    const t = window.setTimeout(() => setBurst(null), 2800);
    return () => window.clearTimeout(t);
  }, [mode]);

  if (reduce) return null;
  return (
    <AnimatePresence>
      {burst?.mode === "fun" && (
        <motion.div key={burst.id} className="pointer-events-none fixed inset-0 z-[110] overflow-hidden" aria-hidden exit={{ opacity: 0 }}>
          {Array.from({ length: 34 + Math.floor(Math.random() * 14) }).map((_, i) => {
            const kind = CONFETTI[Math.floor(Math.random() * CONFETTI.length)];
            const wave = i % 3; // three bursts, slightly apart
            const fromX = window.innerWidth * (0.5 + (wave - 1) * 0.08 + (Math.random() - 0.5) * 0.06);
            const dir = Math.random() < 0.5 ? -1 : 1;
            const x = dir * (40 + Math.random() * window.innerWidth * 0.5);
            const peak = -(80 + Math.random() * 340);
            const spin = (Math.random() - 0.5) * (360 + Math.random() * 900);
            const size = 14 + Math.random() * 30;
            const dur = 1.3 + Math.random() * 1.1;
            const wobble = (Math.random() - 0.5) * 120;
            return (
              <motion.span
                key={i}
                className="absolute top-[60px]"
                style={{ left: fromX }}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                animate={{
                  x: [0, x * 0.6, x + wobble, x],
                  y: [0, peak, window.innerHeight * (0.55 + Math.random() * 0.4), window.innerHeight * 1.05],
                  scale: [0, 1.2, 1, 0.8],
                  rotate: [0, spin * 0.4, spin * 0.8, spin],
                  opacity: [1, 1, 1, 0.6],
                }}
                transition={{ duration: dur, delay: wave * 0.12 + Math.random() * 0.18, ease: [0.2, 0.6, 0.4, 1], times: [0, 0.28, 0.75, 1] }}
              >
                <StickerArt kind={kind} size={size} />
              </motion.span>
            );
          })}
        </motion.div>
      )}
      {burst?.mode === "professional" && (
        <motion.div
          key={burst.id}
          className="pointer-events-none fixed top-[84px] left-1/2 z-[110] -translate-x-1/2 flex items-center gap-2 bg-[#fffaf1] border border-black rounded-full pl-2 pr-4 py-1.5 shadow-[3px_3px_0_0_black]"
          initial={{ y: -30, opacity: 0, rotate: -6 }}
          animate={{ y: 0, opacity: 1, rotate: [6, -4, 0] }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          aria-hidden
        >
          <motion.span animate={{ rotate: [0, -20, 10, 0] }} transition={{ delay: 0.2, duration: 0.6 }}>
            <StickerArt kind="tie" size={26} />
          </motion.span>
          <span className="font-['Shantell_Sans',cursive] text-[15px]">ahem. professional mode.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
