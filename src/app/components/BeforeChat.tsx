import { motion } from "motion/react";
import { Phone } from "./Phone";

export interface ChatLine {
  who: "me" | "kid";
  text: string;
}

/** Before: the old routine as a chat. After: the product screen. */
export function BeforeChat({
  lines,
  after,
  afterAlt,
  labels,
}: {
  lines: ChatLine[];
  after: string;
  afterAlt: string;
  labels: { before: string; after: string; note?: string };
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="flex flex-col gap-3">
        <span className="self-start bg-black text-white font-['Work_Sans'] text-[12px] uppercase tracking-wider px-2 py-1">
          {labels.before}
        </span>
        <div className="rounded-[28px] bg-white border border-black/10 p-4 md:p-5 flex flex-col gap-2 shadow-[0_18px_40px_-24px_rgba(60,35,10,0.5)]">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.35, duration: 0.3 }}
              className={`max-w-[80%] px-3.5 py-2 rounded-[18px] font-['Work_Sans'] text-[14px] md:text-[15px] leading-snug ${
                l.who === "me"
                  ? "self-end bg-[#0a84ff] text-white rounded-br-[6px]"
                  : "self-start bg-[#e9e9eb] text-black rounded-bl-[6px]"
              }`}
            >
              {l.text}
            </motion.div>
          ))}
        </div>
        {labels.note && (
          <p className="font-['Shantell_Sans',cursive] text-[13px] text-black/50 rotate-[-1deg]">{labels.note}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 items-center md:items-start">
        <span className="self-start md:self-center bg-[#ff614c] text-white font-['Work_Sans'] text-[12px] uppercase tracking-wider px-2 py-1">
          {labels.after}
        </span>
        <Phone src={after} alt={afterAlt} className="w-[62%] max-w-[260px] md:mx-auto" />
      </div>
    </div>
  );
}
