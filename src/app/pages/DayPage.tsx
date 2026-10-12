/*
 * v2 home: "a day in Ala'a's life". One scroll = one day, 06:30 → 02:00.
 * The sky behind everything changes colour with the hour, a little clock
 * ticks along (tap it to jump to any hour), and each hour opens a side of him.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMode } from "../components/ModeContext";
import { HeroSection } from "../components/HeroSection";
import { StatsSection } from "../components/StatsSection";
import { WorkStrip } from "../components/home/WorkStrip";
import { Sketchbook } from "../components/home/Sketchbook";
import { Journey } from "../components/story/Journey";
import { addScore } from "../components/play/Score";
import { Button, RoughBox } from "../components/ui/Kit";
import { projects } from "../data/projects";
import { usePageMeta } from "../usePageMeta";
import imgFamily from "../../assets/comic/family.webp";
import imgTeach from "../../assets/comic/teach.webp";
import imgConsultant from "../../assets/cast/consultant.webp";
import imgFather from "../../assets/cast/father.webp";
import imgCreator from "../../assets/cast/creator.webp";
import imgDesk from "../../assets/comic/news.webp";
import imgNight from "../../assets/covers/contact.webp";

type L = [string, string]; // [professional, fun]

interface Hour {
  id: string;
  time: string; // "07:30"
  minutes: number; // minutes since 06:30, for the clock
  sky: string;
  dark?: boolean;
  label: L; // short name for the jump menu
}

const HOURS: Hour[] = [
  { id: "h0630", time: "06:30", minutes: 0, sky: "#f9dcc8", label: ["the alarm", "snooze #3"] },
  { id: "h0730", time: "07:30", minutes: 60, sky: "#fdecd0", label: ["the father", "school run chaos"] },
  { id: "h0900", time: "09:00", minutes: 150, sky: "#fef3dd", label: ["the designer", "coffee + pixels"] },
  { id: "h1200", time: "12:00", minutes: 330, sky: "#fff7e4", label: ["the consultant", "meeting #4"] },
  { id: "h1500", time: "15:00", minutes: 510, sky: "#fbe1b4", label: ["the teacher", "whiteboard time"] },
  { id: "h1800", time: "18:00", minutes: 690, sky: "#f6b48c", label: ["the road home", "traffic thoughts"] },
  { id: "h2100", time: "21:00", minutes: 870, sky: "#3d3a6e", dark: true, label: ["the creator", "kids asleep. finally."] },
  { id: "h0200", time: "02:00", minutes: 1170, sky: "#1c1e3d", dark: true, label: ["one more thing", "why am i awake"] },
];

/* ---------- colour helpers ---------- */
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
const fmt = (mins: number) => {
  const total = (6 * 60 + 30 + mins) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(Math.floor(total % 60)).padStart(2, "0")}`;
};

/* Where are we in the day? Returns [index of current hour, 0..1 progress to the next]. */
function useDayPosition() {
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      const tops = HOURS.map((h) => document.getElementById(h.id)?.getBoundingClientRect().top ?? Infinity);
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= mid) i = k;
      const a = tops[i], b = tops[i + 1];
      const t = b === undefined || !isFinite(b) ? 0 : Math.min(1, Math.max(0, (mid - a) / (b - a)));
      setPos((p) => (p[0] === i && Math.abs(p[1] - t) < 0.01 ? p : [i, t]));
    };
    const on = () => (raf ||= requestAnimationFrame(read));
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return pos;
}

/* ---------- the sky ---------- */
function Sky({ i, t }: { i: number; t: number }) {
  const a = HOURS[i], b = HOURS[i + 1] ?? a;
  // ease the blend so most of a scene keeps its own colour
  const e = t < 0.55 ? 0 : (t - 0.55) / 0.45;
  const col = mix(a.sky, b.sky, e);
  const night = (a.dark ? 1 - (b.dark ? 0 : e) : b.dark ? e : 0);
  return createPortal(
    <div aria-hidden className="fixed inset-0 -z-[1] pointer-events-none" style={{ background: col, transition: "background 120ms linear" }}>
      {/* sun / moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          right: "8%",
          top: `${18 + Math.abs(5.5 - (i + t)) * 6}%`,
          background: night > 0.5 ? "#fdecd0" : "#ffb347",
          opacity: 0.35 + night * 0.4,
          boxShadow: night > 0.5 ? "inset -26px -8px 0 0 rgba(0,0,0,0.18)" : "0 0 80px 30px rgba(255,180,80,0.35)",
        }}
      />
      {/* stars at night */}
      <div className="absolute inset-0" style={{ opacity: night }}>
        {Array.from({ length: 40 }, (_, k) => (
          <span
            key={k}
            className="absolute rounded-full bg-[#fdecd0]"
            style={{ width: 2 + (k % 3), height: 2 + (k % 3), left: `${(k * 37) % 100}%`, top: `${(k * 53) % 90}%`, opacity: 0.4 + ((k * 7) % 6) / 10 }}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}

/* ---------- the clock (tap to jump) ---------- */
function DayClock({ i, t }: { i: number; t: number }) {
  const { isProfessional } = useMode();
  const k = isProfessional ? 0 : 1;
  const [open, setOpen] = useState(false);
  const a = HOURS[i], b = HOURS[i + 1] ?? a;
  const mins = a.minutes + (b.minutes - a.minutes) * (t < 0.55 ? 0 : (t - 0.55) / 0.45);
  const clock = 6 * 60 + 30 + mins;
  const hourDeg = ((clock / 60) % 12) * 30;
  const minDeg = (clock % 60) * 6;
  const dark = a.dark;

  const jump = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return createPortal(
    <div className="fixed z-[60] left-3 md:left-6 top-[84px] md:top-[104px]">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="What time is it? Tap to jump to another hour"
        className="flex items-center gap-2.5 rounded-full border border-black/80 bg-[#fffaf1] pl-1.5 pr-3.5 py-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,0.85)] hover:-rotate-2 transition-transform"
      >
        <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
          <circle cx="20" cy="20" r="17" fill={dark ? "#2b2c55" : "#fdecd0"} stroke="#1d1a17" strokeWidth="2" />
          {[0, 90, 180, 270].map((d) => (
            <line key={d} x1="20" y1="5.5" x2="20" y2="8.5" stroke={dark ? "#fdecd0" : "#1d1a17"} strokeWidth="2" strokeLinecap="round" transform={`rotate(${d} 20 20)`} />
          ))}
          <line x1="20" y1="20" x2="20" y2="11.5" stroke={dark ? "#fdecd0" : "#1d1a17"} strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${hourDeg} 20 20)`} />
          <line x1="20" y1="20" x2="20" y2="7.5" stroke="#ff614c" strokeWidth="2" strokeLinecap="round" transform={`rotate(${minDeg} 20 20)`} />
          <circle cx="20" cy="20" r="2" fill="#1d1a17" />
        </svg>
        <span className="flex flex-col items-start leading-none">
          <span className="font-display text-[20px] tabular-nums">{fmt(mins)}</span>
          <span className="font-['Shantell_Sans',cursive] text-[10.5px] text-black/55 mt-0.5 whitespace-nowrap">{a.label[k]}</span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="mt-2 w-[230px] rounded-[16px] border border-black/80 bg-[#fffaf1] p-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.85)]"
          >
            <li className="px-2 pt-1 pb-2 font-['Shantell_Sans',cursive] text-[12px] text-black/55">{isProfessional ? "jump to any hour" : "skip ahead. i won't tell."}</li>
            {HOURS.map((h, n) => (
              <li key={h.id}>
                <button onClick={() => jump(h.id)} className={`w-full flex items-baseline gap-3 rounded-[10px] px-2 py-1.5 text-left hover:bg-[#fdecd0] ${n === i ? "bg-[#fdecd0]" : ""}`}>
                  <span className="font-display text-[18px] tabular-nums text-[#ff614c] w-[52px]">{h.time}</span>
                  <span className="font-['Work_Sans'] text-[13.5px]">{h.label[k]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

/* ---------- a scene: big hour, a drawing, a line ---------- */
function SceneHead({ hour, title, line, img, flip = false }: { hour: Hour; title: L; line: L; img?: string; flip?: boolean }) {
  const { isProfessional } = useMode();
  const k = isProfessional ? 0 : 1;
  const ink = hour.dark ? "#fdecd0" : "#1d1a17";
  return (
    <div className={`max-w-[1100px] mx-auto px-5 md:px-12 flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-16`}>
      {img && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: flip ? 4 : -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: flip ? 1.5 : -1.5 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="shrink-0 w-[240px] md:w-[340px]"
        >
          <RoughBox fill={hour.dark ? "#fdecd0" : "#fffaf1"} radius={14} strokeWidth={1.6} seed={hour.minutes + 7} className="aspect-square p-5 flex items-center justify-center">
            <img src={img} alt="" draggable={false} className="max-w-full max-h-full object-contain" />
          </RoughBox>
        </motion.div>
      )}
      <div className={`flex-1 text-center ${flip ? "md:text-right" : "md:text-left"}`} style={{ color: ink }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-[84px] md:text-[132px] leading-[0.85] tabular-nums text-[#ff614c]"
        >
          {hour.time}
        </motion.p>
        <h2 className="font-display lowercase text-[38px] md:text-[56px] leading-[0.95] mt-3">{title[k]}</h2>
        <p className="font-['IBM_Plex_Serif'] text-[17px] md:text-[19px] leading-relaxed mt-4 max-w-[520px] mx-auto md:mx-0 opacity-80" style={flip ? { marginLeft: "auto" } : undefined}>
          {line[k]}
        </p>
      </div>
    </div>
  );
}

/* a project as a little "episode" card */
function Episode({ slug, i }: { slug: string; i: number }) {
  const { isProfessional } = useMode();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <motion.div whileHover={{ y: -6, rotate: 0 }} initial={{ rotate: i % 2 ? 1.5 : -1.5 }} className="w-full max-w-[420px]">
      <Link to={`/work/${p.slug}`} className="block group">
        <RoughBox fill={p.brand ?? "#fffaf1"} radius={12} strokeWidth={1.5} seed={i * 23 + 5} className="aspect-[4/3] flex items-center justify-center">
          {p.cover && <img src={p.cover} alt="" className="max-w-[80%] max-h-[80%] object-contain group-hover:scale-105 transition-transform duration-500" />}
        </RoughBox>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display lowercase text-[30px] leading-none">{p.name}</h3>
          <span className="font-['Shantell_Sans',cursive] text-[13px] text-[#ff614c]">{isProfessional ? "read the episode →" : "binge it →"}</span>
        </div>
        <p className="font-['Work_Sans'] text-[14.5px] text-black/70 mt-1.5">{isProfessional ? p.proHook : p.funHook ?? p.proHook}</p>
      </Link>
    </motion.div>
  );
}

const ROAD = {
  pro: [
    { date: "2007", title: "Upholsterer & gamer", body: "Stitching couches in Irbid by day, PlayStation by night." },
    { date: "2010", title: "Graphic design, with honours", body: "The first time someone paid me to draw." },
    { date: "2012", title: "300+ children's book illustrations", body: "Square Design. My hand still remembers every one." },
    { date: "2018", title: "Al Jazeera, then TRT Arabi", body: "Motion and visual design for news, in Doha and Istanbul." },
    { date: "2021", title: "Lead UI/UX at Syntax", body: "Digital products, interaction models, border-radius debates." },
    { date: "2025", title: "Director of UX, and solo", body: "Sitech/Azm by day, my own consultancy the rest of the time." },
  ],
  fun: [
    { date: "2007", title: "The origin story", body: "Couches by day, PlayStation by night." },
    { date: "2010", title: "The degree", body: "Honours. Dad asked when I'd get a real job." },
    { date: "2012", title: "Drawing for a living", body: "300+ kids' book illustrations. My hand still hurts." },
    { date: "2018", title: "The news years", body: "Learned to design while everything is breaking." },
    { date: "2021", title: "The lead designer arc", body: "Debated border-radius like it was a life decision." },
    { date: "2025", title: "The director era", body: "Fancy title. Still googled flexbox." },
  ],
};

export function DayPage() {
  const { isProfessional } = useMode();
  usePageMeta();
  const [i, t] = useDayPosition();

  // a point for every new hour you live through
  const seen = useRef(new Set<number>());
  useEffect(() => {
    if (i === 0 || seen.current.has(i)) return;
    seen.current.add(i);
    addScore(5, `${HOURS[i].time} ✓`, `day-${HOURS[i].id}`);
    if (i === HOURS.length - 1) addScore(15, isProfessional ? "you made it to 2am" : "survived the whole day", "day-complete", true);
  }, [i, isProfessional]);

  const H = useMemo(() => Object.fromEntries(HOURS.map((h) => [h.id, h])) as Record<string, Hour>, []);
  const gap = "pt-36 md:pt-56";

  return (
    <main className="relative z-[1] flex flex-col">
      <Sky i={i} t={t} />
      <DayClock i={i} t={t} />

      {/* 06:30 */}
      <section id="h0630">
        <HeroSection />
      </section>

      {/* 07:30 the father */}
      <section id="h0730" className={gap}>
        <SceneHead
          hour={H.h0730}
          img={imgFamily}
          title={["breakfast, two daughters, one dad", "breakfast negotiations"]}
          line={[
            "Alma and Eleen are my toughest users. Most of what I build at home starts at this table, usually with someone saying \"boring\".",
            "Two clients, zero budget, infinite scope. They don't file tickets. They just stop using it.",
          ]}
        />
        <div className="max-w-[1000px] mx-auto px-5 md:px-12 mt-14 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-14 justify-items-center">
          <Episode slug="siba" i={0} />
          <Episode slug="siba-list" i={1} />
        </div>
      </section>

      {/* 09:00 the designer */}
      <section id="h0900" className={gap}>
        <SceneHead
          hour={H.h0900}
          img={imgDesk}
          flip
          title={["coffee, then pixels", "coffee #1. pixels #1,000"]}
          line={[
            "Director of UX by day. Fifteen years of products across MENA: games, fintech, news, government.",
            "The coffee is load-bearing. Fifteen years of this and I still zoom to 400% to check a border.",
          ]}
        />
        <StatsSection />
        <WorkStrip />
      </section>

      {/* 12:00 the consultant */}
      <section id="h1200" className={gap}>
        <SceneHead
          hour={H.h1200}
          img={imgConsultant}
          title={["meeting, meeting, lunch?, meeting", "meeting #4. lunch is a rumour."]}
          line={[
            "Consulting is mostly listening. Then three things that matter, said kindly, fixed together, round after round.",
            "You built a thing. Something feels off. I find it. Then we have six more meetings about it.",
          ]}
        />
        <div className="max-w-[1000px] mx-auto px-5 md:px-12 mt-14 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-14 justify-items-center">
          <Episode slug="carseer" i={2} />
          <Episode slug="trackhawk" i={3} />
        </div>
      </section>

      {/* 15:00 the teacher */}
      <section id="h1500" className={gap}>
        <SceneHead
          hour={H.h1500}
          img={imgTeach}
          flip
          title={["the whiteboard hour", "talking at people, professionally"]}
          line={[
            "Universities, bootcamps, Zain, 42 Amman, HTU. If I can't draw it for a room of beginners, I don't understand it yet.",
            "Sometimes they clap. Sometimes they just want the Figma shortcuts. Both count.",
          ]}
        />
        <div className="flex justify-center mt-10">
          <Button to="/experience">{isProfessional ? "every workshop, every room" : "the teacher arc"} →</Button>
        </div>
      </section>

      {/* 18:00 the road home */}
      <section id="h1800" className={gap}>
        <SceneHead
          hour={H.h1800}
          img={imgFather}
          title={["the drive home", "traffic. time to overthink."]}
          line={[
            "Every evening on the road, the same thought: how did a couch upholsterer from Irbid end up here?",
            "Stuck in traffic, replaying my whole career. Here's the montage.",
          ]}
        />
        <div className="max-w-[1000px] mx-auto px-5 md:px-12 mt-14">
          <Journey stops={isProfessional ? ROAD.pro : ROAD.fun} color="#ff614c" />
        </div>
      </section>

      {/* 21:00 the creator */}
      <section id="h2100" className={gap}>
        <SceneHead
          hour={H.h2100}
          img={imgCreator}
          flip
          title={["kids asleep. sketchbook out.", "the quiet hours"]}
          line={[
            "This is when @alaa_aliens happens: hand-drawn UX explainers, the podcast, and stories from my life on sticky notes.",
            "The house is quiet. I draw UX jokes. It's therapy, but cheaper.",
          ]}
        />
        <div className="max-w-[1200px] mx-auto px-3 md:px-8 mt-6">
          <div className="rounded-[28px] bg-[#fdecd0] pb-16 md:pb-24 shadow-[0_0_120px_40px_rgba(255,200,120,0.25)]">
            <Sketchbook />
          </div>
        </div>
      </section>

      {/* 02:00 contact */}
      <section id="h0200" className={`${gap} pb-32`}>
        <SceneHead
          hour={H.h0200}
          img={imgNight}
          title={["one more doodle, or one more message?", "why am i still awake"]}
          line={[
            "Tomorrow starts at 06:30 again. If you'd like to be part of it, a project, a workshop, a hello, send me a postcard.",
            "The house is asleep. I'm not. Send a postcard, I'll probably answer at 2am.",
          ]}
        />
        <div className="flex justify-center mt-12">
          <Button to="/contact" tone="coral">{isProfessional ? "send me a postcard" : "write to the night owl"} →</Button>
        </div>
        <p className="mt-16 text-center font-['Shantell_Sans',cursive] text-[15px] text-[#fdecd0]/70">
          <span className="font-['Noto_Sans_JP'] text-[22px] text-[#fdecd0] mr-2">つづく</span>
          {isProfessional ? "tomorrow, 06:30. same guy, new story." : "alarm's set for 06:30. it will be snoozed."}
        </p>
      </section>
    </main>
  );
}
