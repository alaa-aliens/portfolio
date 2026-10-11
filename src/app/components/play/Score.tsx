/*
 * The site as a tiny game: three lives and a score, kept in localStorage.
 *  - points for exploring (a page, a case study, poking the guy, asking Ala'a)
 *  - a big bonus for getting in touch
 *  - a life lost for clicking things that don't exist yet (coming soon, 404)
 * `addScore` / `loseLife` can be called from anywhere; the HUD listens.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router";
import { useMode } from "../ModeContext";

const KEY = "alaa-game";
const EVT = "game:change";
type State = { points: number; lives: number; done: string[] };

function load(): State {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s && typeof s.points === "number") return { points: s.points, lives: s.lives ?? 3, done: s.done ?? [] };
  } catch {
    /* ignore */
  }
  return { points: 0, lives: 3, done: [] };
}
function save(s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: s }));
}

let last: { text: string; delta: number; kind: "point" | "life" | "bonus" } | null = null;
const toastEvt = "game:toast";
function toast(t: typeof last) {
  last = t;
  window.dispatchEvent(new CustomEvent(toastEvt, { detail: t }));
}

/** Add points once per `key` (pass no key to allow repeats). */
export function addScore(points: number, text: string, key?: string, bonus = false) {
  const s = load();
  if (key && s.done.includes(key)) return false;
  s.points += points;
  if (key) s.done.push(key);
  save(s);
  toast({ text, delta: points, kind: bonus ? "bonus" : "point" });
  return true;
}

export function loseLife(text: string) {
  const s = load();
  s.lives = Math.max(0, s.lives - 1);
  if (s.lives === 0) {
    toast({ text: "game over. just kidding, have your lives back.", delta: 0, kind: "life" });
    s.lives = 3;
    s.points = Math.max(0, s.points - 20);
  } else toast({ text, delta: -1, kind: "life" });
  save(s);
}

export function useGame() {
  const [state, setState] = useState<State>(() => load());
  useEffect(() => {
    const on = (e: Event) => setState((e as CustomEvent<State>).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  return state;
}

/** Awards points for pages as they're visited. Mount once. */
export function ScoreTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    const t = setTimeout(() => {
      if (pathname.startsWith("/work/")) addScore(10, "case study read", `cs:${pathname}`);
      else if (pathname === "/contact") addScore(5, "found the contact page", "page:/contact");
      else if (pathname !== "/") addScore(5, "new page explored", `page:${pathname}`);
    }, 1200);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

function Heart({ on }: { on: boolean }) {
  return (
    <motion.svg width="18" height="16" viewBox="0 0 18 16" aria-hidden animate={on ? { scale: [1, 1.15, 1] } : { scale: 0.9 }} transition={on ? { duration: 1.2, repeat: Infinity, repeatDelay: 2 } : {}}>
      <path d="M9 14.6 C 4.4 11.2, 1.3 8.4, 1.4 5.2 C 1.5 2.9, 3.3 1.3, 5.3 1.4 C 6.9 1.4, 8.1 2.4, 9 3.7 C 9.9 2.4, 11.2 1.3, 12.8 1.4 C 14.8 1.4, 16.6 3, 16.6 5.3 C 16.6 8.5, 13.5 11.3, 9 14.6 Z" fill={on ? "#ff614c" : "none"} stroke="#1d1a17" strokeWidth="1.4" strokeLinejoin="round" strokeDasharray={on ? undefined : "2 2"} />
    </motion.svg>
  );
}

/** Lives + score in the navbar, with a little toast when something happens. */
export function ScoreHUD({ compact = false }: { compact?: boolean }) {
  const { points, lives } = useGame();
  const { isProfessional } = useMode();
  const [msg, setMsg] = useState<typeof last>(null);
  const [bump, setBump] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const shown = useRef(points);

  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<typeof last>).detail);
      setBump((b) => b + 1);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 2600);
    };
    window.addEventListener(toastEvt, on);
    return () => window.removeEventListener(toastEvt, on);
  }, []);

  // count up to the new score
  const [display, setDisplay] = useState(points);
  useEffect(() => {
    let raf = 0;
    const from = shown.current;
    const to = points;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 500);
      setDisplay(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
      else shown.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [points]);

  return (
    <div className="relative flex items-center gap-2.5" title={isProfessional ? "Points for exploring. Lives for clicking things that aren't there yet." : "it's a game now. deal with it."}>
      <span className="flex items-center gap-0.5" aria-label={`${lives} lives`}>
        {[0, 1, 2].map((i) => (
          <Heart key={i} on={i < lives} />
        ))}
      </span>
      <motion.span
        key={bump}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 0.35 }}
        className={`font-display tabular-nums leading-none text-[#1d1a17] ${compact ? "text-[18px]" : "text-[20px] md:text-[22px]"}`}
        aria-label={`${points} points`}
      >
        {display}
        <span className="font-['Work_Sans'] text-[10px] uppercase tracking-[0.15em] text-black/50 ml-1">pts</span>
      </motion.span>

      <AnimatePresence>
        {msg && (
          <motion.div
            key={bump}
            initial={{ opacity: 0, y: 6, rotate: -2, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className={`absolute top-full right-0 mt-2 whitespace-nowrap rounded-full border border-black px-3 py-1.5 font-['Shantell_Sans',cursive] text-[13px] shadow-[3px_3px_0_0_#1d1a17] ${
              msg.kind === "bonus" ? "bg-[#FFC53D] text-black" : msg.kind === "life" ? "bg-[#1d1a17] text-[#fffaf1]" : "bg-[#fffaf1] text-black"
            }`}
          >
            {msg.delta > 0 ? `+${msg.delta} · ` : msg.delta < 0 ? "−1 life · " : ""}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
