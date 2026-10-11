import imgImage14 from "figma:asset/48b24d576823e0c5848a509aca20ff871581ad60.png";
import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import { motion } from "motion/react";

export function HeroSection() {
  const { isProfessional, mode } = useMode();
  const { openContact } = useContactForm();

  return (
    <section id="hero" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-[100px] md:pt-[150px]">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
        {/* Illustration */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[160px] md:w-[270px] h-[280px] md:h-[477px] relative shrink-0"
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt="Ala'a Ali illustration"
              className="absolute h-[168%] left-[-96%] top-[-48%] w-[222%] max-w-none"
              src={imgImage14}
            />
          </div>
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
            <h1 className="font-['Playfair_Display'] font-bold text-[#ff614c] text-[24px] md:text-[42px] leading-tight lowercase">
              {isProfessional
                ? "hey, my name is ala'a ali"
                : "yooo, i'm ala'a ali"}
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
            className="self-center md:self-start bg-white px-6 py-3 font-['DM_Serif_Display'] text-[17px] md:text-[19px] text-black relative hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] transition-all shadow-[4px_4px_0px_0px_black] border border-black"
          >
            {isProfessional ? "Get in Touch" : "Say Hi"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}