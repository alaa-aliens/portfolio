import { useState } from "react";
import React from "react";
import { useContactForm } from "./ContactFormContext";
import svgPaths from "../../imports/svg-drsth3odo8";
import hoverSvgPaths from "../../imports/svg-pkeiynvjgw";
import closeSvgPaths from "../../imports/svg-bd3hwetzwh";
import imgImage22 from "figma:asset/316e887e6e85ad89f6a04ace8c986909a43a9089.png";
import imgImage24 from "figma:asset/840a0dca576b0360f028ae53fcfd9d51286d8626.png";
import imgImage25 from "figma:asset/7e7f5a4a3ea212183ac00bce26dc64a81509b513.png";
import img03D18E06 from "figma:asset/155eb9c567562f7fc4db482f0e44b69f71f4a7db.png";
import imgImage54 from "figma:asset/2a859171033dd07ade1eb5527484f0697aadb6e3.png";
import { useMode } from "./ModeContext";
import { motion, AnimatePresence } from "motion/react";

// ── Other Projects & Clients Data ──
interface OtherProjectCategory {
  title: string;
  funTitle: string;
  color: string;
  projects: string[];
}

const otherProjectCategories: OtherProjectCategory[] = [
  {
    title: "Government & Enterprise",
    funTitle: "Big Serious Orgs",
    color: "#FF614C",
    projects: ["Saudi Ministry of Justice", "UAE Gov Platforms", "Queen Alia Airport", "Palestine Museum"],
  },
  {
    title: "Platforms & SaaS",
    funTitle: "Cloud Stuff",
    color: "#6A4CFF",
    projects: ["Trackhawk GPS", "InvoiceQ", "Zinc Platform", "CMS Inbox"],
  },
  {
    title: "Fintech & Commerce",
    funTitle: "Money Things",
    color: "#53B858",
    projects: ["Aranpay", "Gold Marketplace", "Donation Platform"],
  },
  {
    title: "EdTech & Learning",
    funTitle: "Brainy Apps",
    color: "#FF4C79",
    projects: ["Ana Athkar", "Glool LMS", "Tabshora LMS", "SADAQA"],
  },
  {
    title: "Media & Branding",
    funTitle: "Artsy Stuff",
    color: "#FF9F1C",
    projects: ["Al Jazeera Visuals", "Water Table Project", "EY Illustration System"],
  },
];

// ── Other Projects Popup ──
function OtherProjectsPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isProfessional } = useMode();

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
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#fdecd0] rounded-[20px] max-w-[900px] w-full relative overflow-clip flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end p-4 md:p-[30px] pb-0 md:pb-0">
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

            {/* Scrollable content */}
            <div className="overflow-y-auto px-6 md:px-12 lg:px-16 pb-0">
              {/* Title */}
              <h3 className="font-['Playfair_Display'] italic font-bold text-black text-[28px] md:text-[38px] lg:text-[44px] leading-[1.1] mb-8 md:mb-10">
                {isProfessional ? "Other Projects & Clients" : "The Full Damage Report"}
              </h3>

              {/* Categories grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 mb-8 md:mb-10">
                {otherProjectCategories.slice(0, 4).map((cat) => (
                  <div key={cat.title} className="flex flex-col gap-3">
                    {/* Category heading with colored underline */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-['Work_Sans'] font-bold text-black text-[14px] md:text-[15px]">
                        {isProfessional ? cat.title : cat.funTitle}
                      </span>
                      <div
                        className="h-[3px] rounded-full"
                        style={{
                          backgroundColor: cat.color,
                          width: "40px",
                        }}
                      />
                    </div>
                    {/* Project pills */}
                    <div className="flex flex-wrap gap-2">
                      {cat.projects.map((proj) => (
                        <span
                          key={proj}
                          className="inline-block border border-black/70 rounded-[4px] px-3 py-1.5 font-['Work_Sans'] text-black text-[12px] md:text-[13px] hover:bg-[#F5E1C0] transition-colors cursor-default"
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Media & Branding — full width row */}
              {otherProjectCategories[4] && (
                <div className="flex flex-col gap-3 mb-8 md:mb-10">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-['Work_Sans'] font-bold text-black text-[14px] md:text-[15px]">
                      {isProfessional ? otherProjectCategories[4].title : otherProjectCategories[4].funTitle}
                    </span>
                    <div
                      className="h-[3px] rounded-full"
                      style={{
                        backgroundColor: otherProjectCategories[4].color,
                        width: "40px",
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {otherProjectCategories[4].projects.map((proj) => (
                      <span
                        key={proj}
                        className="inline-block border border-black/70 rounded-[4px] px-3 py-1.5 font-['Work_Sans'] text-black text-[12px] md:text-[13px] hover:bg-[#F5E1C0] transition-colors cursor-default"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider + Footer */}
            <div className="border-t border-black/15 mt-auto">
              <div className="flex flex-col items-center gap-1 py-6 md:py-8">
                <p className="font-['Work_Sans'] text-black/50 text-[13px] md:text-[14px]">
                  {isProfessional ? "Made with ☕ and too many screens" : "Made with ☕, chaos, and mass amounts of imposter syndrome"}
                </p>
                <p className="font-['Work_Sans'] text-black/40 text-[12px] md:text-[13px]">
                  © 2026 Ala'a Ali
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable folder illustration
function FolderIllustration({ color, logoContent, isHovered }: { color: string; logoContent: React.ReactNode; isHovered?: boolean }) {
  const filterId = React.useId().replace(/:/g, '');
  return (
    <div className="h-[130px] w-[175px] relative">
      {/* Folder back tab — sits behind everything */}
      <div
        className="absolute w-[137.9px] h-[112.7px]"
        style={{
          left: 'calc(50% - 6.44px)',
          top: 'calc(50% + 0.24px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg className="block size-full" fill="none" viewBox="0 0 137.9 112.7">
          <path d={svgPaths.p8308772} fill="#EDDCBF" />
          <path d={svgPaths.p986f000} fill="#FF604C" fillOpacity="0.988" />
        </svg>
      </div>

      {/* Logo card — peeks out above the folder front on hover */}
      <div
        className="absolute w-[120px] h-[70.5px] rounded flex items-center justify-center overflow-hidden transition-[top] duration-300 ease-in-out"
        style={{
          backgroundColor: color,
          left: 'calc(50% - 2px)',
          top: isHovered ? 'calc(50% - 30px)' : 'calc(50% - 13.5px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {logoContent}
      </div>

      {/* Folder front flap — scales down from bottom on hover */}
      <div
        className="absolute w-[147px] h-[93.1px] transition-transform duration-300 ease-in-out"
        style={{
          left: 'calc(50% + 0.98px)',
          top: 'calc(50% + 10.04px)',
          transform: `translate(-50%, -50%) scaleY(${isHovered ? 0.78 : 1})`,
          transformOrigin: 'center bottom',
        }}
      >
        <div className="absolute" style={{ inset: '-23.31% -9.52% -6.77% -9.52%' }}>
          <svg className="block size-full" fill="none" viewBox="0 0 175 121.1">
            <g filter={`url(#${filterId})`}>
              <path d={svgPaths.p1cc33f00} fill="#FDECD0" />
              <path d={svgPaths.pba08900} fill="#FE604F" />
            </g>
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="121.1" width="175" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="-7.7" />
                <feGaussianBlur stdDeviation="7" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Simple text logo
function TextLogo({ text, bgColor, textColor = "white", fontSize = "14px", isHovered }: { text: string; bgColor: string; textColor?: string; fontSize?: string; isHovered?: boolean }) {
  return (
    <FolderIllustration
      color={bgColor}
      isHovered={isHovered}
      logoContent={
        <span className="font-['IBM_Plex_Serif'] font-bold" style={{ color: textColor, fontSize }}>
          {text}
        </span>
      }
    />
  );
}

// BravoBravo SVG logo
function BravoBravoLogo({ isHovered }: { isHovered?: boolean }) {
  return (
    <FolderIllustration
      color="#54c8e8"
      isHovered={isHovered}
      logoContent={
        <svg className="w-[77px] h-[26px]" fill="none" viewBox="0 0 77 26">
          {/* Dark outlines group 1 */}
          <path d={svgPaths.p19c3b700} fill="#002A3A" />
          <path d={svgPaths.p1d5aba32} fill="#002A3A" />
          <path d={svgPaths.p697b700} fill="#002A3A" />
          <path d={svgPaths.p16d03a00} fill="#002A3A" />
          <path d={svgPaths.p3d4d4570} fill="#002A3A" />
          <path d={svgPaths.p17553600} fill="#002A3A" />
          <path d={svgPaths.p3128ce80} fill="#002A3A" />
          <path d={svgPaths.p3209dc00} fill="#002A3A" />
          <path d={svgPaths.p3084b400} fill="#002A3A" />
          {/* Stars */}
          <path d={svgPaths.p2bba7c0} fill="#FFAE3B" />
          <path d={svgPaths.p3e809f00} fill="#FFAE3B" />
          <path d={svgPaths.p15b18300} fill="#FFAE3B" />
          {/* Dark outlines group 2 */}
          <path d={svgPaths.p2fa9ba80} fill="#002A3A" />
          <path d={svgPaths.p9696d80} fill="#002A3A" />
          <path d={svgPaths.p1af08f00} fill="#002A3A" />
          <path d={svgPaths.p1f5a8500} fill="#002A3A" />
          <path d={svgPaths.p2a8f3c00} fill="#002A3A" />
          <path d={svgPaths.p1a24bf40} fill="#002A3A" />
          <path d={svgPaths.p3cd3a900} fill="#002A3A" />
          <path d={svgPaths.pb316880} fill="#002A3A" />
          <path d={svgPaths.pb320d70} fill="#002A3A" />
          <path d={svgPaths.p3f9a1200} fill="#002A3A" />
          <path d={svgPaths.p38998600} fill="#002A3A" />
          <path d={svgPaths.p3d909500} fill="#002A3A" />
          <path d={svgPaths.pb838000} fill="#002A3A" />
          <path d={svgPaths.p2b148700} fill="#002A3A" />
          <path d={svgPaths.p25ec88f0} fill="#002A3A" />
          <path d={svgPaths.p32092600} fill="#002A3A" />
          <path d={svgPaths.p3c46c070} fill="#002A3A" />
          <path d={svgPaths.p27cd100} fill="#002A3A" />
          <path d={svgPaths.p27469400} fill="#002A3A" />
          <path d={svgPaths.p19366000} fill="#002A3A" />
          <path d={svgPaths.p3f41c480} fill="#002A3A" />
          <path d={svgPaths.p16721b00} fill="#002A3A" />
          <path d={svgPaths.p3e1e5040} fill="#002A3A" />
          <path d={svgPaths.p3c201f80} fill="#002A3A" />
          <path d={svgPaths.p31292200} fill="#002A3A" />
          <path d={svgPaths.p30e38400} fill="#002A3A" />
          <path d={svgPaths.p3725a000} fill="#002A3A" />
          <path d={svgPaths.p77fb2c0} fill="#002A3A" />
          <path d={svgPaths.p16b37680} fill="#002A3A" />
          <path d={svgPaths.p11d63500} fill="#002A3A" />
          {/* White fills */}
          <path d={svgPaths.p21c68300} fill="white" />
          <path d={svgPaths.pdf92400} fill="white" />
          <path d={svgPaths.p3aaf1880} fill="white" />
          <path d={svgPaths.p1d86f580} fill="white" />
          <path d={svgPaths.p31961370} fill="white" />
          <path d={svgPaths.p310c87c0} fill="white" />
          <path d={svgPaths.p2db49900} fill="white" />
          <path d={svgPaths.p16311f00} fill="white" />
          <path d={svgPaths.p62ec880} fill="white" />
          <path d={svgPaths.pfb2c280} fill="white" />
        </svg>
      }
    />
  );
}

// Carseer SVG logo
function CarseerLogo({ isHovered }: { isHovered?: boolean }) {
  return (
    <FolderIllustration
      color="#f93"
      isHovered={isHovered}
      logoContent={
        <svg className="w-[32px] h-[20px]" fill="none" viewBox="0 0 36.7787 23.0267">
          <g>
            <mask id="carseerMask" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" as const }} x="8" y="0" width="29" height="15">
              <path clipRule="evenodd" d={svgPaths.p18847200} fill="white" fillRule="evenodd" />
            </mask>
            <g mask="url(#carseerMask)">
              <path clipRule="evenodd" d={svgPaths.p274cfc00} fill="black" fillRule="evenodd" />
            </g>
          </g>
          <path clipRule="evenodd" d={svgPaths.p1bbcf800} fill="white" fillRule="evenodd" />
        </svg>
      }
    />
  );
}

// Image logo
function ImageLogo({ src, bgColor, imgClass = "w-16 h-6 object-contain", isHovered }: { src: string; bgColor: string; imgClass?: string; isHovered?: boolean }) {
  return (
    <FolderIllustration
      color={bgColor}
      isHovered={isHovered}
      logoContent={<img alt="" src={src} className={imgClass} />}
    />
  );
}

interface Project {
  name: string;
  proDesc: string;
  funDesc: string;
  renderFolder: (isHovered: boolean) => React.ReactNode;
}

const projects: Project[] = [
  {
    name: "BravoBravo",
    proDesc: "Gamified reading system & LMS for schools",
    funDesc: "Made homework less painful (you're welcome, kids)",
    renderFolder: (isHovered) => <BravoBravoLogo isHovered={isHovered} />,
  },
  {
    name: "Carseer",
    proDesc: "Comprehensive vehicle history reports platform",
    funDesc: "Made car history reports actually readable",
    renderFolder: (isHovered) => <CarseerLogo isHovered={isHovered} />,
  },
  {
    name: "Jawaker",
    proDesc: "Social card gaming platform profile enhancements",
    funDesc: "Redesigned profiles for millions of card game addicts",
    renderFolder: (isHovered) => <ImageLogo src={img03D18E06} bgColor="#000" imgClass="w-16 h-7 object-contain" isHovered={isHovered} />,
  },
  {
    name: "Tamatem +",
    proDesc: "Player engagement & monetization platform",
    funDesc: "Made gamers spend money without hating the experience",
    renderFolder: (isHovered) => <ImageLogo src={imgImage22} bgColor="#fff" imgClass="w-20 h-10 object-contain" isHovered={isHovered} />,
  },
  {
    name: "TRT News",
    proDesc: "Multi-platform digital news experience for TRT Arabi",
    funDesc: "Made breaking news feel less broken on mobile",
    renderFolder: (isHovered) => <ImageLogo src={imgImage24} bgColor="#02b5c9" imgClass="w-[100px] h-[52px] object-contain" isHovered={isHovered} />,
  },
  {
    name: "Smasco \u2013 Raha",
    proDesc: "Smart building management & tenant services app",
    funDesc: "Made \"my AC is broken\" feel like a premium interaction",
    renderFolder: (isHovered) => <ImageLogo src={imgImage25} bgColor="#fff" imgClass="w-14 h-12 object-contain" isHovered={isHovered} />,
  },
];

function ProjectPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

function ProjectCard({ project, index, isProfessional, onSelect }: { project: Project; index: number; isProfessional: boolean; onSelect: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex flex-col gap-4 p-6 md:p-8 cursor-pointer hover:bg-[#F5E1C0] rounded-lg transition-colors"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-start">
        {project.renderFolder(isHovered)}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-['Playfair_Display'] font-bold text-black text-[18px] md:text-[22px]">
          {project.name}
        </h3>
        <p className="font-['Work_Sans'] text-black text-[14px] md:text-[16px]">
          {isProfessional ? project.proDesc : project.funDesc}
        </p>
      </div>

      {/* Hand-drawn doodle arrow — fades in on hover */}
      <div
        className="transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isHovered ? 1 : 0,
          width: '35px',
          height: '25px',
        }}
      >
        <svg className="block size-full" fill="none" viewBox="9 9.5 26 16">
          <path d={hoverSvgPaths.p956b540} fill="#FF604C" />
        </svg>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const { isProfessional, mode } = useMode();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showOtherProjects, setShowOtherProjects] = useState(false);

  return (
    <section id="projects" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12">
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-8">
          <h2 className="font-['Playfair_Display'] font-bold text-black text-[24px] md:text-[36px]">
            {isProfessional ? "Featured Projects" : "Stuff I've Designed"}
          </h2>
          <div className="hidden md:block h-[1px] w-6 bg-black/30 rotate-90" />
          <button className="font-['Playfair_Display'] font-bold text-[#ff614c] text-[16px] md:text-[22px] hover:underline self-start"
            onClick={() => setShowOtherProjects(true)}
          >
            {isProfessional ? "More Projects" : "The Full Damage"}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              isProfessional={isProfessional}
              onSelect={() => setSelectedProject(project.name)}
            />
          ))}
        </div>
      </motion.div>

      <ProjectPopup
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <OtherProjectsPopup
        isOpen={showOtherProjects}
        onClose={() => setShowOtherProjects(false)}
      />
    </section>
  );
}