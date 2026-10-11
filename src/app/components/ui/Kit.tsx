/*
 * The site's design language, in one file. Every page builds from these.
 *
 *  Paper      #fdecd0 page · #fffaf1 card · ink #1d1a17 · coral #ff614c
 *  Type       display: Bagel Fat One (big lowercase moments) · headings: Playfair Display
 *             body: IBM Plex Serif · UI: Work Sans · handwriting: Shantell Sans
 *  Edges      2px ink border · radius 18–20 (cards) / full (pills) · hard offset shadow (4,5) in ink
 *  Motion     springs (stiffness 200–400, damping 14–24), things tilt ±2° at rest and straighten on hover
 */
import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Link } from "react-router";

export const ink = "#1d1a17";
export const coral = "#ff614c";
export const paper = "#fdecd0";
export const card = "#fffaf1";
export const accents = { purple: "#6A4CFF", teal: "#02B5C9", green: "#53B858", gold: "#FFC53D", pink: "#FF4C79", orange: "#FF9F1C" };

/** Eyebrow: small uppercase label above a title. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-['Work_Sans'] uppercase tracking-[0.2em] text-[12px] md:text-[13px] text-black/50 ${className}`}>{children}</p>;
}

/** Handwritten aside, slightly tilted. */
export function Scribble({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] text-black/55 rotate-[-1deg] ${className}`}>{children}</p>;
}

/** Body paragraph. */
export function Prose({ children, className = "", lead = false }: { children: React.ReactNode; className?: string; lead?: boolean }) {
  return (
    <p className={`font-['IBM_Plex_Serif'] text-black ${lead ? "text-[17px] md:text-[22px] leading-[1.55]" : "text-[16px] md:text-[19px] leading-[1.65] text-black/85"} ${className}`}>
      {children}
    </p>
  );
}

/** The paper card: 2px ink border, hard shadow, slight tilt that straightens on hover. */
export function PaperCard({
  children,
  className = "",
  tilt = 0,
  hover = true,
  tone = "card",
  ...rest
}: { children: React.ReactNode; className?: string; tilt?: number; hover?: boolean; tone?: "card" | "ink" | "coral" } & HTMLMotionProps<"div">) {
  const tones = {
    card: "bg-[#fffaf1] text-black shadow-[4px_5px_0_0_#1d1a17]",
    ink: "bg-[#1d1a17] text-[#fffaf1] shadow-[4px_5px_0_0_#ff614c]",
    coral: "bg-[#ff614c] text-[#fffaf1] shadow-[4px_5px_0_0_#1d1a17]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt * 0.4 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={hover ? { rotate: 0, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`relative rounded-[20px] border-2 border-black ${tones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Primary button: white with hard shadow that presses in. */
export function Button({
  children,
  onClick,
  to,
  href,
  tone = "paper",
  className = "",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  href?: string;
  tone?: "paper" | "ink" | "coral";
  className?: string;
  size?: "md" | "lg";
}) {
  const tones = {
    paper: "bg-[#fffaf1] text-black",
    ink: "bg-[#1d1a17] text-[#fffaf1]",
    coral: "bg-[#ff614c] text-[#fffaf1]",
  };
  const cls = `inline-flex items-center justify-center gap-2 border-2 border-black rounded-full font-['DM_Serif_Display'] ${size === "lg" ? "px-7 py-3.5 text-[19px] md:text-[21px]" : "px-5 py-2.5 text-[16px] md:text-[18px]"} shadow-[4px_4px_0_0_#1d1a17] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d1a17] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all ${tones[tone]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** Tag chip. */
export function Chip({ children, tone = "line", color }: { children: React.ReactNode; tone?: "line" | "ink" | "color"; color?: string }) {
  const base = "inline-flex items-center gap-1.5 font-['Work_Sans'] text-[11px] font-semibold uppercase tracking-[0.08em] px-2 py-[3px] rounded-[6px] border";
  if (tone === "ink") return <span className={`${base} bg-black text-white border-black`}>{children}</span>;
  if (tone === "color") return <span className={`${base} border-black/25 text-black/80`}><span className="w-2 h-2 rounded-full" style={{ background: color }} />{children}</span>;
  return <span className={`${base} border-black/25 text-black/70`}>{children}</span>;
}

/** Big "next page" tile pair used at the bottom of every page. */
export function NextTiles({ items }: { items: { to: string; k: string; t: string }[] }) {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      {items.map((n) => (
        <Link key={n.to} to={n.to} className="group border-2 border-black rounded-[20px] p-7 md:p-9 flex flex-col gap-5 bg-black text-white hover:bg-[#ff614c] transition-colors">
          <span className="font-['Work_Sans'] uppercase tracking-[0.18em] text-[12px] text-white/60">{n.k}</span>
          <span className="font-['Playfair_Display'] font-bold text-[26px] md:text-[36px] leading-tight flex items-center justify-between gap-4">
            {n.t}<span className="transition-transform group-hover:translate-x-2">→</span>
          </span>
        </Link>
      ))}
    </section>
  );
}

/** Page shell: consistent top padding, gutters, max width. */
export function Page({ children, wide = false, className = "" }: { children: React.ReactNode; wide?: boolean; className?: string }) {
  return (
    <article className={`w-full ${wide ? "max-w-[1200px]" : "max-w-[1000px]"} mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] pb-8 flex flex-col gap-24 md:gap-32 ${className}`}>
      {children}
    </article>
  );
}
