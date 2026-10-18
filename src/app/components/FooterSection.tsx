import imgHeadCut from "../../assets/head.webp";
import { Button } from "./ui/Kit";
import { StickerArt } from "./play/Stickers";
import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import { motion } from "motion/react";
import { EyeHeadline } from "./hero/EyeHeadline";
import squigglySvg from "../../imports/svg-zqq9sgn0jp";

function SquigglyDivider({ color = "#ff614c" }: { color?: string }) {
  return (
    <div className="w-full flex justify-center py-2">
      <svg className="w-[200px] md:w-[300px] h-[13px]" fill="none" viewBox="0 0 97.2701 12.4564" preserveAspectRatio="none">
        <path d={squigglySvg.p3bfecf00} fill={color} />
      </svg>
    </div>
  );
}

function DoodleArrow() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="rotate-[-15deg]">
      <path
        d="M8 32 C12 24, 18 18, 30 10"
        stroke="#ff614c"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="0"
        style={{ filter: "url(#sketchy)" }}
      />
      <path
        d="M24 8 L30 10 L26 16"
        stroke="#ff614c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <filter id="sketchy">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </defs>
    </svg>
  );
}

export function FooterSection() {
  const { isProfessional, mode } = useMode();
  const { openContact } = useContactForm();

  return (
    <>
    {/* A round sticker of me, half over the footer edge, with text running around it */}
    <div className="relative h-0 w-full max-w-[1200px] mx-auto z-[40]" aria-hidden>
      <motion.div
        className="absolute left-6 md:left-16 -top-[52px] md:-top-[70px] w-[104px] h-[104px] md:w-[140px] md:h-[140px]"
        initial={{ scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
      >
        <div className="absolute inset-0 rounded-full bg-[#fdecd0] border border-[#1d1a17] shadow-[3px_3px_0_0_#ff614c]" />
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path id="footer-ring" d="M50 50 m-39 0 a39 39 0 1 1 78 0 a39 39 0 1 1 -78 0" />
          </defs>
          <text fontFamily="Gochi Hand, cursive" fontSize="10.5" fill="#1d1a17" letterSpacing="1">
            <textPath href="#footer-ring">{isProfessional ? "psst… hiring? · let's talk · psst… hiring? · " : "psst… hiring? · say hi · don't scroll away · "}</textPath>
          </text>
        </motion.svg>
        <motion.img
          src={imgHeadCut}
          alt=""
          className="absolute left-[24%] top-[24%] w-[52%] h-[52%] object-contain"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 14 }}
          className="absolute -top-3 left-[92%] whitespace-nowrap origin-bottom-left bg-white border border-black rounded-[16px] px-3 py-1 font-['Shantell_Sans',cursive] text-[13px] md:text-[15px] text-black shadow-[3px_3px_0_0_black] rotate-[-4deg]"
        >
          {isProfessional ? "psst… hiring?" : "don't scroll away 🥺"}
        </motion.span>
      </motion.div>
    </div>
    <footer id="contact" className="w-full bg-black text-white relative z-10 overflow-hidden">
      {/* Subtle doodle dots in background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Marquee (fun mode only) */}
      {!isProfessional && (
      <div aria-hidden className="relative border-b border-white/10 py-4 md:py-6 overflow-hidden">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap font-['IBM_Plex_Serif'] italic font-bold text-[28px] md:text-[44px]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10">
              {(isProfessional
                ? ["UX/UI Design", "Design Systems", "UX Audits", "Workshops", "Illustration", "Dashboards", "Motion"]
                : ["Pixels", "Doodles", "Hot takes", "Coffee", "Border-radius debates", "More coffee", "Doodles again"]
              ).map((w, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className={i % 2 ? "text-white/25" : "text-white"}>{w}</span>
                  <span className="text-[#ff614c] not-italic">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      )}

      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24 relative"
      >
        {/* Main CTA — centered */}
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          <EyeHeadline
            as="h3"
            key={mode}
            text={isProfessional ? "got a project? let's talk." : "still here? good. let's talk."}
            className="font-display text-white text-[44px] md:text-[96px] leading-[0.95] lowercase [text-wrap:balance] max-w-[1000px]"
          />

          <p className="font-['Work_Sans'] font-light text-[15px] md:text-[18px] leading-[1.7] text-white/70 max-w-[500px]">
            {isProfessional
              ? "Apps, dashboards, workshops, or a second opinion on your UX. I'd love to hear about it."
              : "Whether it's a project, a workshop, or just a good design argument — I'm in. Bring snacks."}
          </p>

          <Button tone="coral" size="lg" onClick={openContact} className="mt-2">
            {isProfessional ? "Get in Touch →" : "Say Hi 👋"}
          </Button>
        </div>

        {/* Squiggly Divider */}
        <div className="my-12 md:my-16">
          <SquigglyDivider color="rgba(255,255,255,0.15)" />
        </div>

        {/* Contact + elsewhere, in marker */}
        <div className="flex flex-col items-center gap-8 md:gap-10 text-center">
          <a href="mailto:alaa@alaa-ali.com" className="font-display lowercase text-[26px] sm:text-[36px] md:text-[48px] leading-none text-[#fffaf1] hover:text-[#ff614c] transition-colors break-all">
            alaa@alaa-ali.com
          </a>
          <p className="font-['Shantell_Sans',cursive] text-[15px] md:text-[17px] text-white/60">
            <a href="tel:+962799438680" className="hover:text-[#ff614c] transition-colors">+962 799 43 86 80</a>
            <span className="mx-3 text-[#ff614c]">·</span>
            {isProfessional ? "Amman, Jordan" : "Amman, Jordan (yes, we have internet)"}
          </p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              { t: "instagram", h: "https://www.instagram.com/alaa_aliens", k: "star" as const },
              { t: "linkedin", h: "https://www.linkedin.com/in/alaa-aliens", k: "crown" as const },
              { t: "podcast", h: "https://open.spotify.com/show/0zuVyPYDvZaJKwo5cTXbmg?si=64676e57f24d4af5", k: "sparkle" as const },
            ].map((l, i) => (
              <li key={l.t}>
                <a href={l.h} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-display text-[24px] md:text-[30px] lowercase text-[#fffaf1] hover:text-[#ff614c] transition-colors" style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}>
                  <span className="transition-transform group-hover:rotate-12"><StickerArt kind={l.k} size={22} /></span>
                  {l.t}
                  <span className="text-[#ff614c] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom copyright */}
        <div className="mt-14 md:mt-20 flex flex-col items-center gap-3 pb-12 md:pb-0">
          <SquigglyDivider color="rgba(255,255,255,0.08)" />
          <p className="font-['Work_Sans'] font-light text-[13px] text-white/40 text-center mt-2">
            {isProfessional
              ? "\u00A9 2025 Ala'a Ali \u2014 Designed with coffee and questionable sleep habits."
              : "\u00A9 2025 Ala'a Ali \u2014 No couches were upholstered in the making of this website."}
          </p>
        </div>
      </motion.div>
    </footer>
    </>
  );
}