import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useSearchParams } from "react-router";
import { useMode } from "../components/ModeContext";
import { ProjectCard } from "../components/ProjectCard";
import { ComingSoonPopup } from "../components/ComingSoonPopup";
import { Doodle, Reveal, ScribbleUnderline } from "../components/motion/Doodles";
import { categories, projects, type CategoryKey } from "../data/projects";
import { usePageMeta } from "../usePageMeta";

type Filter = "all" | CategoryKey;

export function WorkPage() {
  const { isProfessional } = useMode();
  const [params, setParams] = useSearchParams();
  const filter = (params.get("f") as Filter) || "all";
  const [soonOpen, setSoonOpen] = useState(false);

  usePageMeta({
    title: "Work — Ala'a Ali",
    description: `${projects.length} projects across government, SaaS, fintech, education, games and media in the MENA region.`,
  });

  const counts = useMemo(() => {
    const c: Partial<Record<CategoryKey, number>> = {};
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const visible = useMemo(() => {
    const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    // Published case studies first, then featured, then the rest.
    return [...list].sort(
      (a, b) =>
        Number(b.status === "ready") - Number(a.status === "ready") ||
        Number(!!b.featured) - Number(!!a.featured),
    );
  }, [filter]);

  const setFilter = (f: Filter) => {
    if (f === "all") setParams({}, { replace: true });
    else setParams({ f }, { replace: true });
  };

  const chips: Filter[] = ["all", ...(Object.keys(categories) as CategoryKey[]).filter((k) => counts[k])];

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-[120px] md:pt-[170px] pb-16">
      {/* Header */}
      <div className="relative mb-10 md:mb-14">
        <Doodle kind="star" className="right-4 md:right-24 -top-6" size={46} />
        <Doodle kind="swirl" className="hidden md:block right-56 top-16" color="#6A4CFF" delay={0.4} />
        <Reveal y={16}>
          <p className="font-['Work_Sans'] uppercase tracking-[0.2em] text-[12px] md:text-[13px] text-black/50 mb-3">
            {projects.length} {isProfessional ? "projects · 15+ years" : "projects · zero regrets (mostly)"}
          </p>
          <h1 className="font-['Playfair_Display'] font-bold text-black text-[40px] md:text-[72px] leading-[1.02]">
            {isProfessional ? "Selected Work" : "The Full Damage"}
          </h1>
        </Reveal>
        <ScribbleUnderline width={220} className="mt-2" />
        <Reveal delay={0.15}>
          <p className="font-['IBM_Plex_Serif'] italic font-light text-black text-[16px] md:text-[22px] leading-[1.5] mt-6 max-w-[720px]">
            {isProfessional
              ? "Apps, platforms and dashboards for governments, startups and everything in between. Projects marked “Case study” have the full story; the rest are coming soon — happy to walk you through any of them."
              : "Everything I've touched with a stylus. The ones with a black tag have a full write-up. The rest are stuck in my drafts folder, next to my gym plans."}
          </p>
        </Reveal>
      </div>

      {/* Filters */}
      <LayoutGroup>
        <div
          role="tablist"
          aria-label="Filter projects"
          className="flex gap-2 md:gap-3 overflow-x-auto pb-3 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap mb-6 md:mb-10"
        >
          {chips.map((k) => {
            const active = filter === k;
            const label =
              k === "all"
                ? isProfessional ? "All" : "Everything"
                : isProfessional ? categories[k].title : categories[k].funTitle;
            const count = k === "all" ? projects.length : counts[k];
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(k)}
                className={`relative shrink-0 rounded-full border px-4 py-2 font-['Work_Sans'] text-[14px] md:text-[15px] transition-colors ${
                  active ? "border-black text-white" : "border-black/30 text-black hover:border-black"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="chip-bg"
                    className="absolute inset-0 rounded-full bg-black"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {k !== "all" && (
                    <span className="w-2 h-2 rounded-full" style={{ background: categories[k].color }} />
                  )}
                  {label}
                  <span className={active ? "text-white/60" : "text-black/40"}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} onSoon={() => setSoonOpen(true)} showCategory />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <ComingSoonPopup isOpen={soonOpen} onClose={() => setSoonOpen(false)} />
    </section>
  );
}
