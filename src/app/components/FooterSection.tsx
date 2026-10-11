import { useMode } from "./ModeContext";
import { useContactForm } from "./ContactFormContext";
import { motion } from "motion/react";
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
    <footer id="contact" className="w-full bg-black text-white relative overflow-hidden">
      {/* Subtle doodle dots in background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24 relative"
      >
        {/* Main CTA — centered */}
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          <h3 className="font-['Playfair_Display'] font-bold text-[32px] md:text-[48px] leading-tight">
            {isProfessional ? "Let's Work Together" : "Still Here? Let's Talk."}
          </h3>

          <p className="font-['Work_Sans'] font-light text-[15px] md:text-[18px] leading-[1.7] text-white/70 max-w-[500px]">
            {isProfessional
              ? "Have a project in mind? I'd love to hear about it. Let's make something great."
              : "Whether it's a project, a workshop, or just a good design argument — I'm in. Bring snacks."}
          </p>

          <button
            onClick={openContact}
            className="mt-2 bg-[#ff614c] text-white px-8 py-4 font-['Playfair_Display'] font-bold text-[18px] md:text-[20px] border-2 border-[#ff614c] shadow-[5px_5px_0px_0px_rgba(255,97,76,0.3)] hover:shadow-[3px_3px_0px_0px_rgba(255,97,76,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            {isProfessional ? "Get in Touch →" : "Say Hi 👋"}
          </button>
        </div>

        {/* Squiggly Divider */}
        <div className="my-12 md:my-16">
          <SquigglyDivider color="rgba(255,255,255,0.15)" />
        </div>

        {/* Contact Info + Socials — two-row centered layout */}
        <div className="flex flex-col items-center gap-10 md:gap-12">
          {/* Contact details row */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            {/* Email */}
            <a
              href="mailto:alaa@alaa-ali.com"
              className="group flex items-center gap-3 font-['Work_Sans'] font-light text-[15px] md:text-[16px] text-white/70 hover:text-[#ff614c] transition-colors"
            >
              <span className="w-[36px] h-[36px] border border-white/20 group-hover:border-[#ff614c]/50 flex items-center justify-center transition-colors shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
              </span>
              alaa@alaa-ali.com
            </a>

            {/* Phone */}
            <a
              href="tel:+962799438680"
              className="group flex items-center gap-3 font-['Work_Sans'] font-light text-[15px] md:text-[16px] text-white/70 hover:text-[#ff614c] transition-colors"
            >
              <span className="w-[36px] h-[36px] border border-white/20 group-hover:border-[#ff614c]/50 flex items-center justify-center transition-colors shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              +962 799 43 86 80
            </a>

            {/* Location */}
            <div className="flex items-center gap-3 font-['Work_Sans'] font-light text-[15px] md:text-[16px] text-white/70">
              <span className="w-[36px] h-[36px] border border-white/20 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              {isProfessional
                ? "Amman, Jordan"
                : "Amman, Jordan (yes, we have internet)"}
            </div>
          </div>

          {/* Social links as sketchy pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/alaa_aliens"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-[#ff614c] text-white/70 hover:text-[#ff614c] font-['Work_Sans'] font-light text-[14px] md:text-[15px] transition-all hover:shadow-[3px_3px_0px_0px_rgba(255,97,76,0.2)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/alaa-aliens"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-[#ff614c] text-white/70 hover:text-[#ff614c] font-['Work_Sans'] font-light text-[14px] md:text-[15px] transition-all hover:shadow-[3px_3px_0px_0px_rgba(255,97,76,0.2)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://open.spotify.com/show/0zuVyPYDvZaJKwo5cTXbmg?si=64676e57f24d4af5"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 border border-white/20 hover:border-[#ff614c] text-white/70 hover:text-[#ff614c] font-['Work_Sans'] font-light text-[14px] md:text-[15px] transition-all hover:shadow-[3px_3px_0px_0px_rgba(255,97,76,0.2)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Podcast
            </a>
          </div>
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
  );
}