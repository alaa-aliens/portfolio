/*
 * The things on Ala'a's desk. Each one is a hand-drawn SVG with a small idle animation
 * and a line it says when you hover or tap it. They sit on the desk; the skill chips
 * bounce off them (the physics component reads their boxes via data-desk-solid).
 */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMode } from "../ModeContext";
import sibaFace from "../../../assets/work/siba/poses/siba-cheer.webp";

const INK = "#1d1a17";
const sw = { stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export type ThingId = "mac" | "ipad" | "controller" | "mug" | "cat" | "plant" | "pc" | "car";

export const THINGS: { id: ThingId; w: number; h: number; pro: string; fun: string; left: number /* % of desk */; solid?: boolean }[] = [
  { id: "mac", w: 170, h: 150, left: 44, pro: "Where everything gets designed. Siba lives on this screen.", fun: "Where I pretend to work. Siba lives here now.", solid: true },
  { id: "ipad", w: 110, h: 80, left: 22, pro: "iPad + Pencil: every @alaa_aliens doodle starts here.", fun: "The 2am doodle machine.", solid: true },
  { id: "controller", w: 80, h: 70, left: 78, pro: "Longtime console gamer. It's research.", fun: "5 PlayStation generations. It's research, ok?", solid: true },
  { id: "mug", w: 54, h: 54, left: 66, pro: "Coffee. The real design tool.", fun: "Coffee #4. Don't ask about #1–3.", solid: true },
  { id: "plant", w: 56, h: 62, left: 6, pro: "Still alive. Unlike my inbox.", fun: "Alive on day 212. Personal record." },
  { id: "pc", w: 70, h: 92, left: 91, pro: "Ryzen 9800X3D + RTX 5080, built for sim racing.", fun: "Built a PC for \"sim racing\". Mostly runs Figma.", solid: true },
  { id: "cat", w: 84, h: 72, left: 2, pro: "Diva. Attends every call. Approves nothing.", fun: "Diva. Sits on the keyboard during reviews. Great feedback." },
];

import stMac from "../../../assets/stickers/mac.webp";
import stIpad from "../../../assets/stickers/ipad.webp";
import stPc from "../../../assets/stickers/pc.webp";
import stMug from "../../../assets/stickers/mug.webp";
import stController from "../../../assets/stickers/controller.webp";
import stPlant from "../../../assets/stickers/plant.webp";
import stCat from "../../../assets/stickers/cat.webp";
const DRAWN: Partial<Record<ThingId, string>> = { mac: stMac, ipad: stIpad, pc: stPc, mug: stMug, controller: stController, plant: stPlant, cat: stCat };
export function Thing({ id, size = 1 }: { id: ThingId; size?: number }) {
  const S = (w: number, h: number) => ({ width: w * size, height: h * size });
  const t = THINGS.find((x) => x.id === id);
  if (DRAWN[id] && t) {
    return <img src={DRAWN[id]} alt="" draggable={false} style={{ width: t.w * size, height: t.h * size, objectFit: "contain" }} className="block max-w-none select-none pointer-events-none" aria-hidden />;
  }
  switch (id) {
    case "mac":
      return (
        <svg viewBox="0 0 150 112" {...S(150, 112)} fill="none" aria-hidden>
          <rect x="6" y="4" width="138" height="88" rx="8" fill="#1d1a17" />
          <rect x="12" y="10" width="126" height="72" rx="4" fill="#fdecd0" />
          <rect x="12" y="10" width="126" height="10" fill="#fffaf1" />
          <circle cx="19" cy="15" r="2" fill="#ff614c" /><circle cx="26" cy="15" r="2" fill="#FFC53D" /><circle cx="33" cy="15" r="2" fill="#53B858" />
          <rect x="20" y="28" width="46" height="46" rx="6" fill="#DDF3E8" />
          <image href={sibaFace} x="22" y="26" width="42" height="50" preserveAspectRatio="xMidYMax meet" />
          <rect x="74" y="30" width="54" height="8" rx="3" fill="#ff614c" />
          <rect x="74" y="44" width="40" height="5" rx="2" fill="#1d1a17" opacity=".3" />
          <rect x="74" y="54" width="48" height="5" rx="2" fill="#1d1a17" opacity=".3" />
          <rect x="74" y="64" width="30" height="8" rx="3" fill="#1d1a17" />
          <path d="M60 92 L90 92 L96 104 L54 104 Z" fill="#1d1a17" />
          <path d="M44 108 L106 108" stroke="#1d1a17" strokeWidth="4" strokeLinecap="round" />
          <motion.g animate={{ opacity: [0.9, 0.3, 0.9] }} transition={{ duration: 1.1, repeat: Infinity }}>
            <rect x="106" y="64" width="2" height="8" fill="#ff614c" />
          </motion.g>
        </svg>
      );
    case "ipad":
      return (
        <svg viewBox="0 0 84 62" {...S(84, 62)} fill="none" aria-hidden>
          <rect x="4" y="6" width="64" height="50" rx="5" fill="#fffaf1" {...sw} transform="rotate(-6 36 31)" />
          <rect x="10" y="12" width="52" height="38" rx="3" fill="#FFE1D9" transform="rotate(-6 36 31)" />
          <path d="M20 34 q6 -12 12 0 q6 12 12 0 q4 -8 8 -2" stroke="#ff614c" strokeWidth="2.2" strokeLinecap="round" fill="none" transform="rotate(-6 36 31)" />
          <motion.g animate={{ rotate: [0, -6, 0], x: [0, 2, 0] }} transition={{ duration: 2.6, repeat: Infinity }} style={{ originX: "70px", originY: "50px" }}>
            <path d="M64 48 L80 12" stroke="#fffaf1" strokeWidth="6" strokeLinecap="round" />
            <path d="M64 48 L80 12" {...sw} />
            <path d="M62 52 L64 48" stroke="#ff614c" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
        </svg>
      );
    case "controller":
      return (
        <svg viewBox="0 0 70 48" {...S(70, 48)} fill="none" aria-hidden>
          <path d="M14 8 h42 c10 0 10 14 8 24 c-1 6 -6 10 -10 8 l-8 -8 h-22 l-8 8 c-4 2 -9 -2 -10 -8 c-2 -10 -2 -24 8 -24z" fill="#fffaf1" {...sw} />
          <circle cx="24" cy="20" r="5" fill="#1d1a17" /><circle cx="44" cy="22" r="5" fill="#1d1a17" />
          <circle cx="52" cy="14" r="2.3" fill="#53B858" /><circle cx="58" cy="19" r="2.3" fill="#ff614c" /><circle cx="52" cy="24" r="2.3" fill="#02B5C9" /><circle cx="46" cy="19" r="2.3" fill="#FF4C79" />
          <path d="M12 14 h6 M15 11 v6" stroke="#1d1a17" strokeWidth="2" strokeLinecap="round" />
          <motion.path d="M30 6 v-3 M40 6 v-3" stroke="#6A4CFF" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        </svg>
      );
    case "mug":
      return (
        <svg viewBox="0 0 44 46" {...S(44, 46)} fill="none" aria-hidden>
          <path d="M6 14h24l-2 26c-.2 2-1.8 3.5-3.8 3.5H11.8c-2 0-3.6-1.5-3.8-3.5z" fill="#fffaf1" {...sw} />
          <path d="M30 18c6-1 8 3 6 7-1.5 3-4.5 4-7 4" {...sw} />
          <path d="M9 22 h18" stroke="#ff614c" strokeWidth="3" strokeLinecap="round" />
          <motion.path d="M13 3c-2 3 2 5 0 8M20 2c-2 3 2 5 0 8M26 4c-2 3 2 5 0 8" stroke="#ff614c" strokeWidth="2.2" strokeLinecap="round" animate={{ y: [0, -3, 0], opacity: [0.9, 0.3, 0.9] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </svg>
      );
    case "plant":
      return (
        <svg viewBox="0 0 40 58" {...S(40, 58)} fill="none" aria-hidden>
          <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity }} style={{ originX: "20px", originY: "38px" }}>
            <path d="M20 30C19 20 12 14 5 14c1 8 7 13 15 16zM20 26c1-11 8-18 16-18-1 9-8 15-16 18z" fill="#53B858" stroke="#1d1a17" strokeWidth="2" strokeLinejoin="round" />
            <path d="M20 30v8" stroke="#1d1a17" strokeWidth="2" />
          </motion.g>
          <path d="M9 37h22l-3 19H12z" fill="#ff614c" stroke="#1d1a17" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    case "pc":
      return (
        <svg viewBox="0 0 54 74" {...S(54, 74)} fill="none" aria-hidden>
          <rect x="6" y="4" width="42" height="66" rx="5" fill="#1d1a17" />
          <rect x="11" y="9" width="32" height="56" rx="3" fill="#2b2622" />
          <motion.rect x="14" y="14" width="26" height="14" rx="2" fill="#6A4CFF" animate={{ fill: ["#6A4CFF", "#02B5C9", "#FF4C79", "#6A4CFF"] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} style={{ originX: "27px", originY: "46px" }}>
            <circle cx="27" cy="46" r="9" stroke="#fffaf1" strokeWidth="2" strokeDasharray="4 3" />
          </motion.g>
          <circle cx="27" cy="46" r="2" fill="#ff614c" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 72 60" {...S(72, 60)} fill="none" aria-hidden>
          <motion.path d="M58 44 c10 -2 14 -14 6 -22" {...sw} animate={{ d: ["M58 44 c10 -2 14 -14 6 -22", "M58 44 c12 2 16 -10 10 -18", "M58 44 c10 -2 14 -14 6 -22"] }} transition={{ duration: 2.2, repeat: Infinity }} />
          <ellipse cx="36" cy="44" rx="24" ry="13" fill="#fffaf1" {...sw} />
          <circle cx="20" cy="30" r="12" fill="#fffaf1" {...sw} />
          <path d="M10 22 L12 10 L20 19 Z M30 22 L28 10 L20 19 Z" fill="#fffaf1" {...sw} />
          <path d="M12 12 L14 18 M28 12 L26 18" stroke="#FFD6E0" strokeWidth="2" strokeLinecap="round" />
          <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }} style={{ originY: "30px" }}>
            <circle cx="16" cy="30" r="1.8" fill="#1d1a17" /><circle cx="24" cy="30" r="1.8" fill="#1d1a17" />
          </motion.g>
          <path d="M18 34 l2 2 l2 -2" stroke="#ff614c" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 32 l-6 -1 M6 35 l-6 1 M34 32 l6 -1 M34 35 l6 1" stroke="#1d1a17" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M26 52 v6 M44 52 v6" {...sw} />
        </svg>
      );
    case "car":
      return null;
  }
}

/** Desk objects placed by % along the desk; each one talks on hover/tap. */
export function DeskThings({ deskPct, deskTop }: { deskPct: number; deskTop: string }) {
  const { isProfessional } = useMode();
  const [say, setSay] = useState<ThingId | null>(null);
  return (
    <>
      {THINGS.map((t) => (
        <div
          key={t.id}
          data-desk-solid={t.solid ? "1" : undefined}
          className="absolute z-[2]"
          style={{ left: `calc(50% - ${deskPct / 2}% + ${(t.left / 100) * deskPct}%)`, top: `calc(${deskTop} - ${t.h}px)`, width: t.w, height: t.h }}
        >
          <motion.button
            type="button"
            aria-label={t.id}
            onClick={() => setSay(say === t.id ? null : t.id)}
            onMouseEnter={() => setSay(t.id)}
            onMouseLeave={() => setSay(null)}
            whileHover={{ y: -4, rotate: -3 }}
            whileTap={{ scale: 0.92 }}
            className="block w-full h-full cursor-pointer"
          >
            <Thing id={t.id} />
          </motion.button>
          <AnimatePresence>
            {say === t.id && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="absolute z-30 left-1/2 -translate-x-1/2 -top-2 -translate-y-full whitespace-nowrap bg-white border border-black rounded-[14px] px-3 py-1.5 font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] shadow-[3px_3px_0_0_black]"
              >
                {isProfessional ? t.pro : t.fun}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </>
  );
}
