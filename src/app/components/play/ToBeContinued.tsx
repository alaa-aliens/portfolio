/*
 * The anime episode ending: a centred "continues…" button at the end of a road
 * and つづく (tsuzuku, "to be continued") in the bottom-right corner.
 */
import { motion } from "motion/react";
import { Button } from "../ui/Kit";

export function Tsuzuku({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-label="to be continued"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
      className={`font-['Noto_Sans_JP','Noto_Naskh_Arabic',sans-serif] font-bold text-[26px] md:text-[34px] tracking-[0.18em] text-[#1d1a17] select-none ${className}`}
    >
      つづく
      <span className="block font-['Shantell_Sans',cursive] text-[11px] md:text-[12px] tracking-normal text-black/45 text-right -mt-1">to be continued</span>
    </motion.span>
  );
}

export function ToBeContinued({ to, label, note }: { to: string; label: string; note?: string }) {
  return (
    <div className="relative flex flex-col items-center pt-2 pb-10">
      <motion.span aria-hidden className="w-4 h-4 rounded-full border border-black bg-[#ff614c] mb-3" initial={{ scale: 0 }} whileInView={{ scale: [0, 1.5, 1] }} viewport={{ once: true }} />
      <Button to={to} size="lg">{label} →</Button>
      {note && <span className="mt-2 font-['Shantell_Sans',cursive] text-[13px] text-black/50">{note}</span>}
      <div className="absolute right-0 bottom-0"><Tsuzuku /></div>
    </div>
  );
}
