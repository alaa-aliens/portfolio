import { addScore } from "../components/play/Score";
import { useState } from "react";
import { motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { useContactForm } from "../components/ContactFormContext";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { Doodle, Reveal } from "../components/motion/Doodles";
import { Button, Eyebrow, PaperCard, Prose, Scribble } from "../components/ui/Kit";
import { StickerArt } from "../components/play/Stickers";
import { usePageMeta } from "../usePageMeta";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

const EMAIL = "alaa@alaa-ali.com";

const REASONS: { k: string; pro: string; fun: string; kind: "star" | "bolt" | "heart" | "sparkle" }[] = [
  { k: "project", kind: "star", pro: "I have a product that needs design", fun: "My app is ugly and I'm sad" },
  { k: "audit", kind: "bolt", pro: "I want a UX audit", fun: "Tell me what's wrong (gently)" },
  { k: "workshop", kind: "sparkle", pro: "I need a workshop or a talk", fun: "Come talk at my people" },
  { k: "hello", kind: "heart", pro: "Just saying hi", fun: "No reason. Vibes." },
];

export function ContactPage() {
  const { isProfessional } = useMode();
  const { openContact } = useContactForm();
  const [copied, setCopied] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  usePageMeta({ title: "Contact · Ala'a Ali", description: "Hire Ala'a for product design, UX audits, workshops, or just say hi. Amman, Jordan." });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      addScore(50, "copied my email. bonus!", "contact:copy", true);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* fallback: the address is visible */
    }
  };

  return (
    <article className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] pb-8">
      <section className="relative grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
        <Doodle kind="heart" className="right-4 md:right-[40%] top-[90px]" size={38} color="#FF4C79" />
        <div>
          <Reveal y={12}><Eyebrow className="mb-3">{isProfessional ? "Contact" : "Say hi"}</Eyebrow></Reveal>
          <DoodleTitle as="h1" text={isProfessional ? "Let's make {heart} something" : "Talk to {heart} me"} className="text-[46px] md:text-[84px]" />
          <Reveal delay={0.15}>
            <Prose lead className="mt-6 max-w-[620px]">
              {isProfessional
                ? "Apps, dashboards, audits, workshops, or a second opinion on your UX. Tell me what you're building and I'll tell you honestly if I can help."
                : "Projects, workshops, or a good design argument. I'm in. Bring snacks."}
            </Prose>
          </Reveal>

          {/* Pick a reason */}
          <div className="mt-8">
            <Scribble className="mb-3">{isProfessional ? "what's this about?" : "pick your poison"}</Scribble>
            <div className="grid grid-cols-2 gap-3 max-w-[560px]">
              {REASONS.map((r) => {
                const on = reason === r.k;
                return (
                  <motion.button
                    key={r.k}
                    type="button"
                    onClick={() => setReason(r.k)}
                    whileHover={{ y: -3, rotate: -1 }}
                    whileTap={{ scale: 0.96 }}
                    aria-pressed={on}
                    className={`flex items-center gap-3 text-left rounded-[16px] border p-3 transition-colors ${on ? "border-black bg-white shadow-[3px_3px_0_0_black]" : "border-black/20 bg-[#fffaf1] hover:border-black"}`}
                  >
                    <StickerArt kind={r.kind} size={30} />
                    <span className="font-['Work_Sans'] font-semibold text-[13.5px] md:text-[14.5px] leading-snug">{isProfessional ? r.pro : r.fun}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Button tone="coral" size="lg" onClick={openContact}>
              {isProfessional ? "Write to me →" : "Send it →"}
            </Button>
            <button onClick={copy} className="group inline-flex items-center gap-2 font-['IBM_Plex_Serif'] text-[17px] md:text-[19px] select-all">
              <span className="underline decoration-[#ff614c] decoration-2 underline-offset-4">{EMAIL}</span>
              <span className="font-['Shantell_Sans',cursive] text-[13px] text-black/50">{copied ? "copied ✓" : "copy"}</span>
            </button>
          </div>
          <Scribble className="mt-4">{isProfessional ? "I reply within a day or two, Amman time." : "replies within a day. two if the cat's on the keyboard."}</Scribble>
        </div>

        {/* Ala'a, waiting by the phone */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
          className="relative mx-auto"
        >
          <PaperCard tilt={3} className="p-4 w-[280px] md:w-[320px]">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[12px] bg-[#FFE9C7]">
              <motion.img
                alt=""
                src={imgHead}
                className="absolute h-[150%] left-[-30%] top-[6%] w-[160%] max-w-none"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <p className="font-['Shantell_Sans',cursive] text-[15px] mt-3 text-center">{isProfessional ? "Amman, Jordan · GMT+3" : "Amman · fuelled by coffee"}</p>
          </PaperCard>
          <motion.span
            className="absolute -top-4 -right-3 bg-white border border-black rounded-[16px] px-3 py-1.5 font-['DM_Serif_Display'] text-[15px] shadow-[3px_3px_0_0_black] rotate-[6deg]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.9 }}
          >
            {isProfessional ? "say hi 👋" : "I don't bite 🦷"}
          </motion.span>
        </motion.div>
      </section>

      {/* Elsewhere */}
      <section className="mt-24 md:mt-32">
        <Eyebrow className="mb-5">{isProfessional ? "Elsewhere" : "Stalk me, respectfully"}</Eyebrow>
        <ul className="grid sm:grid-cols-3 gap-4">
          {[
            { t: "Instagram", d: "@alaa_aliens, UX doodles", href: "https://www.instagram.com/alaa_aliens" },
            { t: "LinkedIn", d: "the serious version", href: "https://www.linkedin.com/in/alaa-aliens" },
            { t: "Podcast", d: "Ftoor Designer, on Spotify", href: "https://open.spotify.com/show/0zuVyPYDvZaJKwo5cTXbmg" },
          ].map((l, i) => (
            <li key={l.t}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="block">
                <PaperCard tilt={i % 2 ? 1.5 : -1.5} className="p-5 flex items-center justify-between">
                  <span>
                    <span className="block font-['Playfair_Display'] font-bold text-[20px]">{l.t}</span>
                    <span className="block font-['Work_Sans'] text-[13.5px] text-black/60">{l.d}</span>
                  </span>
                  <span className="text-[#ff614c] text-[22px]">↗</span>
                </PaperCard>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
