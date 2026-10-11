import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** A simple phone frame around a screenshot. */
export function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative rounded-[15%/7%] bg-[#1d1a17] p-[2.8%] shadow-[0_24px_50px_-20px_rgba(60,35,10,0.45)] ${className}`}
    >
      {/* sizes are proportional so small phones keep the same shape */}
      <div className="absolute top-[2.4%] left-1/2 -translate-x-1/2 w-[30%] aspect-[5/1] rounded-full bg-[#1d1a17] z-10" aria-hidden />
      <img src={src} alt={alt} loading="lazy" className="block w-full rounded-[12.5%/5.8%]" />
    </div>
  );
}

/** Three phones fanned out; they spread a little as you scroll past. */
export function PhoneFan({ shots, color }: { shots: { src: string; alt: string }[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spread = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.15]);
  const rotL = useTransform(spread, (s) => -8 * s);
  const rotR = useTransform(spread, (s) => 8 * s);
  const xL = useTransform(spread, (s) => `${-8 * s}%`);
  const xR = useTransform(spread, (s) => `${8 * s}%`);
  const [a, b, c] = shots;
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-[10px] border border-black/10 py-10 md:py-16"
      style={{ background: `radial-gradient(120% 90% at 50% 100%, ${color}40, ${color}12 60%, transparent)` }}
    >
      <div className="relative mx-auto flex items-end justify-center gap-0 w-full max-w-[860px] px-4">
        {a && (
          <motion.div style={{ rotate: rotL, x: xL }} className="w-[30%] max-w-[240px] origin-bottom-right translate-y-6">
            <Phone src={a.src} alt={a.alt} />
          </motion.div>
        )}
        {b && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative z-10 w-[34%] max-w-[270px] -mx-[3%]"
          >
            <Phone src={b.src} alt={b.alt} />
          </motion.div>
        )}
        {c && (
          <motion.div style={{ rotate: rotR, x: xR }} className="w-[30%] max-w-[240px] origin-bottom-left translate-y-6">
            <Phone src={c.src} alt={c.alt} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** A row of phones under a step, each with an optional caption. */
export function PhoneRow({ shots }: { shots: { src: string; alt: string; caption?: string }[] }) {
  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x">
      {shots.map((s, i) => (
        <motion.figure
          key={s.src}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="snap-start shrink-0 w-[62%] sm:w-[220px] md:w-[230px] flex flex-col gap-3"
        >
          <Phone src={s.src} alt={s.alt} />
          {s.caption && (
            <figcaption className="font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] text-black/60 text-center rotate-[-1deg]">
              {s.caption}
            </figcaption>
          )}
        </motion.figure>
      ))}
    </div>
  );
}
