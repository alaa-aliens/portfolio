import { play } from "./play/sfx";
import { addScore } from "./play/Score";
import imgImage14 from "figma:asset/48b24d576823e0c5848a509aca20ff871581ad60.png";
import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Doodle } from "./motion/Doodles";
import { UsersCrowd } from "./hero/UsersCrowd";
import { EyeHeadline } from "./hero/EyeHeadline";

/** Follows the cursor a little, so the character feels alive. */
function useCursorTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  const sy = useSpring(y, { stiffness: 60, damping: 18 });
  return {
    rotate: useTransform(sx, [-0.5, 0.5], [-4, 4]),
    tx: useTransform(sx, [-0.5, 0.5], [-10, 10]),
    ty: useTransform(sy, [-0.5, 0.5], [-6, 6]),
  };
}

/* Pupils drawn inside the sunglasses (positions measured from the drawing). They follow the cursor. */
const LENSES = [
  { cx: 34.3, cy: 17.9, w: 8.5, h: 4.0 },
  { cx: 47.8, cy: 16.5, w: 8.1, h: 3.6 },
];
function LensPupils({ boxRef, surprised }: { boxRef: React.RefObject<HTMLDivElement>; surprised: boolean }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const tick = () => {
      refs.current.forEach((el) => {
        if (!el) return;
        const r = el.parentElement!.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2);
        const dy = my - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 220);
        el.style.transform = `translate(calc(-50% + ${(dx / d) * r.width * 0.26 * k}px), calc(-50% + ${(dy / d) * r.height * 0.22 * k}px))`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [boxRef]);
  return (
    <>
      {LENSES.map((l, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute pointer-events-none"
          style={{ left: `${l.cx - l.w / 2}%`, top: `${l.cy - l.h / 2}%`, width: `${l.w}%`, height: `${l.h}%` }}
        >
          <span
            ref={(el) => (refs.current[i] = el)}
            className="absolute left-1/2 top-1/2 rounded-full bg-[#1d1a17] transition-[width,height] duration-150"
            style={{ width: surprised ? "26%" : "38%", height: surprised ? "52%" : "70%" }}
          />
        </span>
      ))}
    </>
  );
}

const POKES: Record<"pro" | "fun", string[]> = {
  pro: ["hi there 👋", "that tickles", "yes, I'm clickable", "good UX, right?", "ok, I'm awake", "hire me? 👉👈"],
  fun: ["sup? 🤘", "OI!", "personal space!", "do it again 😏", "I bruise easily", "that's my laptop!!"],
};

export function HeroSection() {
  const { isProfessional, mode } = useMode();
  const { openContact } = useContactForm();
  const tilt = useCursorTilt();
  const headline = isProfessional ? "hey, my name is ala'a ali" : "yooo, it's me, ala'a ali";
  const boxRef = useRef<HTMLDivElement>(null);
  const [pokes, setPokes] = useState(0);
  const [surprised, setSurprised] = useState(false);
  const lines = POKES[isProfessional ? "pro" : "fun"];
  const poke = () => {
    setPokes((n) => n + 1);
    addScore(1, "poked me", undefined);
    play("boing", 0.4);
    setSurprised(true);
    window.setTimeout(() => setSurprised(false), 450);
  };

  return (
    <section id="hero" className="relative w-full pt-[100px] md:pt-[130px] pb-[150px] md:pb-[170px] overflow-hidden">
      {/* The users — wander around behind everything */}
      <div className="absolute inset-0 top-[70px] md:top-[90px]">
        <UsersCrowd />
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-6 md:gap-14 pointer-events-none">
        {/* Illustration */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -20, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          data-crowd-avoid
          className="w-[160px] md:w-[270px] h-[280px] md:h-[477px] relative shrink-0"
        >
          {/* Click burst */}
          <AnimatePresence>
            {pokes > 0 && (
              <motion.div key={pokes} className="absolute inset-0 pointer-events-none z-30" aria-hidden>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-[42%] top-[20%] text-[18px] md:text-[24px]"
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: Math.cos((i / 6) * Math.PI * 2) * 90, y: Math.sin((i / 6) * Math.PI * 2) * 70 - 20, scale: 1, opacity: 0, rotate: i * 40 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {["✦", "★", "♥", "✺", "✦", "★"][i]}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <Doodle kind="sparkle" className="-left-6 md:-left-10 top-6" size={36} />
          <Doodle kind="star" className="-right-4 md:-right-8 top-16 md:top-24" size={32} color="#FF9F1C" delay={0.3} />
          <Doodle kind="swirl" className="-left-2 md:-left-6 bottom-10 md:bottom-16" size={34} color="#6A4CFF" delay={0.6} />
          {!isProfessional && <Doodle kind="heart" className="right-0 bottom-24" size={30} color="#FF4C79" delay={0.9} />}

          {/* Speech bubble (changes every time you poke him) */}
          <motion.div
            key={`bubble-${pokes}`}
            initial={{ opacity: 0, scale: 0.3, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: pokes ? 0 : 1.1 }}
            className="absolute z-20 -top-2 md:top-0 -right-10 md:-right-16 origin-bottom-left bg-white border border-black rounded-[18px] px-3 py-1.5 font-['DM_Serif_Display'] text-[14px] md:text-[18px] text-black shadow-[3px_3px_0px_0px_black] whitespace-nowrap"
          >
            {lines[pokes % lines.length]}
            <span aria-hidden className="absolute -bottom-[9px] left-4 w-4 h-4 bg-white border-b-2 border-r-2 border-black rotate-45" />
          </motion.div>

          <motion.div
            style={{ rotate: tilt.rotate, x: tilt.tx, y: tilt.ty }}
            className="absolute inset-0"
          >
            <motion.button
              type="button"
              ref={boxRef as unknown as React.Ref<HTMLButtonElement>}
              onClick={poke}
              aria-label="Poke Ala'a"
              className="pointer-events-auto absolute inset-0 overflow-hidden origin-bottom cursor-pointer"
              animate={pokes ? { y: [0, -26, 0, -6, 0], scaleY: [1, 0.88, 1.06, 0.97, 1], scaleX: [1, 1.08, 0.96, 1.02, 1] } : { y: [0, -8, 0] }}
              transition={pokes ? { duration: 0.6, ease: "easeOut" } : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              key={`body-${pokes}`}
            >
              <img
                alt="Hand-drawn illustration of Ala'a Ali holding a laptop"
                className="absolute h-[168%] left-[-96%] top-[-48%] w-[222%] max-w-none"
                src={imgImage14}
              />
              <LensPupils boxRef={boxRef} surprised={surprised} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          key={`text-${mode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          data-crowd-avoid
          className="flex flex-col gap-6 md:gap-8 max-w-[600px] text-center md:text-left items-center md:items-start"
        >
          <div className="flex flex-col gap-3">
            <EyeHeadline
              text={headline}
              className="font-display text-[#ff614c] text-[44px] md:text-[78px] lg:text-[88px] leading-[0.95] lowercase [text-wrap:balance]"
            />
            <p className="font-['IBM_Plex_Serif'] text-black text-[18px] md:text-[36px] leading-tight">
              {isProfessional
                ? "UX/UI Designer \u2022 Illustrator \u2022 Facilitator"
                : "I Draw Stuff \u2022 Break Layouts \u2022 Fix Them Again"}
            </p>
            <p className="font-['IBM_Plex_Serif'] font-light italic text-black text-[14px] md:text-[20px] leading-[1.6] mt-2">
              {isProfessional
                ? `"I've been designing digital products for 15+ years \u2014 and somehow I still get excited when a button has the perfect border-radius."`
                : `"I've survived 5 PlayStation generations, still google 'how to center a div,' and somehow convinced people to pay me for drawing on screens."`}
            </p>
          </div>

          <button
            onClick={openContact}
            onMouseEnter={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              window.dispatchEvent(new CustomEvent("crowd:attract", { detail: { x: r.left + r.width / 2, y: r.bottom + 10 } }));
            }}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent("crowd:attract", { detail: null }))}
            className="pointer-events-auto self-center md:self-start inline-flex items-center justify-center gap-2 border border-black rounded-[3px] font-['DM_Serif_Display'] px-6 py-3 text-[16px] md:text-[18px] bg-white text-black shadow-[4px_4px_0_0_#1d1a17] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d1a17] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            {isProfessional ? "Get in Touch" : "Say Hi"}
          </button>
        </motion.div>
      </div>

      {/* Handwritten hint pointing at the crowd */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="pointer-events-none absolute bottom-6 md:bottom-8 left-6 md:left-auto md:right-[30%] font-['Shantell_Sans',cursive] text-[13px] md:text-[15px] text-black/55 rotate-[-3deg] flex items-center gap-2"
      >
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden className="-scale-x-100 rotate-[20deg]">
          <path d="M2 18 C 10 6, 20 4, 31 8 M24 3 L32 8 L25 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isProfessional ? "these are my users. click one for its persona" : "my users. they have notes. poke one."}
      </motion.p>
    </section>
  );
}