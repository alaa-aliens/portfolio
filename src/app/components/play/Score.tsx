import { play } from "./sfx";
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
    if (s && typeof s.points === "number") return { points: s.points, lives: s.lives ?? 1, done: s.done ?? [] };
  } catch {
    /* ignore */
  }
  return { points: 0, lives: 1, done: [] };
}
function save(s: State) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: s }));
}

/** Points at which a heart fills up. */
const HEART_AT = [30, 80, 150];
let last: { text: string; delta: number; kind: "point" | "life" | "bonus" | "heart" } | null = null;
const toastEvt = "game:toast";
function toast(t: typeof last) {
  last = t;
  window.dispatchEvent(new CustomEvent(toastEvt, { detail: t }));
}

/** Add points once per `key` (pass no key to allow repeats). */
export function addScore(points: number, text: string, key?: string, bonus = false) {
  const s = load();
  if (key && s.done.includes(key)) return false;
  const before = s.points;
  s.points += points;
  if (key) s.done.push(key);
  // hearts fill up as you explore: one at each milestone, up to 3
  const earned = HEART_AT.filter((m) => before < m && s.points >= m).length;
  if (earned > 0 && s.lives < 3) {
    s.lives = Math.min(3, s.lives + earned);
    save(s);
    toast({ text, delta: points, kind: bonus ? "bonus" : "point" });
    play(bonus ? "party" : "coin", 0.35);
    window.setTimeout(() => {
      toast({ text: s.lives === 3 ? "all hearts full. show-off." : "heart earned", delta: 0, kind: "heart" });
      play("heart", 0.5);
    }, 1500);
    return true;
  }
  save(s);
  toast({ text, delta: points, kind: bonus ? "bonus" : "point" });
  play(bonus ? "party" : "coin", bonus ? 0.5 : 0.35);
  return true;
}

export function loseLife(text: string) {
  const s = load();
  s.lives = Math.max(0, s.lives - 1);
  if (s.lives === 0) {
    toast({ text: "game over. just kidding, have one back.", delta: 0, kind: "life" });
    s.lives = 1;
    s.points = Math.max(0, s.points - 20);
  } else toast({ text, delta: -1, kind: "life" });
  play("lose", 0.45);
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
    try {
      if (localStorage.getItem("alaa-game-hello")) return;
      localStorage.setItem("alaa-game-hello", "1");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => toast({ text: "one heart. explore to fill the rest. tap ❤ to see how", delta: 0, kind: "point" }), 2500);
    return () => clearTimeout(t);
  }, []);
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
const RULES = {
  earn: [
    { k: "page:", pts: 5, pro: "open a page you haven't seen", fun: "wander into a new page" },
    { k: "cs:", pts: 10, pro: "read a case study", fun: "actually read a case study" },
    { k: "ask:first", pts: 5, pro: "ask me something (bottom right)", fun: "talk to the floating head" },
    { k: "sketch:shuffle", pts: 2, pro: "shuffle the sketchbook", fun: "make a mess of the sketchbook" },
    { k: "poke", pts: 1, pro: "poke me on the home page (repeatable)", fun: "poke me. again. (repeatable)" },
    { k: "contact:open", pts: 25, pro: "open the contact form", fun: "open the contact form (bonus)" },
    { k: "contact:copy", pts: 50, pro: "copy my email", fun: "copy my email (bigger bonus)" },
    { k: "contact:sent", pts: 100, pro: "actually write to me", fun: "actually write to me (jackpot)" },
  ],
  lose: [
    { pro: "click a project whose case study isn't written yet", fun: "click a project I haven't written up yet" },
    { pro: "land on a page that doesn't exist", fun: "find a 404" },
  ],
};

function Rules({ onClose, done }: { onClose: () => void; done: string[] }) {
  const { isProfessional } = useMode();
  const got = (k: string) => (k === "poke" ? false : done.some((d) => d.startsWith(k)));
  return (
    <motion.div
      role="dialog"
      aria-label="How the points work"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="absolute top-full right-0 mt-3 w-[min(92vw,360px)] rounded-[16px] border border-black bg-[#fffaf1] shadow-[4px_4px_0_0_#1d1a17] p-5 text-left z-[90] cursor-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-[26px] leading-none text-[#ff614c] lowercase">{isProfessional ? "how this works" : "yes, it's a game"}</p>
        <button onClick={onClose} aria-label="Close" className="w-7 h-7 rounded-full border border-black text-[13px] leading-none hover:rotate-90 transition-transform">✕</button>
      </div>
      <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/60 mt-1">
        {isProfessional ? "You start with one heart. Points fill the others (at 30, 80 and 150). Ticks are things you've already done." : "one heart to start. points fill the rest (30 · 80 · 150). ticks = already done, show-off."}
      </p>
      <p className="font-['Work_Sans'] uppercase tracking-[0.18em] text-[10px] text-black/45 mt-4 mb-1.5">{isProfessional ? "Earn" : "Get points"}</p>
      <ul className="flex flex-col gap-1">
        {RULES.earn.map((r) => (
          <li key={r.k} className={`flex items-center gap-2 font-['Work_Sans'] text-[13px] ${got(r.k) ? "text-black/45 line-through decoration-[#ff614c]" : "text-black"}`}>
            <span className={`w-9 shrink-0 font-display text-[16px] ${r.pts >= 25 ? "text-[#E9A21B]" : "text-[#ff614c]"}`}>+{r.pts}</span>
            <span className="flex-1">{isProfessional ? r.pro : r.fun}</span>
            {got(r.k) && <span className="text-[#53B858]">✓</span>}
          </li>
        ))}
      </ul>
      <p className="font-['Work_Sans'] uppercase tracking-[0.18em] text-[10px] text-black/45 mt-4 mb-1.5">{isProfessional ? "Lose a heart" : "Lose a heart"}</p>
      <ul className="flex flex-col gap-1">
        {RULES.lose.map((r, i) => (
          <li key={i} className="flex items-center gap-2 font-['Work_Sans'] text-[13px] text-black">
            <span className="w-9 shrink-0"><Heart on /></span>
            <span>{isProfessional ? r.pro : r.fun}</span>
          </li>
        ))}
      </ul>
      <p className="font-['Shantell_Sans',cursive] text-[12px] text-black/50 mt-3">{isProfessional ? "Lose them all and you respawn with one, minus 20 points. No real consequences. It's a portfolio." : "lose them all → respawn with one, −20 pts. it's a portfolio, not dark souls."}</p>
    </motion.div>
  );
}

export function ScoreHUD({ compact = false }: { compact?: boolean }) {
  const { points, lives, done } = useGame();
  const { isProfessional } = useMode();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);
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
    <div className="relative">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
      aria-expanded={open}
      className="relative flex items-center gap-2.5 rounded-full px-2 py-1 -mx-2 hover:bg-[#fffaf1]/70 transition-colors"
      title={isProfessional ? "How the points work" : "what is this?"}
    >
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
      <span className="hidden md:inline-flex w-4 h-4 rounded-full border border-black/60 text-[10px] items-center justify-center font-['Work_Sans'] text-black/60" aria-hidden>?</span>
    </button>

      <AnimatePresence>
        {msg && (
          <motion.div
            key={bump}
            initial={{ opacity: 0, y: 6, rotate: -2, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className={`absolute top-full right-0 mt-2 whitespace-nowrap rounded-full border border-black px-3 py-1.5 font-['Shantell_Sans',cursive] text-[13px] shadow-[3px_3px_0_0_#1d1a17] ${
              msg.kind === "bonus" ? "bg-[#FFC53D] text-black" : msg.kind === "life" ? "bg-[#1d1a17] text-[#fffaf1]" : msg.kind === "heart" ? "bg-[#ff614c] text-white" : "bg-[#fffaf1] text-black"
            }`}
          >
            {msg.delta > 0 ? `+${msg.delta} · ` : msg.delta < 0 ? "−1 heart · " : msg.kind === "heart" ? "❤ " : ""}
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{open && <Rules onClose={() => setOpen(false)} done={done} />}</AnimatePresence>
    </div>
  );
}
