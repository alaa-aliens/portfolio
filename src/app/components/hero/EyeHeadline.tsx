/*
 * Hero headline where every "o" is an eye that follows the cursor,
 * blinks now and then, and gets sleepy if you stop moving.
 */
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/* One shared pointer tracker + one animation loop for every eye on the page. */
const eyes = new Set<HTMLSpanElement>();
const pointer = { x: 0, y: 0, lastMove: 0, has: false };
let loopStarted = false;

function startLoop() {
  if (loopStarted || typeof window === "undefined") return;
  loopStarted = true;
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight;
  pointer.lastMove = performance.now();
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.lastMove = performance.now();
      pointer.has = true;
    },
    { passive: true },
  );
  const tick = () => {
    const idle = performance.now() - pointer.lastMove > 5000;
    eyes.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const max = r.width * 0.2;
      const k = Math.min(1, d / 160);
      const pupil = el.firstElementChild as HTMLElement;
      pupil.style.transform = `translate(calc(-50% + ${(dx / d) * max * k}px), calc(-50% + ${(dy / d) * max * k}px))`;
      el.dataset.sleepy = idle ? "1" : "0";
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function Eye({ delay }: { delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    startLoop();
    eyes.add(el);
    return () => {
      eyes.delete(el);
    };
  }, [reduce]);
  return (
    <motion.span
      aria-hidden
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 14, delay }}
      className="eye inline-block align-baseline"
    >
      <span ref={ref} className="eye-ball" data-sleepy="0">
        <span className="eye-pupil" />
        <span className="eye-lid" style={{ animationDelay: `${(delay * 7) % 4}s` }} />
      </span>
    </motion.span>
  );
}

export function EyeHeadline({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <h1 aria-label={text} className={className}>
      {words.map((word, wi) => (
        <span key={`${text}-${wi}`} aria-hidden className="inline-block whitespace-nowrap mr-[0.22em]">
          {word.split("").map((ch, ci) => {
            const delay = 0.2 + i++ * 0.035;
            if (ch === "o") return <Eye key={ci} delay={delay} />;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ opacity: 0, y: "0.5em", rotate: 10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 16, delay }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
