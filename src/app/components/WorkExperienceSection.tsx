import { useState } from "react";
import { useMode } from "./ModeContext";
import { motion, AnimatePresence } from "motion/react";
import squigglySvg from "../../imports/svg-zqq9sgn0jp";
import { SectionTitle } from "./motion/Doodles";

export interface TimelineEntry {
  year: string;
  tag: string;
  title: string;
  description: string;
  link?: string;
}

export interface TimelineData {
  label: string;
  leftEntries: TimelineEntry[];
  rightEntries: TimelineEntry[];
}

export type TabKey = "main" | "teaching" | "consulting" | "content";

// Per-tab accent colors
const tabAccentColors: Record<TabKey, string> = {
  main: "#ff614c",
  teaching: "#6A4CFF",
  consulting: "#53B858",
  content: "#FF4C79",
};

export const professionalTimelines: Record<TabKey, TimelineData> = {
  main: {
    label: "Main Career",
    leftEntries: [
      { year: "2025", tag: "Going Solo", title: "Freelancing", description: "Working with government, fintech, and edtech clients across MENA." },
      { year: "2025", tag: "Sitech", title: "Director of UX", description: "Working with government, fintech, and edtech clients across MENA." },
      { year: "2021", tag: "Syntax", title: "Lead UI/UX Designer", description: "Responsible for all digital products, defining interaction models, user flows, and UI specifications." },
      { year: "2012", tag: "Square Design", title: "Sketch Artist", description: "Created 300+ illustrated stories for children's books." },
      { year: "2010", tag: "Irbid National University", title: "Bachelor's Degree", description: "Graduated with Honors in Graphic Design." },
      { year: "2007", tag: "Upholsterer & Gamer", title: "Pre-Career", description: "Developing foundational skills and exploring creative passions." },
    ],
    rightEntries: [
      { year: "2019", tag: "TRT Arabi", title: "Motion & UX/UI Designer", description: "Designing motion graphics and user experiences for Arabic digital platforms." },
      { year: "2018", tag: "Al Jazeera (Qatar)", title: "Motion & Visual Designer", description: "Built visual identity for social platforms reaching millions." },
    ],
  },
  teaching: {
    label: "Teaching",
    leftEntries: [
      { year: "2026", tag: "IEEE Community", title: "Design Instructor", description: "UX/UI instruction across Jordanian universities." },
      { year: "2025", tag: "Government Universities + Zain", title: "UX/UI Instructor", description: "UX/UI instruction across all government universities in Jordan in partnership with Zain." },
      { year: "2022", tag: "Takween", title: "Cohort Facilitator & Design Instructor", description: "Facilitated design cohorts and led instruction sessions." },
      { year: "2021", tag: "Zain Jordan", title: "Design Instructor", description: "UX/UI training for internal teams." },
      { year: "2020", tag: "HTU", title: "Guest Lecturer", description: "University-level design thinking sessions." },
      { year: "2017", tag: "2017", title: "Design Community", description: "The Factory, Squared Garage, Build It Yourself, Design Battle." },
    ],
    rightEntries: [
      { year: "2025", tag: "42 Amman", title: "UX/UI Instructor", description: "UX/UI workshops for aspiring designers." },
      { year: "2022", tag: "YES JO + Zain", title: "Design Instructor", description: "Yearly kids product design program in partnership with Zain, teaching design using Figma." },
    ],
  },
  consulting: {
    label: "Consulting",
    leftEntries: [
      { year: "2025", tag: "Endeavor Jordan", title: "UX Consultant", description: "Strategic UX consulting and design system guidance for portfolio companies." },
      { year: "2024", tag: "Zain Startup Company", title: "UX Consultant", description: "UX strategy, product evaluation, and experience optimization for startup ventures." },
      { year: "2023", tag: "Endeavor Jordan", title: "UX Consultant", description: "Product audits and UX reviews for portfolio companies." },
      { year: "2019", tag: "TRT World", title: "UX Consultant", description: "UX consulting and experience evaluation for digital media platforms." },
    ],
    rightEntries: [],
  },
  content: {
    label: "Content Creation",
    leftEntries: [
      { year: "2023", tag: "Podcast Mic", title: "Co-Host Era", description: "Co-hosted Ftoor Designer Podcast, ranked in the top 10 across the MENA region — covering UX, design, and real industry stories.", link: "https://open.spotify.com/show/0zuVyPYDvZaJKwo5cTXbmg?si=64676e57f24d4af5" },
      { year: "2022", tag: "iPad Pro 6th Gen", title: "@alaa_aliens", description: "Hand-drawn UX educational content on Instagram." },
      { year: "2020", tag: "iPad Pro 3rd Gen", title: "Going Pro", description: "Apple Pencil + Procreate changed everything." },
      { year: "2018", tag: "iPad 5", title: "Leveling Up", description: "Better screen, better stylus, better doodles." },
      { year: "2015", tag: "iPad 3", title: "Going Mobile", description: "First iPad for drawing on the go." },
      { year: "2012", tag: "Wacom & Illustrator", title: "Digital Drawing", description: "Moved to Wacom tablet and Adobe Illustrator." },
      { year: "2007", tag: "Pencil & Paper", title: "Old School Drawing", description: "Where it all started — sketching by hand." },
    ],
    rightEntries: [],
  },
};

export const funTimelines: Record<TabKey, TimelineData> = {
  main: {
    label: "Main Career",
    leftEntries: [
      { year: "2025", tag: "Going Solo", title: "The One-Man Show", description: "Currently freelancing and somehow managing to be my own boss, employee, and IT department." },
      { year: "2025", tag: "Sitech", title: "The Director Era", description: "Got a fancy title. Still googled CSS flexbox. But hey, I directed things." },
      { year: "2021", tag: "Syntax", title: "The Lead Designer Arc", description: "Led a team, pushed pixels, debated border-radius values like they were life decisions." },
      { year: "2012", tag: "Square Design", title: "Drawing for a Living", description: "Drew 300+ illustrations for kids' books. My hand still hurts." },
      { year: "2010", tag: "Irbid National University", title: "The Degree", description: "Graduated with honors. Mom was proud. Dad asked when I'd get a real job." },
      { year: "2007", tag: "Couch Stitcher & Gamer", title: "The Origin Story", description: "Stitched couches by day, played PlayStation by night. Peak multitasking." },
    ],
    rightEntries: [
      { year: "2019", tag: "TRT Arabi", title: "Motion + UX Combo", description: "Made news look pretty and interactive. Arabic content, Turkish coffee, Jordanian designer." },
      { year: "2018", tag: "Al Jazeera (Qatar)", title: "The Qatar Chapter", description: "Designed things millions of people saw. Told nobody at dinner parties because they'd ask me to fix their Wi-Fi." },
    ],
  },
  teaching: {
    label: "Teaching",
    leftEntries: [
      { year: "2026", tag: "IEEE Community", title: "The IEEE Guy", description: "Teaching design across Jordanian universities. They keep inviting me back, so I must be doing something right." },
      { year: "2025", tag: "Government Universities + Zain", title: "The National Tour", description: "Taught UX/UI at every government university in Jordan. Basically became a traveling design professor." },
      { year: "2022", tag: "Takween", title: "Cohort Wrangler", description: "Facilitated design cohorts. Herding designers is like herding cats, but with better aesthetics." },
      { year: "2021", tag: "Zain Jordan", title: "Corporate Whisperer", description: "Taught design to Zain's internal teams. They now say 'user journey' in meetings." },
      { year: "2020", tag: "HTU", title: "The Cool Guest Lecturer", description: "Showed up, dropped design thinking knowledge, left before they could ask about grades." },
      { year: "2017", tag: "2017", title: "Community Builder", description: "The Factory, Squared Garage, Build It Yourself, Design Battle. Built all the things." },
    ],
    rightEntries: [
      { year: "2025", tag: "42 Amman", title: "Figma Evangelist", description: "Converted a room full of developers into Figma believers. Some clapped." },
      { year: "2022", tag: "YES JO + Zain", title: "Kids' Design Guru", description: "Taught kids product design. They're now better at Figma than most adults I know." },
    ],
  },
  consulting: {
    label: "Consulting",
    leftEntries: [
      { year: "2025", tag: "Endeavor Jordan", title: "The Return Client", description: "They liked me so much they hired me twice. Strategic UX consulting for their portfolio companies." },
      { year: "2024", tag: "Zain Startup Company", title: "Startup Whisperer", description: "Told startups their UX needed work. They paid me for it. Win-win." },
      { year: "2023", tag: "Endeavor Jordan", title: "The First Round", description: "Product audits and UX reviews. Basically getting paid to have opinions about buttons." },
      { year: "2019", tag: "TRT World", title: "International Consultant", description: "UX consulting for a global media platform. Sounds fancy. It was." },
    ],
    rightEntries: [],
  },
  content: {
    label: "Content Creation",
    leftEntries: [
      { year: "2023", tag: "Podcast Mic", title: "The Podcast Arc", description: "Got a mic, a co-host, and zero radio training — somehow landed a top 10 design podcast in MENA. Ftoor Designer Podcast: where we talk UX and pretend we have our lives together.", link: "https://open.spotify.com/show/0zuVyPYDvZaJKwo5cTXbmg?si=64676e57f24d4af5" },
      { year: "2022", tag: "iPad Pro 6th Gen", title: "Professional Doodler", description: "Drawing UX concepts at 2am. My followers think I'm organized. I'm not." },
      { year: "2020", tag: "iPad Pro 3rd Gen", title: "The Pro Era", description: "Apple Pencil + Procreate = dangerous combination. Sleep became optional." },
      { year: "2018", tag: "iPad 5", title: "Upgrade Unlocked", description: "Better iPad, same obsession. Now I could doodle AND watch Netflix." },
      { year: "2015", tag: "iPad 3", title: "Drawing on Glass", description: "First iPad for drawing. It was heavy, slow, and I loved every pixel." },
      { year: "2012", tag: "Wacom & Illustrator", title: "Digital Awakening", description: "Got a Wacom tablet. Drew on the desk while looking at the screen. Brain hurt for weeks." },
      { year: "2007", tag: "Pencil & Paper", title: "Cave Drawings", description: "Started drawing with pencil and paper like a prehistoric artist. No undo button." },
    ],
    rightEntries: [],
  },
};

// Squiggly underline using the actual Figma SVG path
function SquigglyUnderline({ color }: { color: string }) {
  return (
    <div className="h-[12.5px] w-[97px]">
      <svg className="block size-full" fill="none" viewBox="0 0 97.2701 12.4564">
        <path d={squigglySvg.p3bfecf00} fill={color} />
      </svg>
    </div>
  );
}

function TimelineItem({ entry, isLast, accentColor, index = 0 }: { entry: TimelineEntry; isLast: boolean; accentColor: string; index?: number }) {
  return (
    <motion.div
      className="flex gap-[8px]"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Year */}
      <span
        className="font-['IBM_Plex_Serif'] font-bold text-[18px] text-right w-[52px] shrink-0 whitespace-nowrap pt-[1px]"
        style={{ color: accentColor }}
      >
        {entry.year}
      </span>

      {/* Dot + Line — self-stretch ensures it fills the full row height for connected lines */}
      <div className="flex flex-col items-center gap-[3px] shrink-0 self-stretch">
        <motion.div
          className="w-[10.2px] h-[10.2px] rounded-full shrink-0 mt-[1px]"
          style={{ backgroundColor: accentColor }}
          initial={{ scale: 0 }}
          whileInView={{ scale: [0, 1.6, 1] }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        {!isLast && (
          <motion.div
            className="w-[1.5px] flex-1 origin-top"
            style={{ backgroundColor: accentColor, opacity: 0.45 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-[15px] flex-1 ${isLast ? '' : 'pb-[40px]'}`}>
        <span
          className="inline-block self-start text-white font-['IBM_Plex_Serif'] text-[15px] px-[7px] leading-[24px]"
          style={{ backgroundColor: accentColor, textShadow: '0px 1px 2px rgba(0,0,0,0.25)' }}
        >
          {entry.tag}
        </span>
        <h4 className="font-['IBM_Plex_Serif'] font-bold text-black text-[24px] leading-tight">
          {entry.title}
        </h4>
        <p className="font-['IBM_Plex_Serif'] text-black text-[16px] leading-[24px]">
          {entry.description}
        </p>
        {entry.link && (
          <a href={entry.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-['IBM_Plex_Serif'] text-[15px] underline hover:opacity-70 transition-opacity" style={{ color: accentColor }}>
            Listen on Spotify →
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function WorkExperienceSection({ embedded = false }: { embedded?: boolean }) {
  const { isProfessional, mode } = useMode();
  const [activeTab, setActiveTab] = useState<TabKey>("main");
  const timelines = isProfessional ? professionalTimelines : funTimelines;
  const tabs: TabKey[] = ["main", "teaching", "consulting", "content"];

  const currentTimeline = timelines[activeTab];
  const accentColor = tabAccentColors[activeTab];

  return (
    <section id="experience" className={embedded ? "w-full" : "w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12"}>
      <motion.div
        key={mode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {!embedded && <SectionTitle className="mb-[40px] md:mb-[54px]">{isProfessional ? "Work Experience" : "How I Got Here"}</SectionTitle>}

        {/* Tabs */}
        <div className="flex gap-6 md:gap-[50px] mb-8 md:mb-[54px] overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
          {tabs.map((tab) => {
            const tabColor = tabAccentColors[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex flex-col items-center gap-[4px] shrink-0 h-[50px] cursor-pointer"
              >
                <span
                  className="font-['IBM_Plex_Serif'] font-black text-[16px] md:text-[20px] transition-colors text-center whitespace-nowrap"
                  style={{ color: activeTab === tab ? tabColor : "#c1b6a5" }}
                >
                  {timelines[tab].label}
                </span>
                <div className="h-[12.5px] w-[97px]">
                  {activeTab === tab && (
                    <motion.div layoutId="tab-squiggle" transition={{ type: "spring", stiffness: 400, damping: 34 }}>
                      <SquigglyUnderline color={tabColor} />
                    </motion.div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Two-column layout for lg+ screens */}
            <div className="hidden lg:flex items-start gap-[80px] xl:gap-[142px]">
              {/* Left column */}
              <div className="flex flex-col flex-1 min-w-0">
                {currentTimeline.leftEntries.map((entry, i) => (
                  <TimelineItem
                    key={`${entry.year}-${entry.tag}`}
                    entry={entry}
                    isLast={i === currentTimeline.leftEntries.length - 1}
                    accentColor={accentColor}
                    index={i}
                  />
                ))}
              </div>
              {/* Right column — vertically centered */}
              {currentTimeline.rightEntries.length > 0 && (
                <div className="flex flex-col flex-1 min-w-0">
                  {currentTimeline.rightEntries.map((entry, i) => (
                    <TimelineItem
                      key={`${entry.year}-${entry.tag}`}
                      entry={entry}
                      isLast={i === currentTimeline.rightEntries.length - 1}
                      accentColor={accentColor}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Single column for mobile/tablet */}
            <div className="lg:hidden flex flex-col">
              {[...currentTimeline.leftEntries, ...currentTimeline.rightEntries]
                .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                .map((entry, i, arr) => (
                  <TimelineItem
                    key={`${entry.year}-${entry.tag}`}
                    entry={entry}
                    isLast={i === arr.length - 1}
                    accentColor={accentColor}
                    index={i}
                  />
                ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}