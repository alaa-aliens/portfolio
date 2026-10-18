/*
 * Calm-mode work list: the published case studies as quiet, readable rows.
 * One drawing, the name, one line, three facts, one link. Alternating sides.
 */
import { Link } from "react-router";
import { motion } from "motion/react";
import { categories, projects } from "../../data/projects";
import { DoodleTitle } from "../play/DoodleTitle";
import { RoughBox } from "../ui/RoughBox";
import { Button } from "../ui/Kit";

export function SelectedWork() {
  const ready = projects.filter((p) => p.status === "ready" && p.caseStudy);
  return (
    <section className="w-full max-w-[1100px] mx-auto px-5 md:px-12 pt-28 md:pt-40">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20">
        <div>
          <DoodleTitle text="selected {pencil} work" className="text-[44px] md:text-[64px]" />
          <p className="font-['IBM_Plex_Serif'] text-[17px] md:text-[19px] text-black/70 mt-3 max-w-[520px] leading-relaxed">
            Four projects, written up properly: who they were for, what was in the way, and the decisions that fixed it.
          </p>
        </div>
        <Button to="/work" className="self-start md:self-auto md:mb-3">all {projects.length} projects →</Button>
      </div>

      <ol className="flex flex-col gap-20 md:gap-28">
        {ready.map((p, i) => {
          const cs = p.caseStudy!;
          const cat = categories[p.category];
          const flip = i % 2 === 1;
          return (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/work/${p.slug}`} className={`group grid md:grid-cols-2 gap-8 md:gap-16 items-center`}>
                <div className={flip ? "md:order-2" : ""}>
                  <RoughBox fill={p.brand ?? `${cat.color}22`} radius={14} strokeWidth={1.4} seed={i * 13 + 5} className="aspect-[4/3]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {p.cover && (
                        <img src={p.cover} alt="" loading="lazy" className="max-w-[78%] max-h-[78%] object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
                      )}
                    </div>
                  </RoughBox>
                </div>
                <div className={flip ? "md:order-1" : ""}>
                  <p className="flex items-center gap-2 font-['Work_Sans'] text-[12px] uppercase tracking-[0.18em] text-black/50">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    {cat.title}
                  </p>
                  <h3 className="font-display lowercase text-[44px] md:text-[60px] leading-[0.95] mt-3 group-hover:text-[#ff614c] transition-colors">{p.name}</h3>
                  <p className="font-['IBM_Plex_Serif'] text-[18px] md:text-[20px] leading-[1.55] text-black/85 mt-4">{p.proHook}</p>
                  <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-black/15 pt-4">
                    {[
                      ["Role", cs.role],
                      ["Year", cs.year],
                      ["Platform", cs.platform],
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="font-['Work_Sans'] text-[11px] uppercase tracking-[0.16em] text-black/45">{k}</dt>
                          <dd className="font-['Work_Sans'] text-[13.5px] text-black/80 mt-1 leading-snug">{v}</dd>
                        </div>
                      ))}
                  </dl>
                  <span className="inline-block mt-6 font-['Shantell_Sans',cursive] text-[15px] text-[#ff614c] group-hover:translate-x-1 transition-transform">read the case study →</span>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
