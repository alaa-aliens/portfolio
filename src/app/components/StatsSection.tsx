import svgPaths from "../../imports/svg-drsth3odo8";
import svgPathsFun from "../../imports/svg-gw2llaquvl";
import { useMode } from "./ModeContext";
import { motion } from "motion/react";
import { PenWipe, Reveal } from "./motion/Doodles";

function StatNumber({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-[80px] md:h-[114px] w-[140px] md:w-[200px]">
      {children}
    </div>
  );
}

function StatSvg1() {
  return (
    <svg className="w-[80px] md:w-[114px] h-[64px] md:h-[91px]" fill="none" viewBox="0 0 114.286 91.4286">
      <path d={svgPaths.p1789a600} fill="#FE6150" />
      <path d={svgPaths.p23a0200} fill="#FE6150" />
      <path d={svgPaths.p6a89900} fill="#FE6150" />
    </svg>
  );
}

function StatSvg2() {
  return (
    <svg className="w-[110px] md:w-[156px] h-[80px] md:h-[114px]" fill="none" viewBox="0 0 155.714 114.286">
      <path d={svgPaths.p29089612} fill="#FE6150" />
      <path d={svgPaths.p3eaec100} fill="#FE6150" />
      <path d={svgPaths.p2d889880} fill="#FE6150" />
      <path d={svgPaths.p1fdbb900} fill="#FE6150" />
    </svg>
  );
}

function StatSvg3() {
  return (
    <svg className="w-[94px] md:w-[134px] h-[69px] md:h-[98px]" fill="none" viewBox="0 0 134 98">
      <path d={svgPaths.p2fd06b00} fill="#FE6150" />
      <path d={svgPaths.p28641400} fill="#FE6150" />
      <path d={svgPaths.pb220a00} fill="#FE6150" />
    </svg>
  );
}

function StatSvg4() {
  return (
    <svg className="w-[82px] md:w-[116px] h-[66px] md:h-[94px]" fill="none" viewBox="0 0 116 94">
      <path d={svgPaths.p142ea700} fill="#FE6150" />
      <path d={svgPaths.p4e9f100} fill="#FE6150" />
      <path d={svgPaths.p3a4cde00} fill="#FE6150" />
    </svg>
  );
}

const professionalStats = [
  { number: <StatSvg1 />, label: "Years Experience" },
  { number: <StatSvg2 />, label: "Shipped Projects" },
  { number: <StatSvg3 />, label: "Clients Across MENA" },
  { number: <StatSvg4 />, label: "Workshop Attendees" },
];

// Fun mode SVG stat illustrations from Figma
function FunStatSvg1() {
  return (
    <svg className="w-[140px] md:w-[196px] h-[80px] md:h-[114px]" fill="none" viewBox="0 0 196 114">
      <path d={svgPathsFun.p1111e00} fill="#FE6150" />
      <path d={svgPathsFun.p29c0c400} fill="#FE6150" />
      <path d={svgPathsFun.p197137c0} fill="#FE6150" />
      <path d={svgPathsFun.p26562400} fill="#FE614F" />
      <path d={svgPathsFun.pcc7aaa0} fill="#FE6150" />
      <path d={svgPathsFun.p3783c3c0} fill="#FE6150" />
    </svg>
  );
}

function FunStatSvg2() {
  return (
    <svg className="w-[82px] md:w-[116px] h-[66px] md:h-[94px]" fill="none" viewBox="0 0 116 94.699">
      <path d={svgPathsFun.p1f0a7d00} fill="#FE614F" />
    </svg>
  );
}

function FunStatSvg3() {
  return (
    <svg className="w-[80px] md:w-[114px] h-[64px] md:h-[91px]" fill="none" viewBox="0 0 114.286 91.4286">
      <path d={svgPathsFun.p200ef900} fill="#FE6150" />
      <path d={svgPathsFun.p1f0b5d00} fill="#FE6150" />
    </svg>
  );
}

function FunStatSvg4() {
  return (
    <svg className="w-[140px] md:w-[200px] h-[80px] md:h-[114px]" fill="none" viewBox="0 0 200 114.286">
      <path d={svgPathsFun.p34feaf00} fill="#FF614C" fillOpacity="0.953" />
    </svg>
  );
}

const funStats = [
  { number: <FunStatSvg1 />, label: "Doodles Drawn (and Still Not Enough)" },
  { number: <FunStatSvg2 />, label: 'Daughters Who Think I "Just Draw"' },
  { number: <FunStatSvg3 />, label: "PlayStation Generations Survived" },
  { number: <FunStatSvg4 />, label: "Cups of Coffee to Stay Alive" },
];

export function StatsSection() {
  const { isProfessional, mode } = useMode();

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-8">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-6 md:gap-[90px]"
      >
        {isProfessional
          ? professionalStats.map((stat, i) => (
              <div key={i} className="group flex flex-col items-center gap-3 md:w-[200px]">
                <StatNumber>
                  <PenWipe delay={i * 0.18} duration={0.8} className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
                    {stat.number}
                  </PenWipe>
                </StatNumber>
                <Reveal delay={0.3 + i * 0.18} y={10}>
                <p className="font-['IBM_Plex_Serif'] text-black text-[14px] md:text-[20px] text-center">
                  {stat.label}
                </p>
                </Reveal>
              </div>
            ))
          : funStats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-[14px] shrink-0 md:w-[200px]">
                <div className="group flex flex-col items-center justify-center h-[80px] md:h-[114px]">
                  <PenWipe delay={i * 0.18} duration={0.8} className="transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    {stat.number}
                  </PenWipe>
                </div>
                <Reveal delay={0.3 + i * 0.18} y={10}>
                <p className="font-['IBM_Plex_Serif'] text-black text-[14px] md:text-[20px] text-center">
                  {stat.label}
                </p>
                </Reveal>
              </div>
            ))}
      </motion.div>
    </section>
  );
}