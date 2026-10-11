/*
 * FIND THE BUTTON — a tiny game about UX crimes.
 * Each level is a fake screen. One thing is the real button; the rest are traps
 * (links that look like buttons, buttons that look like text, a cookie banner…).
 * A patience bar drains; the user rage-quits when it's empty. Score = levels cleared.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMode } from "../ModeContext";
import { StickerArt } from "./Stickers";

interface Item { label: string; x: number; y: number; w: number; real?: boolean; style: "btn" | "ghost" | "link" | "text" | "banner" | "toggle" | "icon"; why?: string }
interface Level { title: string; task: string; items: Item[]; lesson: string }

const LEVELS: Level[] = [
  {
    title: "The checkout",
    task: "Pay for the thing.",
    items: [
      { label: "Continue", x: 8, y: 20, w: 28, style: "ghost", why: "Grey outline. Looks disabled. It's a link to the FAQ." },
      { label: "PAY NOW", x: 56, y: 20, w: 36, style: "link", why: "It's underlined text pretending to be a button. Goes to 'About us'." },
      { label: "Place order", x: 30, y: 64, w: 40, style: "btn", real: true },
      { label: "Apply promo code", x: 8, y: 44, w: 44, style: "text", why: "Plain text that is actually a button. Opens a modal. Nobody asked." },
    ],
    lesson: "One clear primary action. Everything else should look less important than it.",
  },
  {
    title: "The cookie wall",
    task: "Read the article.",
    items: [
      { label: "Accept all", x: 8, y: 70, w: 38, style: "btn", why: "The big one. Sells your data to 1,432 partners." },
      { label: "Manage preferences", x: 52, y: 72, w: 42, style: "text", why: "Opens 9 toggles. All on. Each with its own 'save'." },
      { label: "✕", x: 88, y: 6, w: 8, style: "icon", real: true },
      { label: "Learn more", x: 8, y: 30, w: 30, style: "link", why: "A 14-page policy. In Latin, basically." },
    ],
    lesson: "If 'no' is harder than 'yes', that's a dark pattern, not a design.",
  },
  {
    title: "The settings page",
    task: "Turn off notifications.",
    items: [
      { label: "Notifications  ●", x: 8, y: 16, w: 50, style: "toggle", why: "This toggle shows the state. It doesn't change it." },
      { label: "Save changes", x: 8, y: 70, w: 36, style: "ghost", why: "Disabled until you change something. You didn't. You can't." },
      { label: "Off", x: 64, y: 16, w: 16, style: "text", real: true },
      { label: "Delete account", x: 56, y: 70, w: 38, style: "btn", why: "Bright red. Very confident. Very wrong." },
    ],
    lesson: "The destructive action should never be the loudest thing on the screen.",
  },
  {
    title: "The Arabic app",
    task: "Go back.",
    items: [
      { label: "→", x: 86, y: 6, w: 10, style: "icon", why: "Forward arrow on a back button, because someone just flipped the English layout." },
      { label: "←", x: 4, y: 6, w: 10, style: "icon", real: true },
      { label: "رجوع", x: 36, y: 40, w: 28, style: "link", why: "Says 'back'. Opens the menu. Mirrored, not localised." },
      { label: "Skip", x: 60, y: 72, w: 28, style: "ghost", why: "Skips the onboarding you already skipped." },
    ],
    lesson: "RTL is a different design, not a mirror. Arrows, icons and reading order all move.",
  },
  {
    title: "The pop-up festival",
    task: "Close the newsletter pop-up.",
    items: [
      { label: "No thanks, I hate savings", x: 8, y: 72, w: 60, style: "text", why: "Confirm-shaming. Also it reopens in 4 seconds." },
      { label: "Subscribe", x: 30, y: 44, w: 40, style: "btn", why: "The only thing that looks clickable. On purpose." },
      { label: "×", x: 90, y: 4, w: 7, style: "icon", real: true },
      { label: "Maybe later", x: 8, y: 20, w: 34, style: "ghost", why: "'Later' means 'every page load'." },
    ],
    lesson: "A close button is a promise. Make it obvious, make it work the first time.",
  },
];

const PATIENCE = 7; // seconds per level

export function FindTheButton() {
  const { isProfessional } = useMode();
  const [level, setLevel] = useState(0);
  const [state, setState] = useState<"intro" | "play" | "won" | "lost" | "done">("intro");
  const [patience, setPatience] = useState(PATIENCE);
  const [msg, setMsg] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(0);
  const raf = useRef(0);
  const L = LEVELS[level];

  useEffect(() => {
    if (state !== "play") return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPatience((p) => {
        const n = p - dt;
        if (n <= 0) {
          setState("lost");
          return 0;
        }
        return n;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [state]);

  const start = (lv = 0) => {
    setLevel(lv);
    setPatience(PATIENCE);
    setMsg(null);
    setState("play");
  };
  const pick = (it: Item) => {
    if (state !== "play") return;
    if (it.real) {
      setScore((s) => s + 1 + Math.round(patience));
      setState("won");
      return;
    }
    setShake((k) => k + 1);
    setMsg(it.why ?? "Nope.");
    setPatience((p) => Math.max(0.01, p - 1.6));
  };
  const next = () => (level + 1 < LEVELS.length ? start(level + 1) : setState("done"));

  const face = state === "won" ? "cheer" : state === "lost" ? "sad" : patience < 2.5 ? "angry" : "ok";

  return (
    <div className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 md:gap-10 items-start">
      {/* The fake screen */}
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="relative rounded-[22px] border-2 border-black bg-[#fffaf1] shadow-[5px_6px_0_0_#1d1a17] overflow-hidden"
      >
        {/* window chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-black bg-[#FFE9C7]">
          <span className="w-3 h-3 rounded-full bg-[#ff614c] border border-black" /><span className="w-3 h-3 rounded-full bg-[#FFC53D] border border-black" /><span className="w-3 h-3 rounded-full bg-[#53B858] border border-black" />
          <span className="ml-2 font-['Work_Sans'] text-[12px] text-black/60 truncate">{state === "intro" ? "find-the-button.app" : L.title.toLowerCase().replace(/ /g, "-") + ".app"}</span>
          {state === "play" && (
            <span className="ml-auto font-['Work_Sans'] font-semibold text-[12px] uppercase tracking-wider">Level {level + 1}/{LEVELS.length}</span>
          )}
        </div>

        <div className="relative aspect-[4/3] md:aspect-[16/10]">
          <AnimatePresence mode="wait">
            {state === "intro" && (
              <motion.div key="intro" className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StickerArt kind="bolt" size={56} />
                <h3 className="font-display lowercase text-[36px] md:text-[52px] leading-none text-[#ff614c]">find the button</h3>
                <p className="font-['IBM_Plex_Serif'] text-[15px] md:text-[17px] max-w-[380px]">
                  {isProfessional
                    ? "Five screens, each full of UX crimes. Find the one real button before the user runs out of patience."
                    : "Five cursed screens. One real button each. The user is losing patience. So am I."}
                </p>
                <button onClick={() => start(0)} className="mt-2 bg-[#1d1a17] text-[#fffaf1] border-2 border-black rounded-full px-7 py-3 font-['DM_Serif_Display'] text-[19px] shadow-[4px_4px_0_0_#ff614c] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#ff614c] transition-all">
                  Start →
                </button>
              </motion.div>
            )}

            {(state === "play" || state === "won" || state === "lost") && (
              <motion.div key={`lv-${level}-${state}`} className="absolute inset-0" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                {/* fake page scaffolding */}
                <div className="absolute left-[8%] top-[6%] w-[40%] h-[7%] rounded bg-black/10" />
                <div className="absolute left-[8%] top-[88%] w-[60%] h-[4%] rounded bg-black/8" />
                <p className="absolute left-0 right-0 top-[4%] text-center font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] text-black/60">task: {L.task}</p>
                {L.items.map((it) => (
                  <motion.button
                    key={it.label + level}
                    type="button"
                    disabled={state !== "play"}
                    onClick={() => pick(it)}
                    whileHover={state === "play" ? { scale: 1.04 } : undefined}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute font-['Work_Sans'] text-[13px] md:text-[14px] leading-none ${styleOf(it.style)} ${state !== "play" && it.real ? "ring-4 ring-[#53B858] ring-offset-2" : ""}`}
                    style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.style === "icon" ? undefined : `${it.w}%` }}
                  >
                    {it.label}
                  </motion.button>
                ))}
                {msg && state === "play" && (
                  <motion.p key={msg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="absolute left-3 right-3 bottom-3 bg-[#1d1a17] text-[#fffaf1] rounded-[12px] px-3 py-2 font-['Shantell_Sans',cursive] text-[13px] md:text-[14px]">
                    {msg}
                  </motion.p>
                )}
                {state !== "play" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-x-4 bottom-4 md:inset-x-8 bg-white border-2 border-black rounded-[16px] p-4 shadow-[4px_4px_0_0_#1d1a17]">
                    <p className="font-display lowercase text-[24px] md:text-[30px] leading-none" style={{ color: state === "won" ? "#53B858" : "#ff614c" }}>
                      {state === "won" ? (isProfessional ? "found it!" : "finally!!") : isProfessional ? "they rage-quit." : "RAGE QUIT. classic."}
                    </p>
                    <p className="font-['IBM_Plex_Serif'] text-[14px] md:text-[15px] mt-1.5 leading-snug">{L.lesson}</p>
                    <div className="flex gap-2 mt-3">
                      {state === "won" ? (
                        <button onClick={next} className="bg-[#1d1a17] text-[#fffaf1] border-2 border-black rounded-full px-4 py-2 font-['DM_Serif_Display'] text-[15px]">
                          {level + 1 < LEVELS.length ? "Next level →" : "See score →"}
                        </button>
                      ) : (
                        <button onClick={() => start(level)} className="bg-[#1d1a17] text-[#fffaf1] border-2 border-black rounded-full px-4 py-2 font-['DM_Serif_Display'] text-[15px]">Try again ↻</button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {state === "done" && (
              <motion.div key="done" className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StickerArt kind="crown" size={56} />
                <p className="font-display lowercase text-[40px] md:text-[56px] leading-none text-[#ff614c]">{score} points</p>
                <p className="font-['IBM_Plex_Serif'] text-[15px] md:text-[17px] max-w-[360px]">
                  {score > 45 ? (isProfessional ? "You'd pass my UX audit. Want a job?" : "Ok you're hired. Unpaid, but hired.") : score > 25 ? (isProfessional ? "Solid. Most real products do worse." : "Not bad. Most real apps do worse. Much worse.") : isProfessional ? "The screens were cursed. Try again." : "It's ok. The screens were evil. That's the point."}
                </p>
                <button onClick={() => { setScore(0); start(0); }} className="mt-2 bg-[#1d1a17] text-[#fffaf1] border-2 border-black rounded-full px-6 py-2.5 font-['DM_Serif_Display'] text-[17px]">Play again ↻</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Side: the user + patience */}
      <div className="flex flex-col gap-5">
        <div className="rounded-[20px] border-2 border-black bg-[#fffaf1] p-5 shadow-[4px_5px_0_0_#1d1a17]">
          <div className="flex items-center gap-4">
            <UserFace mood={face} />
            <div className="min-w-0">
              <p className="font-['Playfair_Display'] font-bold text-[18px] leading-tight">{isProfessional ? "The user" : "Tariq, 53"}</p>
              <p className="font-['Shantell_Sans',cursive] text-[13.5px] text-black/60 leading-snug">
                {state === "play" ? (patience < 2.5 ? (isProfessional ? "Losing patience…" : "about to throw the phone") : isProfessional ? "Looking for the button." : "where. is. it.") : state === "won" ? (isProfessional ? "Relieved." : "ok that was fine actually") : state === "lost" ? (isProfessional ? "Gone. Left a 1-star review." : "left. wrote a 1★ review. in caps.") : isProfessional ? "Ready when you are." : "just wants to pay for a thing"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between font-['Work_Sans'] text-[11px] uppercase tracking-wider text-black/50 mb-1">
              <span>patience</span><span>{Math.ceil(patience)}s</span>
            </div>
            <div className="h-4 rounded-full border-2 border-black bg-white overflow-hidden">
              <motion.div className="h-full" style={{ width: `${(patience / PATIENCE) * 100}%`, background: patience < 2.5 ? "#ff614c" : patience < 4.5 ? "#FFC53D" : "#53B858" }} transition={{ duration: 0.1 }} />
            </div>
          </div>
          <div className="flex justify-between mt-4 font-['Work_Sans'] text-[13px]">
            <span className="text-black/60">score</span><span className="font-semibold tabular-nums">{score}</span>
          </div>
        </div>
        <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/50">
          {isProfessional ? "Every trap is a real pattern I've seen in a real product." : "every trap here is something a client has asked me to build. I said no. mostly."}
        </p>
      </div>
    </div>
  );
}

function styleOf(s: Item["style"]) {
  switch (s) {
    case "btn": return "rounded-[10px] border-2 border-black bg-[#ff614c] text-white px-3 py-2.5 shadow-[3px_3px_0_0_#1d1a17] font-semibold";
    case "ghost": return "rounded-[10px] border border-black/30 text-black/45 px-3 py-2.5 bg-white";
    case "link": return "underline underline-offset-4 decoration-2 text-[#0a84ff] px-1 py-2 font-semibold text-left";
    case "text": return "text-left px-1 py-2 text-black/80";
    case "banner": return "rounded bg-black text-white px-3 py-2";
    case "toggle": return "rounded-full border-2 border-black bg-white px-3 py-2 text-left";
    case "icon": return "w-9 h-9 rounded-full border-2 border-black bg-white text-[18px] font-bold flex items-center justify-center";
  }
}

function UserFace({ mood }: { mood: "ok" | "angry" | "cheer" | "sad" }) {
  return (
    <motion.svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden animate={mood === "angry" ? { rotate: [0, -6, 6, -4, 0] } : mood === "cheer" ? { y: [0, -8, 0] } : {}} transition={{ duration: 0.5, repeat: mood === "angry" ? Infinity : 0 }}>
      <circle cx="32" cy="34" r="22" fill="#fffaf1" stroke="#1d1a17" strokeWidth="2.4" />
      <path d="M12 30a22 22 0 0 1 40 0z" fill="#6A4CFF" stroke="#1d1a17" strokeWidth="2.4" />
      <circle cx="24" cy="36" r="2.4" fill="#1d1a17" /><circle cx="40" cy="36" r="2.4" fill="#1d1a17" />
      {mood === "angry" && <path d="M18 29l9 4M46 29l-9 4" stroke="#1d1a17" strokeWidth="2.4" strokeLinecap="round" />}
      {mood === "ok" && <path d="M26 44q6 3 12 0" stroke="#1d1a17" strokeWidth="2.2" strokeLinecap="round" />}
      {mood === "angry" && <path d="M25 47q7-5 14 0" stroke="#ff614c" strokeWidth="2.4" strokeLinecap="round" />}
      {mood === "cheer" && <path d="M23 43q9 9 18 0" stroke="#53B858" strokeWidth="2.6" strokeLinecap="round" />}
      {mood === "sad" && <><path d="M25 48q7-6 14 0" stroke="#1d1a17" strokeWidth="2.2" strokeLinecap="round" /><path d="M44 40l1 6" stroke="#02B5C9" strokeWidth="2.4" strokeLinecap="round" /></>}
    </motion.svg>
  );
}
