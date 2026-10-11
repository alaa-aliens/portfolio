/*
 * The cursor is a pencil, and it leaves a short coral ink line that fades away,
 * like sketching in the margin. Mouse only; off for touch and "reduce motion".
 * Over links and buttons the pencil tilts and the ink turns black.
 */
import { useEffect, useRef, useState } from "react";

const MAX_AGE = 520; // ms an ink point lives

export function InkCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("ink-cursor");
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts: { x: number; y: number; t: number }[] = [];
    let overClickable = false;
    let raf = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 80) pts.shift();
      const el = e.target as HTMLElement;
      overClickable = !!el.closest("a,button,[role=button],[role=tab],[role=radio],input,textarea,select,label");
      const pen = penRef.current!;
      pen.style.transform = `translate(${e.clientX}px, ${e.clientY}px) rotate(${overClickable ? -8 : 0}deg) scale(${overClickable ? 1.12 : 1})`;
      pen.style.opacity = document.body.classList.contains("sticker-armed") ? "0" : "1";
      visible = true;
    };
    const onLeave = () => {
      visible = false;
      penRef.current!.style.opacity = "0";
    };
    const onDown = () => penRef.current?.classList.add("pen-down");
    const onUp = () => penRef.current?.classList.remove("pen-down");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const now = performance.now();
      while (pts.length && now - pts[0].t > MAX_AGE) pts.shift();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!visible || pts.length < 2) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const life = 1 - (now - b.t) / MAX_AGE;
        ctx.strokeStyle = overClickable ? `rgba(29,26,23,${life * 0.7})` : `rgba(255,97,76,${life * 0.85})`;
        ctx.lineWidth = 1 + life * 2.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("ink-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 w-screen h-screen z-[120]" />
      <div
        ref={penRef}
        aria-hidden
        className="ink-pen pointer-events-none fixed left-0 top-0 z-[121] opacity-0 transition-[opacity] duration-150"
        style={{ willChange: "transform" }}
      >
        {/* tip sits exactly on the pointer */}
        <svg width="34" height="34" viewBox="0 0 34 34" className="-translate-x-[2px] -translate-y-[31px] overflow-visible">
          <path d="M3 31 L7 21 L24 4 L30 10 L13 27 Z" fill="#FFC53D" stroke="#1d1a17" strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 4 L27 1.5 C 28.5 0.3 30.5 0.4 31.6 1.8 L32.3 2.6 C 33.5 4 33.3 6 32 7.2 L30 10 Z" fill="#ff614c" stroke="#1d1a17" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 21 L13 27" stroke="#1d1a17" strokeWidth="2" />
          <path d="M3 31 L5.2 25.6 L8.4 28.8 Z" fill="#1d1a17" />
        </svg>
      </div>
    </>
  );
}
