/*
 * "How it sounds": the app's UI sounds (generated in code, same recipes as the app)
 * and a few of the character's recorded lines. Nothing plays until you tap.
 */
import { useState } from "react";
import { motion } from "motion/react";
import { EqBars, useClip } from "./CharacterMoods";

let ctx: AudioContext | null = null;
function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.12) {
  try {
    ctx = ctx ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    const c = ctx;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = c.currentTime + start;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* audio blocked: stay quiet */
  }
}
export type ToneName = "right" | "wrong" | "combo" | "done" | "coin" | "flip";
const TONES: Record<ToneName, { label: string; play: () => void; notes: number[] }> = {
  right: { label: "Right answer", notes: [784, 1175], play: () => { tone(784, 0, 0.12); tone(1175, 0.09, 0.2); } },
  wrong: { label: "Not quite (soft, never a buzzer)", notes: [330, 262], play: () => { tone(330, 0, 0.16, "triangle", 0.08); tone(262, 0.1, 0.22, "triangle", 0.07); } },
  combo: { label: "3 in a row", notes: [784, 988, 1175, 1568], play: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.07, 0.14, "sine", 0.1)) },
  done: { label: "Lesson done", notes: [523, 659, 784, 1047, 1319], play: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.3, "sine", 0.11)) },
  coin: { label: "Points", notes: [1319, 1760], play: () => { tone(1319, 0, 0.06, "square", 0.04); tone(1760, 0.05, 0.12, "square", 0.04); } },
  flip: { label: "Card flip", notes: [420, 620], play: () => { tone(420, 0, 0.08, "triangle", 0.05); tone(620, 0.05, 0.08, "triangle", 0.05); } },
};

function ToneButton({ name, color }: { name: ToneName; color: string }) {
  const t = TONES[name];
  const [k, setK] = useState(0);
  return (
    <motion.button
      onClick={() => {
        t.play();
        setK((n) => n + 1);
      }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="group flex flex-col gap-2 items-start rounded-[16px] border border-black bg-[#fffaf1] p-3 shadow-[3px_3px_0_0_black] text-left"
    >
      {/* the notes, drawn as dots on a little staff */}
      <span className="relative w-full h-10 rounded-[8px] overflow-hidden" style={{ background: `${color}22` }} aria-hidden>
        {t.notes.map((n, i) => (
          <motion.span
            key={`${i}-${k}`}
            className="absolute w-3 h-3 rounded-full border border-black"
            style={{ left: `${10 + (i / Math.max(1, t.notes.length - 1)) * 76}%`, bottom: `${8 + ((n - 250) / 1550) * 70}%`, background: color }}
            initial={k ? { scale: 0.4, y: 6 } : false}
            animate={{ scale: [1, 1.6, 1], y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          />
        ))}
      </span>
      <span className="font-['Work_Sans'] font-semibold text-[13px] leading-tight">▶ {t.label}</span>
    </motion.button>
  );
}

export function SoundBoard({
  intro,
  tones = [],
  voices = [],
  color,
}: {
  intro: string;
  tones?: ToneName[];
  voices?: { label: string; line: string; audio: string }[];
  color: string;
}) {
  const { play, playing } = useClip();
  return (
    <div className="flex flex-col gap-8">
      <p className="font-['IBM_Plex_Serif'] text-[16px] md:text-[19px] leading-[1.65] text-black/85 max-w-[720px]">{intro}</p>
      {tones.length > 0 && (
        <div>
          <p className="font-['Shantell_Sans',cursive] text-[14px] text-black/55 mb-3">UI sounds · made in code, tap to hear</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tones.map((t) => (
              <ToneButton key={t} name={t} color={color} />
            ))}
          </div>
        </div>
      )}
      {voices.length > 0 && (
        <div>
          <p className="font-['Shantell_Sans',cursive] text-[14px] text-black/55 mb-3">her voice · recorded once, never generated on the fly</p>
          <div className="flex flex-col gap-2.5">
            {voices.map((v) => {
              const on = playing === v.audio;
              return (
                <button
                  key={v.audio}
                  onClick={() => play(v.audio)}
                  className={`flex items-center gap-3 text-left rounded-full border border-black pl-2 pr-5 py-2 transition-colors ${on ? "bg-black text-white" : "bg-[#fffaf1] hover:bg-white"}`}
                >
                  <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${on ? "bg-[#ff614c] text-white" : "bg-black text-white"}`}>
                    {on ? <EqBars /> : "▶"}
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-['Work_Sans'] text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">{v.label}</span>
                    <span className="font-['Shantell_Sans',cursive] text-[15px] md:text-[16px] leading-snug">“{v.line}”</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
