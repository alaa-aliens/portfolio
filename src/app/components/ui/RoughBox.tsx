/*
 * A hand-drawn frame: roughjs draws a wobbly rectangle that follows the
 * element's size. Use it instead of CSS borders anywhere a box should look
 * sketched rather than "designed".
 */
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";

export function RoughBox({
  children,
  className = "",
  stroke = "#1d1a17",
  fill,
  fillStyle = "solid",
  strokeWidth = 1.4,
  roughness = 1.1,
  radius = 14,
  seed,
  as: Tag = "div",
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
  stroke?: string;
  fill?: string;
  fillStyle?: "solid" | "hachure" | "zigzag" | "cross-hatch";
  strokeWidth?: number;
  roughness?: number;
  radius?: number;
  seed?: number;
  as?: any;
} & Record<string, any>) {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const seedRef = useRef(seed ?? Math.floor(Math.random() * 10000));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect;
      setSize({ w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) });
      void r;
    });
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !size.w || !size.h) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const pad = strokeWidth + 1;
    const w = size.w - pad * 2;
    const h = size.h - pad * 2;
    const r = Math.min(radius, w / 2, h / 2);
    // rounded rect as a path so the corners wobble too
    const d = `M${pad + r} ${pad} L${pad + w - r} ${pad} Q${pad + w} ${pad} ${pad + w} ${pad + r} L${pad + w} ${pad + h - r} Q${pad + w} ${pad + h} ${pad + w - r} ${pad + h} L${pad + r} ${pad + h} Q${pad} ${pad + h} ${pad} ${pad + h - r} L${pad} ${pad + r} Q${pad} ${pad} ${pad + r} ${pad} Z`;
    const node = rc.path(d, {
      stroke,
      strokeWidth,
      roughness,
      bowing: 0.8,
      seed: seedRef.current,
      fill,
      fillStyle,
      fillWeight: 1,
      hachureGap: 6,
    });
    svg.appendChild(node);
  }, [size, stroke, strokeWidth, roughness, radius, fill, fillStyle]);

  return (
    <Tag ref={ref} className={`relative ${Tag === "span" ? "inline-block" : ""} ${className}`} {...rest}>
      <svg ref={svgRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }} />
      {Tag === "span" ? (
        <span className="relative inline-flex items-center justify-center gap-2 w-full h-full" style={{ zIndex: 1 }}>{children}</span>
      ) : (
        <div className="relative w-full h-full" style={{ zIndex: 1 }}>{children}</div>
      )}
    </Tag>
  );
}
