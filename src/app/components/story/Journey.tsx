/*
 * The build journey as a hand-drawn road: a wobbly line that draws itself as you
 * scroll, with stops that pop in. Alternates sides on desktop, one column on phones.
 */
import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export interface Stop {
  date: string;
  title: string;
  body: string;
  img?: string;
}

export function Journey({ stops, color }: { stops: Stop[]; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <div ref={ref} className="relative">
      {/* the road */}
      <svg aria-hidden className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-0 h-full w-[40px] overflow-visible" viewBox="0 0 40 1000" preserveAspectRatio="none" fill="none">
        <path d="M20 0 C 25 80, 15 160, 20 250 S 25 420, 20 500 S 15 680, 20 760 S 25 920, 20 1000" stroke="#1d1a17" strokeOpacity="0.12" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <motion.path d="M20 0 C 25 80, 15 160, 20 250 S 25 420, 20 500 S 15 680, 20 760 S 25 920, 20 1000" stroke={color} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: draw }} />
      </svg>

      <ol className="relative flex flex-col gap-10 md:gap-4">
        {stops.map((s, i) => {
          const left = i % 2 === 0;
          return (
            <li key={s.title} className="relative grid grid-cols-[40px_1fr] md:grid-cols-[1fr_60px_1fr] gap-4 md:gap-0 items-start">
              {/* dot */}
              <motion.span
                aria-hidden
                className="md:col-start-2 row-start-1 justify-self-center mt-2 w-5 h-5 rounded-full border-[3px] border-black bg-[#fffaf1] z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: [0, 1.5, 1], backgroundColor: ["#fffaf1", color, color] }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className={`row-start-1 col-start-2 ${left ? "md:col-start-1 md:pr-10 md:text-right md:items-end" : "md:col-start-3 md:pl-10"} flex flex-col gap-2`}
                initial={{ opacity: 0, x: left ? -30 : 30, rotate: left ? -2 : 2 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                <span className="self-start md:self-auto inline-block font-['Work_Sans'] font-semibold text-[11px] uppercase tracking-[0.14em] px-2 py-1 rounded-[6px] text-white" style={{ background: "#1d1a17" }}>
                  {s.date}
                </span>
                <h4 className="font-['Playfair_Display'] font-bold text-[22px] md:text-[27px] leading-tight">{s.title}</h4>
                <p className="font-['IBM_Plex_Serif'] text-[15px] md:text-[17px] leading-[1.6] text-black/80 max-w-[460px]">{s.body}</p>
                {s.img && (
                  <motion.img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className={`w-[96px] md:w-[120px] ${left ? "md:self-end" : ""}`}
                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
