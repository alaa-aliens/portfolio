/*
 * "Meet the character": a stage with the character and a row of moods.
 * Tap a mood → the character swaps pose with a little bounce, says the line,
 * and plays the real recorded voice if there is one.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface Mood {
  img: string;
  label: string;
  when: string;
  line?: string;
  audio?: string;
}

export function useClip() {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const play = (src?: string) => {
    if (!src) return;
    ref.current?.pause();
    const a = new Audio(src);
    ref.current = a;
    setPlaying(src);
    a.onended = () => setPlaying(null);
    a.play().catch(() => setPlaying(null));
  };
  return { play, playing };
}

export function CharacterMoods({ name, intro, moods, color }: { name: string; intro: string; moods: Mood[]; color: string }) {
  const [i, setI] = useState(0);
  const [taps, setTaps] = useState(0);
  const { play, playing } = useClip();
  const m = moods[i];

  const pick = (k: number) => {
    setI(k);
    setTaps((t) => t + 1);
    play(moods[k].audio);
  };

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 md:gap-10 items-stretch">
      {/* Stage */}
      <div
        className="relative rounded-[22px] border-2 border-black overflow-hidden min-h-[360px] md:min-h-[440px] flex items-end justify-center"
        style={{ background: `radial-gradient(90% 80% at 50% 85%, ${color}55, ${color}18 70%, #fffaf1)` }}
      >
        <div aria-hidden className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[55%] h-5 rounded-full bg-black/10 blur-[2px]" />
        <AnimatePresence mode="popLayout">
          <motion.img
            key={m.img + taps}
            src={m.img}
            alt={`${name}: ${m.label}`}
            className="relative z-10 w-[72%] max-w-[300px] mb-4 select-none"
            draggable={false}
            initial={{ y: 40, scale: 0.85, opacity: 0, rotate: -4 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
            exit={{ y: 20, scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          />
        </AnimatePresence>

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {m.line && (
            <motion.div
              key={m.line + taps}
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.1 }}
              className="absolute z-20 top-5 left-4 right-4 md:left-6 md:right-auto md:max-w-[80%] bg-white border-2 border-black rounded-[18px] rounded-bl-[4px] px-4 py-2.5 shadow-[3px_3px_0_0_black]"
            >
              <p className="font-['Shantell_Sans',cursive] text-[15px] md:text-[17px] leading-snug">“{m.line}”</p>
              {m.audio && (
                <button
                  onClick={() => play(m.audio)}
                  className="mt-1.5 inline-flex items-center gap-1.5 font-['Work_Sans'] text-[12px] font-semibold uppercase tracking-wider text-[#ff614c]"
                >
                  {playing === m.audio ? <EqBars /> : "▶"} {playing === m.audio ? "playing" : "hear her say it"}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <span className="absolute z-20 bottom-3 right-4 font-['Shantell_Sans',cursive] text-[13px] text-black/55">{m.when}</span>
      </div>

      {/* Moods */}
      <div className="flex flex-col gap-4">
        <p className="font-['IBM_Plex_Serif'] text-[16px] md:text-[19px] leading-[1.65] text-black/85">{intro}</p>
        <div className="grid grid-cols-4 gap-2.5 md:gap-3">
          {moods.map((mm, k) => {
            const on = k === i;
            return (
              <motion.button
                key={mm.label}
                onClick={() => pick(k)}
                whileHover={{ y: -4, rotate: k % 2 ? 2 : -2 }}
                whileTap={{ scale: 0.94 }}
                aria-pressed={on}
                className={`relative flex flex-col items-center gap-1 rounded-[14px] border-2 pt-2 pb-2 px-1 transition-colors ${
                  on ? "border-black bg-white shadow-[3px_3px_0_0_black]" : "border-black/15 bg-[#fffaf1] hover:border-black/50"
                }`}
              >
                <img src={mm.img} alt="" className="w-[78%] aspect-square object-contain object-bottom" draggable={false} />
                <span className="font-['Work_Sans'] font-semibold text-[11px] md:text-[12px] leading-tight text-center">{mm.label}</span>
                {mm.audio && <span aria-hidden className="absolute top-1.5 right-2 text-[10px] text-[#ff614c]">♪</span>}
              </motion.button>
            );
          })}
        </div>
        <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/50">tap a mood · ♪ = her real recorded voice</p>
      </div>
    </div>
  );
}

export function EqBars() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3" aria-hidden>
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          className="w-[3px] bg-current rounded-sm"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: k * 0.12 }}
        />
      ))}
    </span>
  );
}
