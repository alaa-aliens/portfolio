import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { StickerArt } from "./play/Stickers";

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
      className="relative w-full overflow-hidden rounded-[18px] border border-dashed border-black/30 bg-[#fffaf1]/60 py-10 md:py-16"
      style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(29,26,23,.08) 31px 32px)" }}
    >
      <Pins color={color} />
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

/** A few doodles pinned in the corners of a showcase board. */
function Pins({ color }: { color: string }) {
  return (
    <>
      <span aria-hidden className="absolute left-4 top-4 rotate-[-12deg]"><StickerArt kind="star" size={30} /></span>
      <span aria-hidden className="absolute right-5 top-6 rotate-[10deg]"><StickerArt kind="bolt" size={28} /></span>
      <svg aria-hidden className="absolute right-6 bottom-5 w-[90px] h-[26px]" viewBox="0 0 90 26" fill="none"><path d="M3 18 C 25 4, 50 24, 86 8" stroke={color} strokeWidth="3" strokeLinecap="round" /></svg>
    </>
  );
}

/* ───────────── Desktop products ───────────── */

/** A browser-window frame around a desktop screenshot. */
export function Browser({ src, alt, className = "", url }: { src: string; alt: string; className?: string; url?: string }) {
  return (
    <div className={`relative rounded-[10px] md:rounded-[14px] border border-[#1d1a17] bg-[#fffaf1] overflow-hidden ${className}`}>
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

/** One hand-drawn browser with tabs: click a tab (or wait) and the screen slides in. */
export function BrowserShowcase({ shots, color, url }: { shots: { src: string; alt: string; tab?: string }[]; color: string; url?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || shots.length < 2) return;
    const t = window.setInterval(() => setI((k) => (k + 1) % shots.length), 4200);
    return () => window.clearInterval(t);
  }, [paused, shots.length]);
  const cur = shots[i];
  const tabName = (s: { alt: string; tab?: string }, k: number) => s.tab ?? s.alt.split(":")[0].replace(/^[^ ]+ /, "").trim() ?? `screen ${k + 1}`;
  return (
    <div
      className="relative w-full rounded-[18px] border border-dashed border-black/30 border-b-0 bg-[#fffaf1]/60 pt-8 md:pt-12 px-3 md:px-10 pb-0 overflow-hidden"
      style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgba(29,26,23,.08) 31px 32px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto w-full max-w-[980px]">
        {/* tabs */}
        <div className="flex items-end gap-1 px-2 overflow-x-auto" role="tablist">
          {shots.map((s, k) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={k === i}
              onClick={() => {
                setI(k);
                setPaused(true);
              }}
              className={`relative shrink-0 rounded-t-[10px] border border-b-0 border-[#1d1a17] px-3.5 md:px-4 py-1.5 font-['Shantell_Sans',cursive] text-[12.5px] md:text-[14px] transition-colors ${
                k === i ? "bg-[#fffaf1] text-black -mb-px z-10" : "bg-[#fdecd0]/80 text-black/55 hover:text-black"
              }`}
              style={{ rotate: `${(k % 2 ? 0.6 : -0.6)}deg` }}
            >
              {tabName(s, k)}
            </button>
          ))}
        </div>
        <div className="relative rounded-[10px] md:rounded-[14px] rounded-b-none border border-b-0 border-[#1d1a17] bg-[#fffaf1] overflow-hidden">
          <div className="flex items-center gap-2 px-3 h-8 md:h-9 border-b border-[#1d1a17] bg-[#fdecd0]">
            <span className="flex gap-1.5" aria-hidden>
              <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#ff614c]" />
              <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#FFC53D]" />
              <i className="block w-2.5 h-2.5 rounded-full border-[1.5px] border-[#1d1a17] bg-[#53B858]" />
            </span>
            {url && <span className="ml-2 flex-1 max-w-[340px] rounded-full border border-[#1d1a17]/40 bg-white/70 px-3 py-0.5 font-['Work_Sans'] text-[11px] text-black/55 truncate">{url}</span>}
          </div>
          <div className="relative w-full" style={{ aspectRatio: "1200 / 760" }}>
            <AnimatePresence initial={false}>
              <motion.img
                key={cur.src}
                src={cur.src}
                alt={cur.alt}
                className="absolute inset-0 w-full h-full object-cover object-top"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Screens under a chapter: phones in a row, desktop shots stacked full-width. */
export function ScreenRow({ shots }: { shots: { src: string; alt: string; caption?: string; kind?: "phone" | "desktop" }[] }) {
  const phones = shots.filter((s) => s.kind !== "desktop");
  const desks = shots.filter((s) => s.kind === "desktop");
  return (
    <div className="flex flex-col gap-8">
      {desks.map((s, i) => (
        <motion.figure
          key={s.src}
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 0.8 : -0.8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-3"
        >
          <Browser src={s.src} alt={s.alt} />
          {s.caption && <figcaption className="font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] text-black/60 text-center rotate-[-1deg]">{s.caption}</figcaption>}
        </motion.figure>
      ))}
      {phones.length > 0 && <PhoneRow shots={phones} />}
    </div>
  );
}
