import { motion, AnimatePresence } from "motion/react";
import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import closeSvgPaths from "../../imports/svg-bd3hwetzwh";
import imgImage54 from "figma:asset/2a859171033dd07ade1eb5527484f0697aadb6e3.png";

/* Shown when someone opens a project whose case study isn't written yet. */
export function ComingSoonPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isProfessional } = useMode();
  const { openContact } = useContactForm();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#fdecd0] rounded-[20px] max-w-[860px] w-full relative overflow-clip flex flex-col max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end p-4 md:p-[30px]">
              <button
                onClick={onClose}
                className="size-[24px] cursor-pointer flex items-center justify-center text-black hover:text-[#ff614c] transition-colors"
              >
                <svg className="block size-[15.5px]" fill="none" viewBox="0 0 15.5 15.5">
                  <path
                    d={closeSvgPaths.pdbb6fe0}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-8 md:gap-[57px] px-6 md:px-[110px]">
              {/* Title & description */}
              <div className="flex flex-col gap-[16px]">
                <h3 className="font-['Playfair_Display'] font-bold text-[#ff614c] text-[28px] md:text-[52px] lg:text-[62px] leading-[1.05]">
                  {isProfessional ? "WELL, THIS IS AWKWARD" : "BAZZINGAAAAA"}
                </h3>
                <p className="font-['Work_Sans'] text-black text-[15px] md:text-[24px] lg:text-[28px] leading-[1.4]">
                  {isProfessional
                    ? "You caught me \u2014 this case study isn't ready yet. But the project is 100% real and I'd love to walk you through it."
                    : "No seriously, AI did NOT design this project, but I still didn't upload the case study for it."}
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-[21px] items-start pb-6 md:pb-[50px]">
                <p className="font-['Work_Sans'] text-black text-[14px] md:text-[18px]">
                  {isProfessional
                    ? "Let's connect and I'll share the full story"
                    : "Let's connect and I will show you"}
                </p>
                <button
                  onClick={() => { onClose(); openContact(); }}
                  className="bg-white relative px-[10px] py-[10px] font-['DM_Serif_Display'] text-[19px] text-black border border-black shadow-[4px_4px_0px_0px_black] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_black] transition-all"
                >
                  Get in Touch
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-[#f2e3cb] flex items-center justify-center gap-[24px] px-8 md:px-[110px] py-[18px] min-h-[117px]">
              <div className="relative shrink-0 w-[88px] h-[82px] overflow-hidden">
                <img
                  alt=""
                  className="absolute max-w-none"
                  style={{
                    width: "178.2%",
                    height: "255.77%",
                    left: "-34.18%",
                    top: "-63.08%",
                  }}
                  src={imgImage54}
                />
              </div>
              <p className="font-['Work_Sans'] text-black text-[14px] md:text-[18px] leading-[1.5] max-w-[455px]">
                {isProfessional
                  ? "Currently documenting this project \u2014 it will be available soon."
                  : "Meanwhile, I'm working on it... hopefully it will be uploaded before we land a man on Mars."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
