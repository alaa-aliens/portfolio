import imgImage14 from "figma:asset/48b24d576823e0c5848a509aca20ff871581ad60.png";
import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { Doodle } from "./motion/Doodles";

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

export function HeroSection() {
  const { isProfessional, mode } = useMode();
  const { openContact } = useContactForm();
  const tilt = useCursorTilt();
  const headline = isProfessional ? "hey, my name is ala'a ali" : "yooo, i'm ala'a ali";

  return (
    <section id="hero" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-[100px] md:pt-[150px]">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
        {/* Illustration */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -20, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-[160px] md:w-[270px] h-[280px] md:h-[477px] relative shrink-0"
        >
          <Doodle kind="sparkle" className="-left-6 md:-left-10 top-6" size={36} />
          <Doodle kind="star" className="-right-4 md:-right-8 top-16 md:top-24" size={32} color="#FF9F1C" delay={0.3} />
          <Doodle kind="swirl" className="-left-2 md:-left-6 bottom-10 md:bottom-16" size={34} color="#6A4CFF" delay={0.6} />
          {!isProfessional && <Doodle kind="heart" className="right-0 bottom-24" size={30} color="#FF4C79" delay={0.9} />}

          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: 1.1 }}
            className="absolute z-20 -top-2 md:top-0 -right-10 md:-right-16 origin-bottom-left bg-white border-2 border-black rounded-[18px] px-3 py-1.5 font-['DM_Serif_Display'] text-[14px] md:text-[18px] text-black shadow-[3px_3px_0px_0px_black] whitespace-nowrap"
          >
            {isProfessional ? "hi there 👋" : "sup? 🤘"}
            <span aria-hidden className="absolute -bottom-[9px] left-4 w-4 h-4 bg-white border-b-2 border-r-2 border-black rotate-45" />
          </motion.div>

          <motion.div
            style={{ rotate: tilt.rotate, x: tilt.tx, y: tilt.ty }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              <img
                alt="Hand-drawn illustration of Ala'a Ali holding a laptop"
                className="absolute h-[168%] left-[-96%] top-[-48%] w-[222%] max-w-none"
                src={imgImage14}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          key={`text-${mode}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6 md:gap-8 max-w-[600px] text-center md:text-left items-center md:items-start"
        >
          <div className="flex flex-col gap-3">
            <h1
              aria-label={headline}
              className="font-['Playfair_Display'] font-bold text-[#ff614c] text-[24px] md:text-[42px] leading-tight lowercase"
            >
              {headline.split(" ").map((word, wi) => (
                <span key={wi} aria-hidden className="inline-block whitespace-nowrap mr-[0.25em]">
                  {word.split("").map((ch, ci) => (
                    <motion.span
                      key={ci}
                      className="inline-block"
                      initial={{ opacity: 0, y: 18, rotate: 8 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.25 + (wi * 4 + ci) * 0.025 }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
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
            className="self-center md:self-start bg-white px-6 py-3 font-['DM_Serif_Display'] text-[17px] md:text-[19px] text-black relative hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all shadow-[4px_4px_0px_0px_black] border border-black"
          >
            {isProfessional ? "Get in Touch" : "Say Hi"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}