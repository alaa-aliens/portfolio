/* Ala'a's head on a round paper badge, so it sits on any colour. */
import imgHeadCut from "../../../assets/head.webp";

export function HeadBadge({ size = 64, className = "", bg = "#fdecd0", ring = true }: { size?: number; className?: string; bg?: string; ring?: boolean }) {
  return (
    <span className={`relative inline-block shrink-0 rounded-full overflow-hidden ${ring ? "border border-[#1d1a17]" : ""} ${className}`} style={{ width: size, height: size, background: bg }}>
      <img src={imgHeadCut} alt="" draggable={false} className="absolute left-[17%] top-[13%] w-[66%] h-[74%] object-contain object-center max-w-none" />
    </span>
  );
}
