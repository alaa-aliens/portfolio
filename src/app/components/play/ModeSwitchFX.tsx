/*
 * What happens when you flip the mode:
 * Fun  → a burst of doodle confetti from the toggle.
 * Pro  → a little "ahem." card straightens its tie.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMode } from "../ModeContext";
import { StickerArt, type Kind } from "./Stickers";

const CONFETTI: Kind[] = ["star", "heart", "sparkle", "swirl", "bolt", "crown", "popper", "star", "heart", "sparkle"];

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
    const t = window.setTimeout(() => setBurst(null), 1900);
    return () => window.clearTimeout(t);
  }, [mode]);

  if (reduce) return null;
  return (
    <AnimatePresence>
      {burst?.mode === "fun" && (
        <motion.div key={burst.id} className="pointer-events-none fixed inset-0 z-[110] overflow-hidden" aria-hidden exit={{ opacity: 0 }}>
          {Array.from({ length: 26 }).map((_, i) => {
            const kind = CONFETTI[i % CONFETTI.length];
            const x = (Math.random() - 0.5) * window.innerWidth * 0.9;
            const peak = -(120 + Math.random() * 260);
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-[60px]"
                initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                animate={{ x, y: [0, peak, window.innerHeight * 0.9], scale: [0, 1, 1], rotate: (Math.random() - 0.5) * 720 }}
                transition={{ duration: 1.6 + Math.random() * 0.4, ease: [0.2, 0.6, 0.4, 1], times: [0, 0.3, 1] }}
              >
                <StickerArt kind={kind} size={22 + Math.random() * 20} />
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
