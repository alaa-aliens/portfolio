/*
 * The site's design language, in one file. Every page builds from these.
 *
 *  Paper      #fdecd0 page · #fffaf1 card · ink #1d1a17 · coral #ff614c
 *  Type       display: Gochi Hand (big moments, lowercase, coral or ink) · headings: Playfair Display
 *             body: IBM Plex Serif · UI: Work Sans · handwriting: Shantell Sans
 *  Edges      hand-drawn roughjs frames for cards (RoughBox); buttons keep his original 1px line + hard shadow; tags are his coral labels
 *  Motion     springs (stiffness 200–400, damping 14–24), things tilt ±2° at rest and straighten on hover
 */
import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Link } from "react-router";
import { RoughBox } from "./RoughBox";
export { RoughBox };

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

/** The paper card: a hand-drawn (roughjs) frame on paper, slight tilt that straightens on hover. */
export function PaperCard({
  children,
  className = "",
  tilt = 0,
  hover = true,
  tone = "card",
  ...rest
}: { children: React.ReactNode; className?: string; tilt?: number; hover?: boolean; tone?: "card" | "ink" | "coral" } & HTMLMotionProps<"div">) {
  const fills = { card: "#fffaf1", ink: "#1d1a17", coral: "#ff614c" };
  const text = { card: "text-black", ink: "text-[#fffaf1]", coral: "text-[#fffaf1]" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt * 0.4 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={hover ? { rotate: 0, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={`relative ${text[tone]}`}
      {...rest}
    >
      <RoughBox fill={fills[tone]} stroke={tone === "ink" ? "#fffaf1" : "#1d1a17"} radius={18} className={className}>
        {children}
      </RoughBox>
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
    paper: "bg-white text-black",
    ink: "bg-[#1d1a17] text-[#fffaf1]",
    coral: "bg-[#ff614c] text-white",
  };
  // His original button: a rectangle with a 1px ink line and a hard 4px shadow that presses in.
  const cls = `inline-flex items-center justify-center gap-2 border border-black rounded-[3px] font-['DM_Serif_Display'] ${size === "lg" ? "px-8 py-4 text-[18px] md:text-[20px]" : "px-6 py-3 text-[16px] md:text-[18px]"} shadow-[4px_4px_0_0_#1d1a17] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d1a17] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all ${tones[tone]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** Tag: his original coral label (small filled rectangle), or a plain underlined word. */
export function Chip({ children, tone = "line", color }: { children: React.ReactNode; tone?: "line" | "ink" | "color"; color?: string }) {
  const base = "inline-flex items-center gap-1.5 font-['Work_Sans'] text-[11px] font-semibold uppercase tracking-[0.1em] px-2 py-[3px]";
  if (tone === "ink") return <span className={`${base} bg-[#ff614c] text-white rounded-[2px]`}>{children}</span>;
  if (tone === "color") return <span className={`${base} text-black/75`}><span className="w-2 h-2 rounded-full" style={{ background: color }} />{children}</span>;
  return <span className={`${base} text-black/60 border-b border-black/30`}>{children}</span>;
}

/** "Next page" links: big marker words with a scribble underline, no boxes. */
export function NextTiles({ items }: { items: { to: string; k: string; t: string }[] }) {
  return (
    <section className="grid md:grid-cols-2 gap-8 md:gap-12 border-t border-black/20 pt-10">
      {items.map((n, i) => (
        <Link key={n.to} to={n.to} className="group flex flex-col gap-2">
          <span className="font-['Shantell_Sans',cursive] text-[14px] text-black/50">{n.k}</span>
          <span className="font-display lowercase text-[38px] md:text-[56px] leading-[1] text-black group-hover:text-[#ff614c] transition-colors flex items-center gap-4">
            {n.t}
            <span className="transition-transform group-hover:translate-x-2 text-[#ff614c]">→</span>
          </span>
          <svg width="160" height="10" viewBox="0 0 160 10" fill="none" aria-hidden className="mt-1">
            <path d={i % 2 ? "M2 6 C 30 2, 60 9, 90 5 S 140 2, 158 6" : "M2 5 C 40 9, 70 2, 100 6 S 140 8, 158 4"} stroke="#ff614c" strokeWidth="2.2" strokeLinecap="round" className="opacity-60 group-hover:opacity-100 transition-opacity" />
          </svg>
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
