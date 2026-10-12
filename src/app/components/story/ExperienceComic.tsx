/*
 * Experience as a comic. Five characters, all Ala'a: the designer, the teacher,
 * the consultant, the content creator and the father. Pick one from the cast
 * and read that character's storyline as comic panels along a drawn road.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMode } from "../ModeContext";
import { professionalTimelines, funTimelines, type TabKey, type TimelineEntry } from "../WorkExperienceSection";
import { Journey } from "./Journey";
import { Scribble } from "../ui/Kit";
import { RoughBox } from "../ui/RoughBox";
import charDesigner from "../../../assets/cast/designer.webp";
import charTeacher from "../../../assets/cast/teacher.webp";
import charConsultant from "../../../assets/cast/consultant.webp";
import charCreator from "../../../assets/cast/creator.webp";
import charFather from "../../../assets/cast/father.webp";

type CastKey = TabKey | "father";

const CAST: { k: CastKey; img: string; color: string; name: [string, string]; role: [string, string]; line: [string, string] }[] = [
  { k: "main", img: charDesigner, color: "#ff614c", name: ["the designer", "the designer"], role: ["UX/UI, 15+ years, MENA", "pushes pixels for money"], line: ["Every product I touched, from couches to dashboards.", "From couches to dashboards. Long story. Six panels."] },
  { k: "teaching", img: charTeacher, color: "#6A4CFF", name: ["the teacher", "the teacher"], role: ["universities, bootcamps, Zain, 42 Amman", "talks at people, professionally"], line: ["If I can't draw it for a room of beginners, I don't understand it yet.", "Sometimes they clap. Sometimes they want the Figma shortcuts."] },
  { k: "consulting", img: charConsultant, color: "#53B858", name: ["the consultant", "the consultant"], role: ["audits, strategy, second opinions", "tells you what's wrong (nicely)"], line: ["Three things that matter, said kindly, then fixed together.", "You built a thing. Something feels off. I find it. I'm sorry in advance."] },
  { k: "content", img: charCreator, color: "#FF4C79", name: ["the content creator", "the content creator"], role: ["@alaa_aliens, Ftoor Designer podcast", "draws UX jokes at 2am"], line: ["Hand-drawn UX explainers, and a podcast that made the top ten.", "Doodles that explain UX. It's therapy, honestly. For me."] },
  { k: "father", img: charFather, color: "#FFC53D", name: ["the father", "the dad"], role: ["Alma & Eleen's product team", "two clients, zero budget"], line: ["My two toughest users. Everything I build at home is for them.", "They don't do UX feedback. They just say \"boring\" and leave."] },
];

const FATHER: Record<"pro" | "fun", { year: string; tag: string; title: string; description: string }[]> = {
  pro: [
    { year: "2026", tag: "Siba", title: "A study buddy with a face", description: "Textbook photos become parent-checked lessons, games and quizzes. A character, a voice, and a parent who always has the last word." },
    { year: "2026", tag: "Siba List", title: "The allowance app", description: "Points instead of checkmarks, proof in the app, a timer for piano, and a Friday that stopped being an argument." },
    { year: "2022", tag: "YES JO + Zain", title: "Teaching kids to design", description: "A yearly product design program for kids. Theirs are the most honest reviews I get." },
    { year: "before", tag: "Dad", title: "Two daughters, two testers", description: "Alma plays the piano, Eleen plays guitar. Both review my work harder than any client." },
  ],
  fun: [
    { year: "2026", tag: "Siba", title: "The study buddy", description: "Built them an app that says their names and never shows a red X. Alma asked if it could do her homework instead." },
    { year: "2026", tag: "Siba List", title: "The allowance negotiations", description: "Points, a ladder, a free pass a week. Alma wanted a better exchange rate. Talks are ongoing." },
    { year: "2022", tag: "YES JO + Zain", title: "Kids' design guru", description: "Taught kids product design. They're now better at Figma than most adults I know." },
    { year: "before", tag: "Dad", title: "The two clients", description: "Alma on piano, Eleen on guitar, both on my case. Zero budget. Infinite scope." },
  ],
};

function entries(k: CastKey, pro: boolean): TimelineEntry[] {
  if (k === "father") return FATHER[pro ? "pro" : "fun"];
  const t = (pro ? professionalTimelines : funTimelines)[k];
  return [...t.leftEntries, ...t.rightEntries].sort((a, b) => Number(b.year) - Number(a.year));
}

export function ExperienceComic() {
  const { isProfessional } = useMode();
  const k = isProfessional ? 0 : 1;
  const [who, setWho] = useState<CastKey>("main");
  const c = CAST.find((x) => x.k === who)!;
  const stops = entries(who, isProfessional).map((e) => ({ date: e.year, title: e.title, body: `${e.tag} · ${e.description}` }));

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* the cast */}
      <div>
        <Scribble className="mb-3">{isProfessional ? "the cast (it's all me). pick one." : "the cast. all me. pick your fighter."}</Scribble>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-5" role="tablist">
          {CAST.map((m, i) => {
            const on = m.k === who;
            return (
              <motion.button
                key={m.k}
                role="tab"
                aria-selected={on}
                onClick={() => setWho(m.k)}
                whileHover={{ y: -6, rotate: i % 2 ? 1.5 : -1.5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: on ? 1 : 0.94, opacity: on ? 1 : 0.7 }}
                className="relative text-left"
              >
                <RoughBox fill={on ? `${m.color}2a` : "#fffaf1"} stroke={on ? m.color : "#1d1a17"} strokeWidth={on ? 2 : 1.2} radius={12} seed={i * 19 + 2} className="p-2 md:p-3 flex flex-col items-center gap-1.5">
                  <img src={m.img} alt="" draggable={false} className="w-full aspect-square object-contain" />
                  <span className="font-display lowercase text-[16px] md:text-[20px] leading-none text-center" style={{ color: on ? m.color : "#1d1a17" }}>{m.name[k]}</span>
                  <span className="hidden sm:block font-['Work_Sans'] text-[10.5px] md:text-[11.5px] text-black/55 text-center leading-tight">{m.role[k]}</span>
                </RoughBox>
                {on && (
                  <motion.span layoutId="cast-pick" className="absolute -top-2 -right-2 w-6 h-6 rounded-full border border-black bg-[#fffaf1] text-[12px] flex items-center justify-center" transition={{ type: "spring", stiffness: 400, damping: 24 }}>
                    ★
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* the character's page */}
      <AnimatePresence mode="wait">
        <motion.section
          key={who}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-center mb-12 md:mb-16">
            <motion.img
              src={c.img}
              alt=""
              className="w-[180px] md:w-[220px] mx-auto"
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: [-3, 3, -3] }}
              transition={{ scale: { type: "spring", stiffness: 200, damping: 14 }, rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            />
            <div>
              <h2 className="font-display lowercase text-[44px] md:text-[72px] leading-[0.95]" style={{ color: c.color }}>{c.name[k]}</h2>
              <p className="font-['Work_Sans'] uppercase tracking-[0.16em] text-[12px] text-black/50 mt-2">{c.role[k]}</p>
              <motion.p
                initial={{ scale: 0, rotate: -6 }}
                animate={{ scale: 1, rotate: -1.5 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 14 }}
                className="relative inline-block mt-5 max-w-[520px] rounded-[18px] border-2 border-[#1d1a17] bg-white px-5 py-3 font-['Shantell_Sans',cursive] text-[16px] md:text-[18px] leading-snug shadow-[3px_3px_0_0_#1d1a17]"
              >
                {c.line[k]}
                <span aria-hidden className="absolute -left-2.5 top-6 w-4 h-4 bg-white border-l-2 border-b-2 border-[#1d1a17] rotate-45" />
              </motion.p>
            </div>
          </div>
          <Journey stops={stops} color={c.color} />
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
