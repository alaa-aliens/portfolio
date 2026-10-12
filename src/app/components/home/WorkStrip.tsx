/*
 * Work as a film strip you drag sideways. Each frame is one project:
 * the real screen in a hand-drawn frame, the name in marker, one line.
 * Ready case studies first, then the featured clients.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, useMotionValue } from "motion/react";
import { categories, projects, type Project } from "../../data/projects";
import { useMode } from "../ModeContext";
import { DoodleTitle } from "../play/DoodleTitle";
import { Scribble, Button } from "../ui/Kit";
import { ComingSoonPopup } from "../ComingSoonPopup";
import { RoughBox } from "../ui/RoughBox";

function Frame({ p, i, onOpen }: { p: Project; i: number; onOpen: (p: Project) => void }) {
  const { isProfessional } = useMode();
  const cs = p.caseStudy;
  const shot = cs?.showcase?.[0];
  const cat = categories[p.category];
  const bg = p.brand ?? `${cat.color}26`;
  const desktop = cs?.device === "desktop";
  return (
    <motion.article
      className="group relative shrink-0 w-[78vw] sm:w-[420px] md:w-[520px] select-none"
      initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 0.8 : -0.8 }}
      whileHover={{ rotate: 0, y: -6 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <button onClick={() => onOpen(p)} className="block w-full text-left" draggable={false}>
        <RoughBox fill={bg} radius={10} strokeWidth={1.6} seed={i * 17 + 3} className="aspect-[4/3]">
        <div className="absolute inset-0 overflow-hidden rounded-[10px]">
          {p.cover ? (
            <motion.img
              src={p.cover}
              alt=""
              draggable={false}
              loading="lazy"
              className="absolute inset-0 m-auto max-w-[86%] max-h-[84%] w-auto h-auto"
              initial={false}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : shot ? (
            desktop ? (
              <img src={shot.src} alt={shot.alt} draggable={false} loading="lazy" className="absolute left-[6%] right-[6%] bottom-0 w-[88%] rounded-t-[10px] border border-b-0 border-[#1d1a17] bg-white translate-y-[8%] group-hover:translate-y-[2%] transition-transform duration-500" />
            ) : (
              <>
                {cs!.showcase!.slice(0, 3).map((s, k) => (
                  <img
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    draggable={false}
                    loading="lazy"
                    className="absolute bottom-0 w-[30%] rounded-t-[14px] border border-b-0 border-[#1d1a17] bg-white transition-transform duration-500"
                    style={{
                      left: `${12 + k * 25}%`,
                      zIndex: k === 1 ? 2 : 1,
                      transform: `translateY(${k === 1 ? 18 : 30}%) rotate(${(k - 1) * 2}deg)`,
                    }}
                  />
                ))}
              </>
            )
          ) : p.mark ? (
            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">{p.mark}</div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <span className="font-display text-[40px] md:text-[56px] lowercase text-center leading-none" style={{ color: cat.color === "#1F1F1F" ? "#1d1a17" : cat.color }}>{p.name}</span>
            </div>
          )}
          {p.status !== "ready" && (
            <span className="absolute top-3 right-3 rotate-6 rounded-full border border-black bg-[#fffaf1] px-2.5 py-1 font-['Shantell_Sans',cursive] text-[12px]">
              {isProfessional ? "case study soon" : "still cooking"}
            </span>
          )}
        </div>
        </RoughBox>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[30px] md:text-[36px] leading-none lowercase">{p.name}</h3>
            <p className="font-['Work_Sans'] text-[14px] md:text-[15px] text-black/70 mt-1.5 max-w-[380px]">{isProfessional ? p.proHook : p.funHook ?? p.proHook}</p>
          </div>
          <span className="shrink-0 mt-1 font-['Shantell_Sans',cursive] text-[13px] text-[#ff614c] opacity-0 group-hover:opacity-100 transition-opacity">{p.status === "ready" ? "read it →" : "soon"}</span>
        </div>
      </button>
    </motion.article>
  );
}

export function WorkStrip() {
  const { isProfessional } = useMode();
  const navigate = useNavigate();
  const [soon, setSoon] = useState(false);
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [bound, setBound] = useState(0);
  const dragged = useRef(false);

  const items = [...projects.filter((p) => p.status === "ready"), ...projects.filter((p) => p.featured && p.status !== "ready")].slice(0, 8);

  useEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      setBound(Math.max(0, inner.current.scrollWidth - outer.current.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length]);

  const open = (p: Project) => {
    if (dragged.current) return;
    if (p.status === "ready") navigate(`/work/${p.slug}`);
    else setSoon(true);
  };

  return (
    <section className="w-full pt-32 md:pt-48 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10 md:mb-14">
        <div>
          <DoodleTitle text={isProfessional ? "things i {pencil} made" : "stuff i {pencil} made"} className="text-[44px] md:text-[72px]" />
          <Scribble className="mt-1">{isProfessional ? "drag sideways, or scroll" : "drag it. go on. it likes it."}</Scribble>
        </div>
        <Button to="/work" className="self-start md:self-auto md:mb-4">{isProfessional ? `all ${projects.length} projects` : "the full damage"} →</Button>
      </div>

      <div ref={outer} className="relative w-full cursor-grab active:cursor-grabbing">
        <motion.div
          ref={inner}
          drag="x"
          dragConstraints={{ left: -bound, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ power: 0.25, timeConstant: 180 }}
          style={{ x }}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
          onWheel={(e) => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
            x.set(Math.min(0, Math.max(-bound, x.get() - e.deltaX)));
          }}
          className="flex items-start gap-8 md:gap-14 px-5 md:px-12 pb-10 w-max"
        >
          {items.map((p, i) => (
            <Frame key={p.slug} p={p} i={i} onOpen={open} />
          ))}
          <Link to="/work" className="shrink-0 w-[60vw] sm:w-[300px] self-stretch flex items-center justify-center rounded-[16px] border border-dashed border-black/40 hover:border-black hover:bg-[#fffaf1]/60 transition-colors min-h-[280px]">
            <span className="font-display text-[34px] lowercase text-[#ff614c]">+{projects.length - items.length} more →</span>
          </Link>
        </motion.div>
      </div>
      <ComingSoonPopup isOpen={soon} onClose={() => setSoon(false)} />
    </section>
  );
}
