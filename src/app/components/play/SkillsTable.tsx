/*
 * "What I bring to the table" — skill chips drop onto a hand-drawn desk.
 * Desktop: grab and throw them. Touch: tap one and it hops (so page scrolling still works).
 * Reduced motion: the chips simply sit on the desk.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Matter from "matter-js";
import { useMode } from "../ModeContext";
import { SectionTitle } from "../motion/Doodles";
import { DeskThings } from "./DeskThings";

const PRO = [
  "UX Research", "UI Design", "Design Systems", "Motion", "Prototyping", "UX Audits",
  "Workshops", "Illustration", "Motion", "Figma", "Product Strategy", "Building with AI",
];
const FUN_EXTRA = ["Strong opinions", "Coffee", "2am energy", "Border-radius debates"];
const COLORS = ["#fffaf1", "#FFE1D9", "#E6E0FF", "#D6F4F7", "#FFE9C7", "#DDF3DF"];

export function SkillsTable({ embedded = false }: { embedded?: boolean }) {
  const { isProfessional, mode } = useMode();
  const reduce = useReducedMotion();
  const skills = isProfessional ? PRO : [...PRO.slice(0, 9), ...FUN_EXTRA];
  const stageRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const [started, setStarted] = useState(false);
  const [touch] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
  const [deskPctNow, setDeskPct] = useState(62);
  useEffect(() => {
    const upd = () => setDeskPct(window.innerWidth < 640 ? 92 : 62);
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Start dropping when the desk scrolls into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduce) return;
    const stage = stageRef.current!;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint, Events } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });

    // Desk top (matches the drawing), floor and walls.
    const deskW = W < 640 ? W * 0.92 : W * 0.62;
    const deskY = H * 0.5;
    const opts = { isStatic: true, friction: 0.8, render: { visible: false } };
    const stageRect = stage.getBoundingClientRect();
    const solids = [...stage.querySelectorAll<HTMLElement>("[data-desk-solid]")].map((el) => {
      const r = el.getBoundingClientRect();
      return Bodies.rectangle(r.left - stageRect.left + r.width / 2, r.top - stageRect.top + r.height / 2 + 6, r.width * 0.8, r.height * 0.8, opts);
    });
    Composite.add(engine.world, solids);
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, deskY + 6, deskW, 12, opts),
      Bodies.rectangle(W / 2, H + 30, W * 2, 60, opts),
      Bodies.rectangle(-30, H / 2, 60, H * 3, opts),
      Bodies.rectangle(W + 30, H / 2, 60, H * 3, opts),
    ]);

    const bodies = chipRefs.current.slice(0, skills.length).map((el, i) => {
      const w = el!.offsetWidth;
      const h = el!.offsetHeight;
      const x = W / 2 + (Math.random() - 0.5) * deskW * 0.8;
      const y = -60 - i * 55;
      const b = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: h / 2 },
        restitution: 0.35,
        friction: 0.5,
        frictionAir: 0.012,
        angle: (Math.random() - 0.5) * 0.6,
      });
      return b;
    });
    bodiesRef.current = bodies;
    Composite.add(engine.world, bodies);

    let mc: Matter.MouseConstraint | undefined;
    if (!touch) {
      const mouse = Mouse.create(stage);
      // Let the page keep scrolling with the wheel.
      const m = mouse as unknown as { element: HTMLElement; mousewheel: EventListener };
      m.element.removeEventListener("wheel", m.mousewheel);
      m.element.removeEventListener("mousewheel", m.mousewheel);
      m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
      mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
      Composite.add(engine.world, mc);
      Events.on(mc, "startdrag", () => (stage.style.cursor = "grabbing"));
      Events.on(mc, "enddrag", () => (stage.style.cursor = "grab"));
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      Engine.update(engine, dt);
      bodies.forEach((b, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        el.style.transform = `translate(${b.position.x - el.offsetWidth / 2}px, ${b.position.y - el.offsetHeight / 2}px) rotate(${b.angle}rad)`;
        el.style.opacity = "1";
        // anything thrown out of the box comes back from the top
        if (b.position.y > H + 200 || b.position.x < -200 || b.position.x > W + 200) {
          Body.setPosition(b, { x: W / 2, y: -40 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (mc) Composite.remove(engine.world, mc);
      Engine.clear(engine);
      bodiesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduce, mode, touch]);

  const hop = (i: number) => {
    const b = bodiesRef.current[i];
    if (b) Matter.Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: -11 });
  };

  return (
    <section id="skills" className="w-full max-w-[1200px] mx-auto px-6 md:px-12 py-8">
      {!embedded && (
        <SectionTitle className="mb-2">
          {isProfessional ? "What I bring to the table" : "What I bring to the table (besides snacks)"}
        </SectionTitle>
      )}
      <p className="font-['Shantell_Sans',cursive] text-[13px] md:text-[15px] text-black/50 mb-2">
        {touch ? "tap a skill to make it jump · tap a thing on the desk" : "grab a skill and throw it · hover the things on the desk"}
      </p>

      <div
        ref={stageRef}
        className="relative w-full h-[520px] md:h-[560px] overflow-hidden select-none [--desk-w:92%] sm:[--desk-w:62%]"
        style={{ cursor: touch || reduce ? "default" : "grab", touchAction: "pan-y" }}
      >
        {/* The desk, hand-drawn */}
        <svg aria-hidden className="absolute left-1/2 -translate-x-1/2 overflow-visible" style={{ top: "50%", width: "var(--desk-w)" }} height="230" viewBox="0 0 620 230" preserveAspectRatio="none" fill="none">
          <path d="M4 6 C 120 2, 260 9, 400 4 S 580 3, 616 7" stroke="#1d1a17" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 13 C 160 16, 420 11, 612 14" stroke="#ff614c" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M46 14 C 44 90, 49 160, 44 226" stroke="#1d1a17" strokeWidth="5" strokeLinecap="round" />
          <path d="M574 14 C 577 100, 571 160, 575 226" stroke="#1d1a17" strokeWidth="5" strokeLinecap="round" />
          <path d="M46 70 C 200 76, 420 66, 574 72" stroke="#1d1a17" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        </svg>
        {/* Ala'a's actual desk */}
        <DeskThings deskPct={deskPctNow} deskTop="50%" />

        {/* Chips (positioned by the physics loop; stacked neatly when motion is reduced) */}
        <div className={reduce ? "absolute left-1/2 -translate-x-1/2 bottom-[52%] w-[var(--desk-w)] flex flex-wrap gap-2 justify-center" : ""}>
          {skills.map((s, i) => (
            <motion.button
              key={`${mode}-${s}`}
              ref={(el) => (chipRefs.current[i] = el)}
              type="button"
              onClick={() => touch && hop(i)}
              className={`${reduce ? "relative" : "absolute left-0 top-0"} whitespace-nowrap rounded-full border border-black px-4 py-2 font-['Work_Sans'] font-semibold text-[13px] md:text-[15px] text-black shadow-[2px_3px_0_0_black]`}
              style={{ background: COLORS[i % COLORS.length], opacity: reduce ? 1 : 0, willChange: "transform" }}
              tabIndex={-1}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
