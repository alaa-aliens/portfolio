import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** A simple phone frame around a screenshot. */
export function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`relative rounded-[30px] md:rounded-[34px] bg-[#1d1a17] p-[7px] shadow-[0_24px_50px_-20px_rgba(60,35,10,0.45)] ${className}`}
    >
      {/* sizes are proportional so small phones keep the same shape */}
      <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[30%] h-[14px] rounded-full bg-[#1d1a17] z-10" aria-hidden />
      <img src={src} alt={alt} loading="lazy" className="block w-full rounded-[24px] md:rounded-[28px]" />
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
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x max-w-[calc(100%+3rem)] md:max-w-full">
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

/* ───────────── Desktop products ───────────── */

/** A browser-window frame around a desktop screenshot. */
export function Browser({ src, alt, className = "", url }: { src: string; alt: string; className?: string; url?: string }) {
  return (
    <div className={`relative rounded-[10px] md:rounded-[14px] border border-[#1d1a17] bg-[#fffaf1] overflow-hidden shadow-[4px_4px_0_0_#1d1a17] ${className}`}>
      <div className="flex items-center gap-2 px-3 h-7 md:h-8 border-b-2 border-[#1d1a17] bg-[#fdecd0]">
        <span className="flex gap-1.5" aria-hidden>
          <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#ff614c]" />
          <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#FFC53D]" />
          <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#53B858]" />
        </span>
        {url && (
          <span className="ml-2 hidden sm:block flex-1 max-w-[320px] rounded-full border border-[#1d1a17]/40 bg-white/70 px-3 py-0.5 font-['Work_Sans'] text-[10px] md:text-[11px] text-black/55 truncate">
            {url}
          </span>
        )}
      </div>
      <img src={src} alt={alt} loading="lazy" className="block w-full" />
    </div>
  );
}

/** One big browser screen with two leaning behind it; slides up as you scroll into it. */
export function BrowserShowcase({ shots, color, url }: { shots: { src: string; alt: string }[]; color: string; url?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const spread = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const xL = useTransform(spread, (s) => `${-10 * s}%`);
  const xR = useTransform(spread, (s) => `${10 * s}%`);
  const rL = useTransform(spread, (s) => -3 * s);
  const rR = useTransform(spread, (s) => 3 * s);
  const [a, b, c] = shots;
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-[10px] border border-black/10 pt-10 md:pt-16 px-4 md:px-10"
      style={{ background: `radial-gradient(120% 90% at 50% 100%, ${color}40, ${color}12 60%, transparent)` }}
    >
      <div className="relative mx-auto w-full max-w-[980px]">
        {b && (
          <motion.div style={{ x: xL, rotate: rL }} className="absolute left-0 bottom-0 w-[70%] origin-bottom-left opacity-90 hidden sm:block">
            <Browser src={b.src} alt={b.alt} />
          </motion.div>
        )}
        {c && (
          <motion.div style={{ x: xR, rotate: rR }} className="absolute right-0 bottom-0 w-[70%] origin-bottom-right opacity-90 hidden sm:block">
            <Browser src={c.src} alt={c.alt} />
          </motion.div>
        )}
        {a && (
          <motion.div style={{ y: lift }} className="relative z-10 mx-auto w-full sm:w-[84%] -mb-[2px]">
            <Browser src={a.src} alt={a.alt} url={url} className="rounded-b-none shadow-none" />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/** Screens under a step: phones stay narrow, desktop shots go wide. Mixed rows are fine. */
export function ScreenRow({ shots }: { shots: { src: string; alt: string; caption?: string; kind?: "phone" | "desktop" }[] }) {
  if (shots.every((s) => s.kind !== "desktop")) return <PhoneRow shots={shots} />;
  return (
    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x max-w-[calc(100%+3rem)] md:max-w-full">
      {shots.map((s, i) => (
        <motion.figure
          key={s.src}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1 : -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`snap-start shrink-0 flex flex-col gap-3 ${s.kind === "desktop" ? "w-[92%] sm:w-[560px] md:w-[640px]" : "w-[62%] sm:w-[220px] md:w-[230px]"}`}
        >
          {s.kind === "desktop" ? <Browser src={s.src} alt={s.alt} /> : <Phone src={s.src} alt={s.alt} />}
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
