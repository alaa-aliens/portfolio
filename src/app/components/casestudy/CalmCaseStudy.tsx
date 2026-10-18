/*
 * The calm (professional) case study: easy to scan, heavy on UX detail.
 * At a glance → problem & flow → users → goals & constraints → references →
 * structure → key decisions → system → how it went → what I took away → next.
 * Every section is optional and only renders when its data exists.
 */
import { Link } from "react-router";
import { motion } from "motion/react";
import { categories, getNextReady, type Project } from "../../data/projects";
import type { CaseStudyUX } from "../../data/caseStudyUX";
import { BrowserShowcase, PhoneFan, ScreenRow } from "../Phone";
import { HeadBadge } from "../play/HeadBadge";
import { RoughBox } from "../ui/RoughBox";
import { NextTiles } from "../ui/Kit";

const ink = "#1d1a17";

function Section({ n, title, children, wide = false }: { n: number; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1100px] mx-auto px-5 md:px-12"
    >
      <p className="font-['Work_Sans'] text-[12px] uppercase tracking-[0.2em] text-black/45 tabular-nums">{String(n).padStart(2, "0")}</p>
      <h2 className="font-display lowercase text-[38px] md:text-[52px] leading-[1] mt-1">{title}</h2>
      <div className={`mt-8 ${wide ? "" : "max-w-[860px]"}`}>{children}</div>
    </motion.section>
  );
}

const P = ({ children }: { children: React.ReactNode }) => <p className="font-['IBM_Plex_Serif'] text-[17px] md:text-[19px] leading-[1.75] text-black/85">{children}</p>;

function Card({ children, seed = 1, className = "" }: { children: React.ReactNode; seed?: number; className?: string }) {
  return (
    <RoughBox fill="#fffaf1" radius={12} strokeWidth={1.1} roughness={0.8} seed={seed} className={`p-5 md:p-6 h-full ${className}`}>
      {children}
    </RoughBox>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-['Work_Sans'] text-[11.5px] uppercase tracking-[0.16em] text-black/50">{children}</p>;
}

function Flow({ before, after, color }: { before: string[]; after: string[]; color: string }) {
  const col = (title: string, steps: string[], good: boolean) => (
    <div>
      <div className="flex items-baseline justify-between">
        <Label>{title}</Label>
        <span className="font-['Work_Sans'] text-[12px] text-black/45">{steps.length} steps</span>
      </div>
      <ol className="mt-4 flex flex-col gap-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-['Work_Sans'] text-[12.5px] tabular-nums"
              style={good ? { background: color, borderColor: color, color: "#fff" } : { borderColor: "rgba(0,0,0,.35)", color: "rgba(0,0,0,.6)" }}
            >
              {i + 1}
            </span>
            <span className={`font-['IBM_Plex_Serif'] text-[16px] leading-[1.5] pt-0.5 ${good ? "text-black/85" : "text-black/60"}`}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card seed={21}>{col("before", before, false)}</Card>
      <Card seed={22}>{col("after", after, true)}</Card>
    </div>
  );
}

export function CalmCaseStudy({ project, ux }: { project: Project; ux?: CaseStudyUX }) {
  const cs = project.caseStudy!;
  const cat = categories[project.category];
  const color = cat.color === "#1F1F1F" ? ink : cat.color;
  const next = getNextReady(project.slug);
  let n = 0;
  const no = () => ++n;

  const meta = [
    ["Client", cs.client],
    ["Role", cs.role],
    ["Year", cs.year],
    ["Platform", cs.platform],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <article className="w-full overflow-x-clip pb-10">
      {/* ── Header ── */}
      <header className="w-full max-w-[1100px] mx-auto px-5 md:px-12 pt-[120px] md:pt-[160px]">
        <Link to="/work" className="group inline-flex items-center gap-2 font-['Work_Sans'] text-[14px] text-black/55 hover:text-black">
          <span className="transition-transform group-hover:-translate-x-1">←</span> All work
        </Link>
        <p className="mt-8 flex items-center gap-2 font-['Work_Sans'] text-[12px] uppercase tracking-[0.18em] text-black/55">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
          {cat.title}
        </p>
        <h1 className="font-display lowercase text-[60px] md:text-[96px] leading-[0.9] mt-3" style={{ color }}>
          {project.name}
        </h1>
        <p className="font-['IBM_Plex_Serif'] text-[21px] md:text-[28px] leading-[1.35] mt-6 max-w-[820px]">{project.proHook}</p>
        {meta.length > 0 && (
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-black/20 py-6 mt-10">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="font-['Work_Sans'] text-[11.5px] uppercase tracking-[0.16em] text-black/45">{k}</dt>
                <dd className="font-['Work_Sans'] text-[15px] text-black/85 mt-1.5 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {cs.showcase && cs.showcase.length > 0 && (
        <div className="w-full max-w-[1100px] mx-auto px-5 md:px-12 mt-12">
          {cs.device === "desktop" ? <BrowserShowcase shots={cs.showcase} color={cat.color} url={cs.url} /> : <PhoneFan shots={cs.showcase} color={cat.color} />}
        </div>
      )}

      <div className="flex flex-col gap-24 md:gap-32 mt-20 md:mt-28">
        {/* ── At a glance ── */}
        {ux && (
          <Section n={no()} title="at a glance" wide>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(
                [
                  ["The problem", ux.glance.problem],
                  ["Who it's for", ux.glance.users],
                  ["My role", ux.glance.role],
                  ["The outcome", ux.glance.outcome],
                ] as const
              ).map(([k, v], i) => (
                <Card key={k} seed={i + 3}>
                  <Label>{k}</Label>
                  <p className="font-['IBM_Plex_Serif'] text-[16px] leading-[1.6] text-black/85 mt-3">{v}</p>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* ── Problem + flow ── */}
        {(cs.problem?.length || ux?.flow) && (
          <Section n={no()} title="the problem" wide={!!ux?.flow}>
            <div className="max-w-[760px] flex flex-col gap-5">{cs.problem?.map((p, i) => <P key={i}>{p}</P>)}</div>
            {ux?.flow && (
              <div className="mt-10">
                <Flow before={ux.flow.before} after={ux.flow.after} color={color} />
              </div>
            )}
          </Section>
        )}

        {/* ── Users ── */}
        {ux?.users && (
          <Section n={no()} title="who it's for" wide>
            <div className="grid md:grid-cols-3 gap-5">
              {ux.users.map((u, i) => (
                <Card key={u.who} seed={i + 30}>
                  <p className="font-display lowercase text-[28px] leading-none" style={{ color }}>
                    {u.who}
                  </p>
                  <p className="font-['IBM_Plex_Serif'] text-[15.5px] leading-[1.55] text-black/75 mt-3">{u.context}</p>
                  <Label>
                    <span className="block mt-5">needs</span>
                  </Label>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {u.needs.map((x) => (
                      <li key={x} className="flex gap-2 font-['Work_Sans'] text-[14.5px] leading-[1.45] text-black/80">
                        <span style={{ color }}>•</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>
        )}

        {/* ── Goals & constraints ── */}
        {(ux?.goals || ux?.constraints) && (
          <Section n={no()} title="goals & constraints">
            <div className="grid md:grid-cols-2 gap-10">
              {[
                ["Goals", ux.goals],
                ["Constraints", ux.constraints],
              ].map(([k, list]) =>
                list ? (
                  <div key={k as string}>
                    <Label>{k as string}</Label>
                    <ul className="mt-4 flex flex-col gap-3 border-t border-black/15 pt-4">
                      {(list as string[]).map((x) => (
                        <li key={x} className="font-['IBM_Plex_Serif'] text-[16.5px] leading-[1.55] text-black/85 flex gap-3">
                          <span className="text-black/35">—</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          </Section>
        )}

        {/* ── References / explorations ── */}
        {ux?.research && (
          <Section n={no()} title={ux.research.title ?? "research & references"}>
            <P>{ux.research.intro}</P>
            <div className="mt-8 flex flex-col divide-y divide-black/15 border-y border-black/15">
              {ux.research.refs.map((r) => (
                <div key={r.name} className="grid md:grid-cols-[220px_1fr] gap-2 md:gap-8 py-4">
                  <p className="font-['Work_Sans'] font-semibold text-[15px]">{r.name}</p>
                  <p className="font-['IBM_Plex_Serif'] text-[16px] leading-[1.55] text-black/80">{r.take}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Structure ── */}
        {ux?.ia && (
          <Section n={no()} title="structure" wide>
            <div className="max-w-[760px]">
              <P>{ux.ia.intro}</P>
            </div>
            <div className={`mt-8 grid gap-5 ${ux.ia.groups.length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : ux.ia.groups.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {ux.ia.groups.map((g, i) => (
                <div key={g.name} className="rounded-[12px] border border-black/25 bg-[#fffaf1]/60 overflow-hidden">
                  <p className="px-4 py-2.5 font-['Work_Sans'] font-semibold text-[14px] text-white" style={{ background: i === 0 ? color : ink }}>
                    {g.name}
                  </p>
                  <ul className="px-4 py-3 flex flex-col gap-2">
                    {g.items.map((it) => (
                      <li key={it} className="font-['Work_Sans'] text-[14px] leading-[1.45] text-black/80 border-l-2 pl-3" style={{ borderColor: `${color}66` }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Key decisions ── */}
        {cs.steps && cs.steps.length > 0 && (
          <Section n={no()} title="key decisions" wide>
            <ol className="flex flex-col gap-20 md:gap-24">
              {cs.steps.map((s, i) => {
                const shot = s.image ? null : s.phones?.[0];
                return (
                  <li key={s.title}>
                    <div className="grid md:grid-cols-[64px_1fr] gap-3 md:gap-6 max-w-[860px]">
                      <span className="font-display text-[44px] leading-none" style={{ color }}>
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-display lowercase text-[30px] md:text-[38px] leading-[1.05]">{s.title}</h3>
                        <div className="mt-4">
                          <P>{s.body}</P>
                        </div>
                        {s.feeling && (
                          <p className="mt-4 font-['Shantell_Sans',cursive] text-[14.5px] text-black/55">
                            <span className="text-black/40">how it felt — </span>
                            {s.feeling}
                          </p>
                        )}
                      </div>
                    </div>
                    {s.image && <img src={s.image} alt={s.title} loading="lazy" className="mt-8 w-full md:w-[calc(100%-88px)] md:ms-[88px] rounded-[10px] border border-black/30" />}
                    {shot && (
                      <div className="mt-8 md:ms-[88px]">
                        <ScreenRow shots={(s.phones ?? []).slice(0, shot.kind === "desktop" ? 1 : 2)} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Section>
        )}

        {/* ── Design system ── */}
        {ux?.system && (
          <Section n={no()} title="the system">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <Label>Type</Label>
                <ul className="mt-4 flex flex-col gap-3 border-t border-black/15 pt-4">
                  {ux.system.type.map((t) => (
                    <li key={t.name}>
                      <p className="font-['Work_Sans'] font-semibold text-[17px]">{t.name}</p>
                      <p className="font-['IBM_Plex_Serif'] text-[15px] text-black/70">{t.use}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Colour</Label>
                <ul className="mt-4 flex flex-col gap-3 border-t border-black/15 pt-4">
                  {ux.system.colors.map((c) => (
                    <li key={c.name} className="flex items-center gap-3">
                      {c.hex ? <span className="w-9 h-9 rounded-[8px] border border-black/20 shrink-0" style={{ background: c.hex }} /> : <span className="w-9 h-9 rounded-[8px] border border-dashed border-black/30 shrink-0" />}
                      <div>
                        <p className="font-['Work_Sans'] font-semibold text-[15px]">
                          {c.name} {c.hex && <span className="font-normal text-black/45 text-[13px] ms-1">{c.hex}</span>}
                        </p>
                        <p className="font-['IBM_Plex_Serif'] text-[14.5px] text-black/70">{c.use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Label>
              <span className="block mt-10">Rules</span>
            </Label>
            <ul className="mt-4 grid md:grid-cols-2 gap-x-10 gap-y-3 border-t border-black/15 pt-4">
              {ux.system.rules.map((r) => (
                <li key={r} className="font-['IBM_Plex_Serif'] text-[16px] leading-[1.5] text-black/85 flex gap-3">
                  <span style={{ color }}>✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── How it went ── */}
        {cs.journey && cs.journey.length > 0 && (
          <Section n={no()} title="how it went">
            <ol className="relative border-s border-black/20 ms-2 flex flex-col gap-7">
              {cs.journey.map((j) => (
                <li key={j.title} className="ps-7 relative">
                  <span className="absolute -start-[6px] top-2 w-[11px] h-[11px] rounded-full border-2 bg-[#fdecd0]" style={{ borderColor: color }} />
                  <p className="font-['Work_Sans'] text-[11.5px] uppercase tracking-[0.16em] text-black/45">{j.date}</p>
                  <p className="font-['Work_Sans'] font-semibold text-[17px] mt-1">{j.title}</p>
                  <p className="font-['IBM_Plex_Serif'] text-[16px] leading-[1.6] text-black/75 mt-1">{j.body}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* ── What I took away ── */}
        {(ux?.learned || cs.closing) && (
          <Section n={no()} title="what i took away">
            {ux?.learned && (
              <ul className="flex flex-col gap-4">
                {ux.learned.map((l, i) => (
                  <li key={l} className="flex gap-4">
                    <span className="font-display text-[26px] leading-none" style={{ color }}>
                      {i + 1}
                    </span>
                    <span className="font-['IBM_Plex_Serif'] text-[17.5px] leading-[1.6] text-black/85">{l}</span>
                  </li>
                ))}
              </ul>
            )}
            {cs.closing && (
              <div className="mt-12 rounded-[14px] border border-black/20 bg-[#fffaf1] px-6 md:px-9 py-7">
                <p className="font-['Shantell_Sans',cursive] text-[18px] md:text-[21px] leading-[1.55]">{cs.closing}</p>
                <p className="flex items-center gap-3 mt-5">
                  <HeadBadge size={40} />
                  <span className="font-display text-[24px] text-[#ff614c] lowercase">— ala'a</span>
                </p>
              </div>
            )}
          </Section>
        )}

        <div className="w-full max-w-[1100px] mx-auto px-5 md:px-12">
          <NextTiles
            items={[
              { to: next ? `/work/${next.slug}` : "/work", k: next ? "next case study" : "keep exploring", t: next ? next.name : "all projects" },
              { to: "/contact", k: "got a product that needs this?", t: "let's talk" },
            ]}
          />
        </div>
      </div>
    </article>
  );
}
