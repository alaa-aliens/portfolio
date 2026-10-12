import { play } from "../components/play/sfx";
import imgHeadCut from "../../assets/head.webp";
/*
 * Contact as a postcard. You stamp what it's about, write on the lines,
 * sign it, and hit send: the postcard folds into a paper plane and flies
 * to Ala'a (who's sitting on the floor waiting for it). Then your mail app
 * opens with the same words in it.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { Doodle, Reveal } from "../components/motion/Doodles";
import { Button, Eyebrow, Prose, Scribble } from "../components/ui/Kit";
import { RoughBox } from "../components/ui/RoughBox";
import { StickerArt, type Kind } from "../components/play/Stickers";
import { addScore } from "../components/play/Score";
import { usePageMeta } from "../usePageMeta";
import imgContact from "../../assets/covers/contact.webp";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

const EMAIL = "alaa@alaa-ali.com";

const STAMPS: { k: string; pro: string; fun: string; kind: Kind; color: string }[] = [
  { k: "project", kind: "star", color: "#FFC53D", pro: "a product that needs design", fun: "my app is ugly, help" },
  { k: "audit", kind: "bolt", color: "#FF9F1C", pro: "a UX audit", fun: "tell me what's wrong" },
  { k: "workshop", kind: "sparkle", color: "#6A4CFF", pro: "a workshop or a talk", fun: "come talk at my people" },
  { k: "hello", kind: "heart", color: "#FF4C79", pro: "just saying hi", fun: "no reason. vibes." },
];

function Stamp({ s, on, onClick, label }: { s: (typeof STAMPS)[number]; on: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      whileHover={{ rotate: -3, scale: 1.04 }}
      whileTap={{ scale: 0.92 }}
      animate={on ? { rotate: [0, -6, 4, -2], scale: [1, 1.15, 1] } : { rotate: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col items-center gap-1.5 w-[86px] md:w-[96px] py-2.5 px-1 text-center ${on ? "" : "opacity-70 hover:opacity-100"}`}
      style={{
        border: `2px ${on ? "solid" : "dashed"} ${on ? s.color : "rgba(29,26,23,.35)"}`,
        borderRadius: "8px",
        background: on ? `${s.color}22` : "transparent",
        boxShadow: on ? `0 0 0 3px #fffaf1, 0 0 0 4px ${s.color}` : "none",
      }}
    >
      <StickerArt kind={s.kind} size={30} />
      <span className="font-['Shantell_Sans',cursive] text-[10.5px] md:text-[11px] leading-tight text-black/80">{label}</span>
      {on && (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -14 }}
          className="absolute -top-2 -right-2 rounded-full bg-[#ff614c] text-white font-['Work_Sans'] text-[9px] font-bold px-1.5 py-0.5"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}

export function ContactPage() {
  const { isProfessional } = useMode();
  const [stamp, setStamp] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [flying, setFlying] = useState(false);
  const [landed, setLanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  usePageMeta({ title: "Contact · Ala'a Ali", description: "Hire Ala'a for product design, UX audits, workshops, or just say hi. Amman, Jordan." });

  const chosen = STAMPS.find((s) => s.k === stamp);
  const ready = msg.trim().length > 3;

  const send = () => {
    if (!ready || flying) return;
    setFlying(true);
    play("whoosh", 0.5);
    addScore(100, "you actually wrote. jackpot!", "contact:sent", true);
    const subject = encodeURIComponent(chosen ? `About ${isProfessional ? chosen.pro : chosen.fun}` : "Hello from your website");
    const body = encodeURIComponent(`${msg.trim()}\n\n— ${name.trim() || "someone from your website"}`);
    window.setTimeout(() => {
      setLanded(true);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    }, 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      addScore(50, "copied my email. bonus!", "contact:copy", true);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the address is visible */
    }
  };

  return (
    <article className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[150px] pb-8 overflow-x-clip">
      {/* title */}
      <section className="relative">
        <Doodle kind="heart" className="right-4 md:right-[30%] top-[-10px]" size={38} color="#FF4C79" />
        <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Contact" : "Say hi"}</Eyebrow></Reveal>
        <DoodleTitle as="h1" text={isProfessional ? "send me a {heart} postcard" : "throw me a {heart} paper plane"} className="text-[44px] md:text-[80px]" />
        <Reveal delay={0.15}>
          <Prose lead className="mt-5 max-w-[640px]">
            {isProfessional
              ? "Apps, dashboards, audits, workshops, or a second opinion on your UX. Stamp it, write it, send it. It opens in your mail app with the same words."
              : "Stamp it, scribble it, send it. It turns into a paper plane and lands in my inbox. Mostly."}
          </Prose>
        </Reveal>
      </section>

      {/* the postcard + me */}
      <section className="relative grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-6 items-end mt-10 md:mt-14">
        {/* postcard */}
        <div className="relative">
          <AnimatePresence>
            {!landed && (
              <motion.div
                ref={cardRef}
                key="card"
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                animate={
                  flying
                    ? { opacity: [1, 1, 0], x: ["0%", "40%", "120%"], y: ["0%", "-30%", "-10%"], rotate: [-1, 12, 30], scale: [1, 0.6, 0.2] }
                    : { opacity: 1, y: 0, x: 0, rotate: -1, scale: 1 }
                }
                exit={{ opacity: 0 }}
                transition={flying ? { duration: 1.4, ease: [0.5, 0, 0.75, 0] } : { type: "spring", stiffness: 140, damping: 16 }}
                className="origin-right"
              >
                <RoughBox id="postcard" fill="#fffaf1" radius={8} strokeWidth={1.6} roughness={1.3} className="p-5 md:p-8">
                  {/* stamps row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Scribble className="mb-2">{isProfessional ? "stamp what it's about" : "pick a stamp"}</Scribble>
                      <div className="flex flex-wrap gap-2.5">
                        {STAMPS.map((s) => (
                          <Stamp key={s.k} s={s} on={stamp === s.k} onClick={() => setStamp(stamp === s.k ? null : s.k)} label={isProfessional ? s.pro : s.fun} />
                        ))}
                      </div>
                    </div>
                    {/* postage */}
                    <div className="hidden sm:flex flex-col items-center shrink-0 w-[92px] border-2 border-dashed border-black/30 rounded-[4px] p-2 rotate-3">
                      <span className="w-[62px] h-[74px] overflow-hidden rounded-[2px] bg-[#FFE9C7] relative">
                        <img alt="" src={imgHeadCut} className="absolute inset-0 w-full h-full object-contain max-w-none" />
                      </span>
                      <span className="font-['Work_Sans'] text-[9px] uppercase tracking-[0.14em] text-black/50 mt-1.5">Amman · JO</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-black/25 my-5" />

                  {/* lines */}
                  <label className="block">
                    <span className="sr-only">Your message</span>
                    <textarea
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      rows={5}
                      placeholder={isProfessional ? "Dear Ala'a, we're building…" : "dear ala'a, my app does a thing and the thing is bad…"}
                      className="w-full resize-none bg-transparent outline-none font-['Shantell_Sans',cursive] text-[17px] md:text-[20px] leading-[2.05] text-black placeholder:text-black/30"
                      style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent calc(2.05em - 1px), rgba(29,26,23,.22) calc(2.05em - 1px), rgba(29,26,23,.22) 2.05em)", backgroundAttachment: "local" }}
                    />
                  </label>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    <label className="flex-1 flex items-baseline gap-2">
                      <span className="font-['Shantell_Sans',cursive] text-[14px] text-black/50 shrink-0">— from</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isProfessional ? "your name" : "a mysterious stranger"}
                        className="w-full bg-transparent outline-none border-b border-black/40 focus:border-[#ff614c] font-['Shantell_Sans',cursive] text-[16px] md:text-[18px] text-black placeholder:text-black/30 py-1"
                      />
                    </label>
                    <span className={ready ? "" : "opacity-40 pointer-events-none"}>
                      <Button tone="coral" onClick={send}>
                        {isProfessional ? "send it" : "yeet it"}
                        <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden>
                          <path d="M2 11 L23 2 L16 20 L12 13 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="#fffaf1" />
                          <path d="M12 13 L23 2" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      </Button>
                    </span>
                  </div>
                </RoughBox>
              </motion.div>
            )}
          </AnimatePresence>

          {landed && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-10">
              <DoodleTitle text={isProfessional ? "it {heart} landed" : "nice {heart} throw"} className="text-[40px] md:text-[64px]" />
              <Prose className="mt-4 max-w-[560px]">
                {isProfessional
                  ? "Your mail app should be open with the postcard in it. If it isn't, the address is right below. I reply within a day or two, Amman time."
                  : "Your mail app should have the whole thing. If not, the address is below. I reply within a day or two, Amman time, coffee permitting."}
              </Prose>
              <button onClick={() => { setLanded(false); setFlying(false); setMsg(""); }} className="mt-5 font-['Shantell_Sans',cursive] text-[15px] text-[#ff614c] underline underline-offset-4">
                {isProfessional ? "write another" : "throw another one"}
              </button>
            </motion.div>
          )}
        </div>

        {/* me, waiting for it */}
        <motion.div
          className="relative w-full max-w-[440px] mx-auto lg:mx-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
        >
          <motion.img
            src={imgContact}
            alt="Ala'a sitting on the floor, throwing a paper plane, with his cat"
            className="relative w-full h-auto"
            animate={flying || landed ? { rotate: [0, -4, 3, 0], scale: [1, 1.04, 1] } : { y: [0, -5, 0] }}
            transition={flying || landed ? { duration: 0.8, delay: 1.1 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <AnimatePresence>
            {landed && (
              <motion.span
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: -4 }}
                exit={{ scale: 0 }}
                className="absolute top-[8%] right-[4%] rounded-[16px] border border-black bg-white px-4 py-2 font-['Shantell_Sans',cursive] text-[15px] shadow-[3px_3px_0_0_#1d1a17]"
              >
                {isProfessional ? "got it. reading." : "caught it! 🫡"}
              </motion.span>
            )}
          </AnimatePresence>
          <Scribble className="text-center mt-2">{isProfessional ? "Amman, Jordan · GMT+3 · replies in a day or two" : "amman · gmt+3 · replies between coffees"}</Scribble>
        </motion.div>
      </section>

      {/* email + elsewhere */}
      <section className="mt-20 md:mt-28 grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 border-t border-black/20 pt-10">
        <div>
          <Scribble className="mb-2">{isProfessional ? "or the old-fashioned way" : "allergic to postcards?"}</Scribble>
          <button onClick={copy} className="group inline-flex items-baseline gap-3 text-left">
            <span className="font-display text-[30px] md:text-[44px] lowercase text-black group-hover:text-[#ff614c] transition-colors break-all">{EMAIL}</span>
            <span className="font-['Shantell_Sans',cursive] text-[13px] text-black/50 shrink-0">{copied ? "copied ✓ (+50)" : "copy"}</span>
          </button>
        </div>
        <div>
          <Scribble className="mb-3">{isProfessional ? "elsewhere" : "stalk responsibly"}</Scribble>
          <ul className="flex flex-col gap-2">
            {[
              { t: "Instagram", d: "@alaa_aliens · UX doodles", h: "https://www.instagram.com/alaa_aliens", k: "star" as Kind },
              { t: "LinkedIn", d: isProfessional ? "the serious version" : "the version with a tie", h: "https://www.linkedin.com/in/alaa-aliens", k: "crown" as Kind },
              { t: "Ftoor Designer", d: "the podcast, on Spotify", h: "https://open.spotify.com/", k: "sparkle" as Kind },
            ].map((l) => (
              <li key={l.t}>
                <a href={l.h} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3">
                  <span className="transition-transform group-hover:rotate-12"><StickerArt kind={l.k} size={24} /></span>
                  <span className="font-display text-[24px] md:text-[28px] lowercase text-black group-hover:text-[#ff614c] transition-colors">{l.t}</span>
                  <span className="font-['Work_Sans'] text-[13px] text-black/55">{l.d}</span>
                  <span className="text-[#ff614c] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
