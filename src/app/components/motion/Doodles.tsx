/*
 * Small motion building blocks that make the site feel hand-drawn.
 * All of them respect "reduce motion" through the <MotionConfig reducedMotion="user"> in App.
 */
import React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades + lifts children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </M>
  );
}

/** Reveals a drawing left-to-right, like a pen stroke passing over it.
 *  The unclipped outer box is what watches the viewport (a fully clipped element never "intersects"). */
export function PenWipe({
  children,
  delay = 0,
  duration = 0.9,
  className,
  direction = "right",
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "right" | "up";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const hidden = direction === "right" ? "inset(-10% 100% -10% -10%)" : "inset(100% -10% -10% -10%)";
  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ clipPath: hidden, rotate: -2 }}
        animate={inView ? { clipPath: "inset(-10% -10% -10% -10%)", rotate: 0 } : undefined}
        transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** A wobbly marker underline that draws itself under a heading. */
export function ScribbleUnderline({
  color = "#ff614c",
  width = 160,
  delay = 0.2,
  className = "",
}: {
  color?: string;
  width?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <svg
      className={`block overflow-visible ${className}`}
      width={width}
      height={14}
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M3 9.5C34 4 63 3.5 96 6.8 128 10 158 11 190 6.5 207 4.2 222 4 237 5.5"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease }}
      />
    </svg>
  );
}

/** Section heading with the self-drawing underline. */
export function SectionTitle({
  children,
  className = "",
  color,
  as = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  as?: "h1" | "h2";
}) {
  const H = as;
  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <Reveal y={16}>
        <H className="font-['Playfair_Display'] font-bold text-black text-[30px] md:text-[42px] leading-tight">
          {children}
        </H>
      </Reveal>
      <ScribbleUnderline color={color} width={120} />
    </div>
  );
}

/** Little doodles (star, swirl, sparkle, arrow) that draw themselves. Pure decoration. */
const doodlePaths = {
  star: "M20 4 L24 15 L36 15 L26.5 22 L30 34 L20 27 L10 34 L13.5 22 L4 15 L16 15 Z",
  swirl: "M6 30 C 2 18, 14 6, 26 10 C 36 14, 32 28, 22 26 C 14 24, 18 14, 26 16",
  sparkle: "M20 2 V14 M20 26 V38 M2 20 H14 M26 20 H38 M8 8 L14 14 M26 26 L32 32 M32 8 L26 14 M14 26 L8 32",
  zigzag: "M2 30 L10 10 L18 30 L26 10 L34 30",
  heart: "M20 34 C 4 22, 4 8, 14 8 C 18 8, 20 12, 20 14 C 20 12, 22 8, 26 8 C 36 8, 36 22, 20 34 Z",
  arrow: "M4 30 C 14 10, 24 8, 34 10 M26 4 L35 10 L28 18",
};

export function Doodle({
  kind,
  className = "",
  color = "#ff614c",
  delay = 0,
  float = true,
  size = 40,
}: {
  kind: keyof typeof doodlePaths;
  className?: string;
  color?: string;
  delay?: number;
  float?: boolean;
  size?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      animate={float && !reduce ? { y: [0, -6, 0], rotate: [0, 4, 0] } : undefined}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        d={doodlePaths[kind]}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.6 + delay, ease }}
      />
    </motion.svg>
  );
}

/** Counts a number up when it scrolls into view. */
export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [val, setVal] = React.useState(0);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, reduce]);
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}
