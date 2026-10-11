import { useCallback, useRef, useState } from "react";

/** Drag (or arrow-key) slider comparing a before and an after image. */
export function BeforeAfter({ before, after, alt = "" }: { before: string; after: string; alt?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative select-none overflow-hidden rounded-[6px] border border-black shadow-[6px_6px_0px_0px_black] cursor-ew-resize touch-pan-y"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after} alt={`${alt} after`} className="block w-full" draggable={false} />
      <img
        src={before}
        alt={`${alt} before`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      <span className="absolute top-3 left-3 bg-black text-white font-['Work_Sans'] text-[12px] uppercase tracking-wider px-2 py-1">Before</span>
      <span className="absolute top-3 right-3 bg-[#ff614c] text-white font-['Work_Sans'] text-[12px] uppercase tracking-wider px-2 py-1">After</span>
      <div className="absolute top-0 bottom-0 w-[2px] bg-black" style={{ left: `${pos}%` }}>
        <button
          type="button"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold text-[14px]"
        >
          ⇆
        </button>
      </div>
    </div>
  );
}
