/*
 * "The Users" — tiny hand-drawn people wandering around the hero,
 * saying the things users (and clients) say. Click one and it hops.
 * Drawn on a canvas so dozens of them stay cheap. Freezes in place for "reduce motion".
 */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useMode } from "../ModeContext";

const PRO_LINES = [
  "Is this clickable?",
  "Where's the search?",
  "Ooh, nice empty state",
  "How do I go back?",
  "Clean!",
  "Is there a dark mode?",
  "That hover though",
  "Wait, where's the menu?",
  "Love the onboarding",
  "Can I export this?",
];
const FUN_LINES = [
  "Can we make it pop?",
  "Make the logo bigger",
  "I clicked it 7 times",
  "Is this a button??",
  "My nephew does design",
  "Can it be more… blue?",
  "Where's the Comic Sans?",
  "I skipped onboarding",
  "Love it. Change everything.",
  "Just one tiny change…",
  "Is it mobile-first?",
  "Can we add AI?",
];
const POKE_LINES_PRO = ["Hi!", "Hey there!", "Oh, hello", "👋"];
const POKE_LINES_FUN = ["Rude.", "Personal space!", "Did you just click me?", "Ow.", "I'm a user, not a button"];
const CAPS = ["#ff614c", "#6A4CFF", "#02B5C9", "#53B858", "#FF9F1C", "#FF4C79", null, null, null];

interface Person {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  phase: number;
  scale: number;
  cap: string | null;
  hop: number; // 0..1 hop progress
  pause: number; // seconds left standing still
  bubble?: { text: string; t: number; dur: number };
  turnIn: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function UsersCrowd({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { isProfessional } = useMode();
  const modeRef = useRef(isProfessional);
  modeRef.current = isProfessional;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let people: Person[] = [];
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let last = performance.now();
    let nextTalk = 1.2;
    let zoneTimer = 0.3;
    let visible = true;
    // Areas the crowd walks around (the character and the text), marked with data-crowd-avoid.
    let zones: { l: number; t: number; r: number; b: number }[] = [];
    const PAD = 14;
    const readZones = () => {
      const c = canvas.getBoundingClientRect();
      const root = canvas.closest("section") ?? document;
      zones = [...root.querySelectorAll<HTMLElement>("[data-crowd-avoid]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - c.left - PAD, t: r.top - c.top - PAD, r: r.right - c.left + PAD, b: r.bottom - c.top + PAD + 30 };
      });
    };
    const inZone = (x: number, y: number) => zones.find((z) => x > z.l && x < z.r && y > z.t && y < z.b);
    const pushOut = (p: Person) => {
      const z = inZone(p.x, p.y);
      if (!z) return;
      const opts = [
        { d: p.x - z.l, x: z.l, y: p.y, vx: -1, vy: 0 },
        { d: z.r - p.x, x: z.r, y: p.y, vx: 1, vy: 0 },
        { d: p.y - z.t, x: p.x, y: z.t, vx: 0, vy: -1 },
        { d: z.b - p.y, x: p.x, y: z.b, vx: 0, vy: 1 },
      ].sort((a, b) => a.d - b.d)[0];
      p.x = opts.x;
      p.y = opts.y;
      if (opts.vx) p.vx = Math.abs(p.vx) * opts.vx;
      if (opts.vy) p.vy = Math.abs(p.vy) * opts.vy;
    };

    const spawn = (): Person => {
      const a = rand(0, Math.PI * 2);
      return {
        x: rand(20, W - 20),
        y: rand(H * 0.12, H - 24),
        vx: Math.cos(a),
        vy: Math.sin(a) * 0.5,
        speed: rand(10, 22),
        phase: rand(0, 10),
        scale: rand(0.85, 1.15),
        cap: pick(CAPS),
        hop: 0,
        pause: Math.random() < 0.3 ? rand(0.5, 3) : 0,
        turnIn: rand(2, 7),
      };
    };

    const resize = () => {
      readZones();
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const target = Math.round(Math.max(6, Math.min(22, (W * H) / 38000)));
      while (people.length < target) people.push(spawn());
      people.length = target;
      people.forEach((p) => {
        p.x = Math.min(Math.max(p.x, 16), W - 16);
        p.y = Math.min(Math.max(p.y, H * 0.12), H - 20);
        for (let i = 0; i < 20 && inZone(p.x, p.y); i++) {
          p.x = rand(20, W - 20);
          p.y = rand(H * 0.12, H - 24);
        }
        pushOut(p);
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => Object.assign(pointer, toLocal(e));
    const onLeave = () => Object.assign(pointer, { x: -9999, y: -9999 });
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      let best: Person | null = null;
      let bestD = 26;
      for (const p of people) {
        const d = Math.hypot(p.x - x, p.y - 14 * p.scale - y);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      if (best) {
        best.hop = 0.0001;
        best.bubble = {
          text: pick(modeRef.current ? POKE_LINES_PRO : POKE_LINES_FUN),
          t: 0,
          dur: 2.2,
        };
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);

    /* ── drawing ── */
    const INK = "#1d1a17";
    const drawPerson = (p: Person, t: number) => {
      const s = p.scale;
      const moving = p.pause <= 0 && !reduce;
      const step = moving ? Math.sin(t * 9 + p.phase) : 0;
      const hopY = p.hop > 0 ? Math.sin(p.hop * Math.PI) * 16 : 0;
      const bob = moving ? Math.abs(step) * 1.2 : 0;
      const x = p.x;
      const y = p.y - hopY - bob;
      const facing = p.vx >= 0 ? 1 : -1;

      // shadow
      ctx.fillStyle = "rgba(60,40,20,0.13)";
      ctx.beginPath();
      ctx.ellipse(p.x + 5 * s, p.y + 1, 9 * s * (1 - hopY / 40), 3 * s, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = INK;

      // legs
      ctx.beginPath();
      ctx.moveTo(x - 2.5 * s, y - 9 * s);
      ctx.lineTo(x - 2.5 * s + step * 2.6 * s, y);
      ctx.moveTo(x + 2.5 * s, y - 9 * s);
      ctx.lineTo(x + 2.5 * s - step * 2.6 * s, y);
      ctx.stroke();

      // body (rounded capsule)
      ctx.fillStyle = "#fffaf1";
      ctx.beginPath();
      ctx.roundRect(x - 5.5 * s, y - 21 * s, 11 * s, 13 * s, 5 * s);
      ctx.fill();
      ctx.stroke();

      // arms
      ctx.beginPath();
      ctx.moveTo(x - 5 * s, y - 17 * s);
      ctx.lineTo(x - 7.5 * s - step * 1.5 * s, y - 12 * s);
      ctx.moveTo(x + 5 * s, y - 17 * s);
      ctx.lineTo(x + 7.5 * s + step * 1.5 * s, y - 12 * s);
      ctx.stroke();

      // head
      ctx.beginPath();
      ctx.arc(x, y - 26.5 * s, 5.6 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // cap / hair
      if (p.cap) {
        ctx.fillStyle = p.cap;
        ctx.beginPath();
        ctx.arc(x, y - 27.5 * s, 5.6 * s, Math.PI * 1.05, Math.PI * 1.95);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // eye dot (shows which way they face)
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x + 2.3 * s * facing, y - 26 * s, 0.9 * s, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBubble = (p: Person) => {
      const b = p.bubble!;
      const k = Math.min(1, b.t / 0.18, (b.dur - b.t) / 0.25);
      if (k <= 0) return;
      ctx.save();
      ctx.globalAlpha = k;
      ctx.font = "600 12px 'Work Sans', system-ui, sans-serif";
      const tw = ctx.measureText(b.text).width;
      const bw = tw + 16;
      const bh = 22;
      let bx = p.x - bw / 2;
      bx = Math.max(4, Math.min(W - bw - 4, bx));
      const by = p.y - 34 * p.scale - bh - 8 - (1 - k) * 6;
      ctx.fillStyle = "#fffaf1";
      ctx.strokeStyle = "#1d1a17";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 11);
      ctx.fill();
      ctx.stroke();
      // tail
      const tx = Math.min(Math.max(p.x, bx + 10), bx + bw - 10);
      ctx.beginPath();
      ctx.moveTo(tx - 4, by + bh - 0.8);
      ctx.lineTo(tx, by + bh + 6);
      ctx.lineTo(tx + 4, by + bh - 0.8);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(tx - 4, by + bh);
      ctx.lineTo(tx, by + bh + 6);
      ctx.lineTo(tx + 4, by + bh);
      ctx.stroke();
      ctx.fillStyle = "#1d1a17";
      ctx.textBaseline = "middle";
      ctx.fillText(b.text, bx + 8, by + bh / 2 + 0.5);
      ctx.restore();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const t = now / 1000;
      zoneTimer -= dt;
      if (zoneTimer <= 0) {
        readZones();
        zoneTimer = 1;
      }

      if (!reduce) {
        for (const p of people) {
          // flee the cursor a little
          const dx = p.x - pointer.x;
          const dy = p.y - 14 - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 70 && d > 0.1) {
            p.vx += (dx / d) * 0.25;
            p.vy += (dy / d) * 0.15;
            p.pause = 0;
            if (!p.bubble && Math.random() < 0.006)
              p.bubble = { text: modeRef.current ? "Oh, hi" : "Personal space!", t: 0, dur: 1.8 };
          }
          if (p.pause > 0) p.pause -= dt;
          else {
            const len = Math.hypot(p.vx, p.vy) || 1;
            p.vx /= len;
            p.vy /= len;
            const sp = p.speed * (d < 70 ? 2.4 : 1);
            p.x += p.vx * sp * dt;
            p.y += p.vy * sp * 0.6 * dt;
            p.turnIn -= dt;
            if (p.turnIn <= 0) {
              const a = Math.atan2(p.vy, p.vx) + rand(-1.2, 1.2);
              p.vx = Math.cos(a);
              p.vy = Math.sin(a);
              p.turnIn = rand(2, 7);
              if (Math.random() < 0.35) p.pause = rand(0.8, 3);
            }
          }
          // keep inside
          if (p.x < 14) (p.x = 14), (p.vx = Math.abs(p.vx));
          if (p.x > W - 14) (p.x = W - 14), (p.vx = -Math.abs(p.vx));
          if (p.y < H * 0.12) (p.y = H * 0.12), (p.vy = Math.abs(p.vy));
          if (p.y > H - 8) (p.y = H - 8), (p.vy = -Math.abs(p.vy));
          pushOut(p);
          if (p.hop > 0) {
            p.hop += dt * 2.6;
            if (p.hop >= 1) p.hop = 0;
          }
          if (p.bubble) {
            p.bubble.t += dt;
            if (p.bubble.t > p.bubble.dur) p.bubble = undefined;
          }
        }
        // somebody says something every few seconds
        nextTalk -= dt;
        if (nextTalk <= 0) {
          const quiet = people.filter((p) => !p.bubble);
          if (quiet.length) {
            const p = pick(quiet);
            p.bubble = { text: pick(modeRef.current ? PRO_LINES : FUN_LINES), t: 0, dur: 2.8 };
            if (Math.random() < 0.4) p.hop = 0.0001;
          }
          nextTalk = rand(1.6, 3.4);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const sorted = [...people].sort((a, b) => a.y - b.y); // further back first
      for (const p of sorted) drawPerson(p, t);
      for (const p of sorted) if (p.bubble) drawBubble(p);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden className={`block w-full h-full ${className}`} />;
}
