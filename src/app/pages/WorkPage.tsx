import { useMemo, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { useSearchParams } from "react-router";
import { useMode } from "../components/ModeContext";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectList } from "../components/ProjectList";
import { ComingSoonPopup } from "../components/ComingSoonPopup";
import { Doodle, Reveal } from "../components/motion/Doodles";
import { DoodleTitle } from "../components/play/DoodleTitle";
import { categories, projects, type CategoryKey } from "../data/projects";
import { usePageMeta } from "../usePageMeta";

type Filter = "all" | CategoryKey;

export function WorkPage() {
  const { isProfessional } = useMode();
  const [params, setParams] = useSearchParams();
  const filter = (params.get("f") as Filter) || "all";
  const [soonOpen, setSoonOpen] = useState(false);

  usePageMeta({
    title: "Work · Ala'a Ali",
    description: `${projects.length} projects across government, SaaS, fintech, education, games and media in the MENA region.`,
  });

  const counts = useMemo(() => {
    const c: Partial<Record<CategoryKey, number>> = {};
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const inFilter = (p: (typeof projects)[number]) => filter === "all" || p.category === filter;
  // Big cards: case studies + projects with real brand covers. List: everything else.
  const spotlight = projects.filter((p) => inFilter(p) && (p.status === "ready" || p.featured));
  const rest = projects.filter((p) => inFilter(p) && !(p.status === "ready" || p.featured));

  const setFilter = (f: Filter) => setParams(f === "all" ? {} : { f }, { replace: true, preventScrollReset: true });
  const chips: Filter[] = ["all", ...(Object.keys(categories) as CategoryKey[]).filter((k) => counts[k])];

  return (
    <section className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[110px] md:pt-[160px] pb-16">
      {/* Header */}
      <div className="relative mb-8 md:mb-12">
        <Doodle kind="star" className="right-2 md:right-24 -top-4" size={42} />
        <Doodle kind="swirl" className="hidden md:block right-56 top-20" color="#6A4CFF" delay={0.4} />
        <Reveal y={12}>
          <p className="font-['Work_Sans'] uppercase tracking-[0.2em] text-[12px] md:text-[13px] text-black/50 mb-3">
            {projects.length} {isProfessional ? "projects · 15+ years" : "projects · zero regrets (mostly)"}
          </p>
        </Reveal>
        <DoodleTitle
          as="h1"
          text={isProfessional ? "Things I {head} made" : "The full {bolt} damage"}
          className="text-[46px] md:text-[88px]"
        />
        <Reveal delay={0.15}>
          <p className="font-['IBM_Plex_Serif'] italic font-light text-black text-[16px] md:text-[21px] leading-[1.5] mt-6 max-w-[700px]">
            {isProfessional
              ? "Apps, platforms and dashboards for governments, startups and everything in between. The big ones up top; the full list below. Happy to walk you through any of them."
              : "Everything I've touched with a stylus. Big cards for the ones I'm proud of, a list for the rest, which are stuck in my drafts next to my gym plans."}
          </p>
        </Reveal>
      </div>

      {/* Filters */}
      <LayoutGroup>
        <div
          role="tablist"
          aria-label="Filter projects"
          className="flex gap-2 md:gap-2.5 overflow-x-auto pb-3 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap mb-8 md:mb-12 [scrollbar-width:none]"
        >
          {chips.map((k) => {
            const active = filter === k;
            const label = k === "all" ? (isProfessional ? "All" : "Everything") : isProfessional ? categories[k].title : categories[k].funTitle;
            const count = k === "all" ? projects.length : counts[k];
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(k)}
                className={`relative shrink-0 rounded-full border px-4 py-2 font-['Work_Sans'] font-medium text-[14px] md:text-[15px] transition-colors ${
                  active ? "border-black text-white" : "border-black/20 text-black hover:border-black bg-[#fffaf1]/60"
                }`}
              >
                {active && (
                  <motion.span layoutId="chip-bg" className="absolute inset-0 rounded-full bg-black" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {k !== "all" && <span className="w-2 h-2 rounded-full" style={{ background: categories[k].color }} />}
                  {label}
                  <span className={active ? "text-white/60" : "text-black/40"}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {spotlight.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14 md:mb-20">
          {spotlight.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} onSoon={() => setSoonOpen(true)} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-['IBM_Plex_Serif'] font-bold text-[26px] md:text-[36px]">
              {isProfessional ? "And the rest" : "The B-sides"}
            </h2>
            <span className="font-['Shantell_Sans',cursive] text-[13px] text-black/50 hidden md:block">
              hover a row for a peek
            </span>
          </div>
          <ProjectList items={rest} onSoon={() => setSoonOpen(true)} start={spotlight.length + 1} />
        </div>
      )}

      <ComingSoonPopup isOpen={soonOpen} onClose={() => setSoonOpen(false)} />
    </section>
  );
}
