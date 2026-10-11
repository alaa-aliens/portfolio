/*
 * "Doodle on my site" — pick one of Ala'a's doodles and stamp it anywhere.
 * Stickers live per page for this visit only. Esc (or the ✕) puts the pen down.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";
import { useMode } from "../ModeContext";
import { Eye } from "../hero/EyeHeadline";
import { isPencilOn, setPencil } from "./InkCursor";

export type Kind = "star" | "heart" | "sparkle" | "swirl" | "bolt" | "wow" | "coffee" | "user" | "crown" | "eye" | "tie" | "popper";

const INK = "#1d1a17";
const sw = { stroke: INK, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function StickerArt({ kind, size = 56 }: { kind: Kind; size?: number }) {
  switch (kind) {
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24 4.5l5.6 12.1 13.1 1.4-9.8 8.9 2.8 12.9L24 33.2l-11.7 6.6 2.8-12.9-9.8-8.9 13.1-1.4z" fill="#FFC53D" {...sw} />
        </svg>
      );
    case "heart":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24 41C9 31 5 22 9.5 14.5 13.5 8 21 9.5 24 15c3-5.5 10.5-7 14.5-.5C43 22 39 31 24 41z" fill="#FF4C79" {...sw} />
          <path d="M15 17c1.5-2.5 4-3 6-2" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "sparkle":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24 3c2 12 5 15 19 21-14 5-17 9-19 21-2-12-5-16-19-21 14-6 17-9 19-21z" fill="#B9A8FF" {...sw} />
        </svg>
      );
    case "swirl":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <path d="M8 36c-4-12 6-26 20-22 10 3 9 17-1 16-8-1-7-10 1-9" stroke="#02B5C9" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case "bolt":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M27 3L9 27h12l-4 18 22-26H27l4-16z" fill="#FF9F1C" {...sw} />
        </svg>
      );
    case "wow":
      return (
        <svg width={size * 1.4} height={size} viewBox="0 0 68 48">
          <path d="M6 10c18-8 40-8 56 0 4 10 4 20 0 28-18 7-38 7-56 0-4-9-4-19 0-28z" fill="#ff614c" {...sw} />
          <text x="34" y="31" textAnchor="middle" fontFamily="'Gochi Hand', cursive" fontSize="19" fill="#fff">wow</text>
        </svg>
      );
    case "coffee":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M9 18h24l-2.5 21c-.3 2-2 3.5-4 3.5h-11c-2 0-3.7-1.5-4-3.5z" fill="#fff" {...sw} />
          <path d="M33 22c6-1 8 3 6 7-1.6 3-5 4-8 4" fill="none" {...sw} />
          <path d="M16 6c-2 3 2 5 0 8M23 5c-2 3 2 5 0 8" fill="none" stroke="#ff614c" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M12 27h18" stroke="#ff614c" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <ellipse cx="25" cy="44" rx="10" ry="2.6" fill="rgba(60,40,20,.15)" />
          <path d="M19 42l2-9M29 42l-2-9" fill="none" {...sw} />
          <rect x="16" y="20" width="16" height="16" rx="7" fill="#fffaf1" {...sw} />
          <circle cx="24" cy="13" r="7" fill="#fffaf1" {...sw} />
          <path d="M17.3 11.5a7 7 0 0 1 13.4 0z" fill="#6A4CFF" {...sw} />
          <circle cx="27" cy="14" r="1.1" fill={INK} />
        </svg>
      );
    case "crown":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M6 16l9 9 9-15 9 15 9-9-4 22H10z" fill="#FFC53D" {...sw} />
          <circle cx="24" cy="30" r="2.6" fill="#ff614c" />
        </svg>
      );
    case "tie":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M17 6h14l-3 7h-8z" fill="#1d1a17" {...sw} />
          <path d="M20 13h8l5 22-9 9-9-9z" fill="#6A4CFF" {...sw} />
          <path d="M21.5 20l6 4M20.5 27l7 4" stroke="#B9A8FF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "popper":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M6 42l9-25 16 16z" fill="#FFC53D" {...sw} />
          <path d="M11 29l8 8M13.5 22.5l12 12" stroke="#ff614c" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M27 9c2 3 0 5 3 7M36 14l4-2M33 5l1 4M40 22c2-1 4 0 5 1" stroke="#1d1a17" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="7" r="2.2" fill="#02B5C9" stroke="#1d1a17" strokeWidth="1.6" />
          <circle cx="43" cy="16" r="2" fill="#FF4C79" stroke="#1d1a17" strokeWidth="1.6" />
        </svg>
      );
    case "eye":
      return (
        <span style={{ fontSize: size * 1.25, color: INK, lineHeight: 0 }} className="inline-block">
          <Eye delay={0} />
        </span>
      );
  }
}

const KINDS: Kind[] = ["star", "heart", "sparkle", "swirl", "bolt", "wow", "coffee", "user", "crown", "eye"];

interface Placed {
  id: number;
  kind: Kind;
  x: number;
  y: number;
  rot: number;
  path: string;
}

export function Stickers() {
  const { isProfessional } = useMode();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<Kind | null>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [pencil, setPencilState] = useState(() => isPencilOn());
  const togglePencil = () => {
    const n = !pencil;
    setPencilState(n);
    setPencil(n);
  };
  const trayRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  const disarm = useCallback(() => setArmed(null), []);

  useEffect(() => {
    if (!armed) return;
    const move = (e: PointerEvent) => setCursor({ x: e.clientX, y: e.clientY });
    const key = (e: KeyboardEvent) => e.key === "Escape" && disarm();
    const click = (e: MouseEvent) => {
      if (trayRef.current?.contains(e.target as Node)) return;
      // Place the sticker instead of clicking whatever is underneath.
      e.preventDefault();
      e.stopPropagation();
      setPlaced((p) => [
        ...p,
        { id: idRef.current++, kind: armed, x: e.pageX, y: e.pageY, rot: Math.round(Math.random() * 30 - 15), path: pathname },
      ]);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("keydown", key);
    window.addEventListener("click", click, true);
    document.body.classList.add("sticker-armed");
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", key);
      window.removeEventListener("click", click, true);
      document.body.classList.remove("sticker-armed");
    };
  }, [armed, pathname, disarm]);

  const here = placed.filter((p) => p.path === pathname);

  return (
    <>
      {/* Stamped stickers (scroll with the page) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[45] overflow-hidden">
        <AnimatePresence>
          {here.map((s) => (
            <motion.div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[2px_3px_0_rgba(0,0,0,0.18)]"
              style={{ left: s.x, top: s.y }}
              initial={{ scale: 2.2, opacity: 0, rotate: s.rot - 25 }}
              animate={{ scale: 1, opacity: 1, rotate: s.rot }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 15 }}
            >
              <StickerArt kind={s.kind} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sticker following the cursor while armed */}
      {armed && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-1/2 opacity-80"
          style={{ left: cursor.x, top: cursor.y }}
        >
          <StickerArt kind={armed} size={48} />
        </div>
      )}

      {/* Tray */}
      <div ref={trayRef} className="hidden md:block fixed left-5 bottom-5 z-[80]">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="tray"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-[268px] bg-[#fffaf1] border border-black rounded-[14px] shadow-[5px_5px_0_0_black] p-3"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-['Shantell_Sans',cursive] text-[14px] text-black">
                  {armed ? (isProfessional ? "click anywhere to stick it" : "go wild. click anywhere.") : isProfessional ? "pick a doodle" : "deface my website"}
                </span>
                <div className="flex gap-1">
                  {here.length > 0 && (
                    <button
                      onClick={() => setPlaced((p) => p.filter((s) => s.path !== pathname))}
                      className="w-7 h-7 rounded-full hover:bg-black/5 text-[14px]"
                      aria-label="Remove stickers on this page"
                      title="Clean up"
                    >
                      ↺
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      disarm();
                    }}
                    className="w-7 h-7 rounded-full hover:bg-black/5 text-[14px]"
                    aria-label="Close stickers"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <button
                onClick={togglePencil}
                aria-pressed={pencil}
                className={`w-full mb-2 flex items-center justify-between rounded-[10px] border px-2.5 py-1.5 font-['Work_Sans'] text-[12.5px] transition-colors ${pencil ? "border-black bg-[#FFE8C2]" : "border-black/15 hover:border-black/40"}`}
              >
                <span className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 34 34" aria-hidden><path d="M3 31 L7 21 L24 4 L30 10 L13 27 Z" fill="#FFC53D" stroke="#1d1a17" strokeWidth="2.4" strokeLinejoin="round" /><path d="M24 4 L30 10 L32 7 L27 2 Z" fill="#ff614c" stroke="#1d1a17" strokeWidth="2.4" strokeLinejoin="round" /></svg>
                  {isProfessional ? "pencil cursor" : "cursor → pencil"}
                </span>
                <span className={`w-9 h-5 rounded-full border border-black relative transition-colors ${pencil ? "bg-[#ff614c]" : "bg-white"}`}>
                  <span className={`absolute top-[2px] w-3 h-3 rounded-full bg-black transition-all ${pencil ? "left-[18px]" : "left-[2px]"}`} />
                </span>
              </button>
              <div className="grid grid-cols-5 gap-1.5">
                {KINDS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setArmed(armed === k ? null : k)}
                    aria-label={`${k} sticker`}
                    aria-pressed={armed === k}
                    className={`h-[46px] rounded-[10px] border flex items-center justify-center transition-all ${
                      armed === k ? "border-black bg-[#FFE8C2] -translate-y-0.5 shadow-[2px_2px_0_0_black]" : "border-black/10 hover:border-black/40"
                    }`}
                  >
                    <StickerArt kind={k} size={30} />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="pill"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 1.2 }}
              onClick={() => setOpen(true)}
              whileHover={{ rotate: -3, scale: 1.04 }}
              className="flex items-center gap-2 bg-[#fffaf1] border border-black rounded-full shadow-[3px_3px_0_0_black] pl-2 pr-4 py-1.5 font-['Shantell_Sans',cursive] text-[14px] text-black"
            >
              <StickerArt kind="star" size={26} />
              {isProfessional ? "doodle on my site" : "deface my site"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
