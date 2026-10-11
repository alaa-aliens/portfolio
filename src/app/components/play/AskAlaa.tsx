/*
 * "Ask Ala'a": his doodle head in the corner, now a tiny chat.
 * It greets you on each section, you can pick a question or type one,
 * and it answers in his voice from a local knowledge base (no server, no AI call).
 * The head reacts to what it says: nods, laughs, thinks, blushes.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { useMode } from "../ModeContext";
import { useContactForm } from "../ContactFormContext";
import imgHead from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

type Mood = "idle" | "nod" | "laugh" | "think" | "blush" | "shrug";
interface Answer { pro: string; fun: string; mood: Mood; go?: string; chips?: string[] }
interface Rule { keys: string[]; a: Answer }

const CHIPS_DEFAULT = ["What do you do?", "Are you available?", "Show me your best work", "Tell me a joke", "Why the doodles?"];

const RULES: Rule[] = [
  { keys: ["hello", "hi", "hey", "salam", "مرحبا", "هلا", "sup"], a: { pro: "Hi! I'm Ala'a, well, a doodle of him. Ask me anything about the work or the person.", fun: "Yo. I'm the doodle version. Slightly less tired than the real one.", mood: "nod", chips: CHIPS_DEFAULT } },
  { keys: ["what do you do", "who are you", "about", "job", "designer"], a: { pro: "UX/UI design, illustration and workshops, for 15+ years across MENA. Apps, dashboards and platforms people don't need a manual for.", fun: "I draw stuff, break layouts, fix them again. Also I teach people to do the same. Fifteen years of 'can we make it pop'.", mood: "nod", go: "/about", chips: ["How did you start?", "What tools do you use?", "Show me your best work"] } },
  { keys: ["start", "couch", "began", "story", "origin"], a: { pro: "I started out stitching couches in Irbid. Then illustrated 300+ kids' books, then Al Jazeera and TRT, then products. The full story is a comic strip on the About page.", fun: "Couches. I used to stitch couches. Then pixels. The career path makes zero sense, but it's a good comic strip.", mood: "laugh", go: "/about" } },
  { keys: ["available", "hire", "freelance", "work with", "book", "cost", "price", "rate"], a: { pro: "Yes, I take on select projects, audits and workshops. Tell me what you're building and I'll say honestly if I'm the right fit.", fun: "Available, caffeinated, slightly opinionated. Tell me what's broken.", mood: "nod", go: "/contact", chips: ["Write to you", "What's a UX audit?", "Where are you based?"] } },
  { keys: ["write", "email", "contact", "message", "reach"], a: { pro: "Opening the form. Or email alaa@alaa-ali.com.", fun: "Opening the form. Type nicely, Diva reads these.", mood: "blush", go: "#contact" } },
  { keys: ["audit", "review", "wrong", "feedback"], a: { pro: "A UX audit is me going through your product and naming the three things that matter most, with fixes, not the thirty that don't.", fun: "I use your product, find what hurts, tell you gently, then help fix it. Feelings may be bruised. Lightly.", mood: "think" } },
  { keys: ["best", "work", "project", "portfolio", "case study", "show me"], a: { pro: "Start with Siba, a study app I built for my daughters. It has the character, the voice and the whole journey. Then Carseer and Trackhawk.", fun: "Siba. I built an app for my kids and they reviewed it harder than any client. Go look.", mood: "nod", go: "/work/siba", chips: ["What is Siba?", "See all projects", "Who are Alma and Eleen?"] } },
  { keys: ["siba", "study app", "سيبا"], a: { pro: "Siba turns photos of a textbook page into a lesson, a quiz and games, after a parent reviews it. Named after Sibawayh, the grammarian of Arabic. Built for Alma and Eleen.", fun: "Siba: photo of a schoolbook goes in, a quiz comes out, and I stopped marking answers over iMessage at midnight. Named after a grammarian. I'm fancy like that.", mood: "nod", go: "/work/siba" } },
  { keys: ["alma", "eleen", "daughter", "kids", "children", "girls"], a: { pro: "Alma and Eleen, my daughters. They're the reason Siba exists, and the toughest testers I've ever had.", fun: "My daughters. Zero mercy in usability tests. One plays piano, one plays guitar, both judge my apps.", mood: "blush", go: "/work/siba" } },
  { keys: ["all projects", "everything", "list", "more work"], a: { pro: "Twenty-six projects on the Work page: government, SaaS, fintech, education, games, media.", fun: "The full damage. Twenty-six of them. Some under NDA. Very mysterious.", mood: "nod", go: "/work" } },
  { keys: ["tool", "figma", "software", "stack", "claude"], a: { pro: "Figma every day, Procreate for the doodles, and lately Claude Code to ship working apps myself. The desk is on the Skills page, you can throw things.", fun: "Figma, Procreate, coffee, and an AI dev team that never sleeps. Go throw my skills around on the Skills page.", mood: "think", go: "/skills" } },
  { keys: ["skill", "good at", "table", "bring"], a: { pro: "UX research, UI, design systems, Arabic & RTL, prototyping, workshops, illustration, motion. Drag them around on the Skills page.", fun: "Strong opinions, border-radius debates, and some actual skills. They're on a desk you can throw things off.", mood: "nod", go: "/skills" } },
  { keys: ["experience", "worked", "career", "al jazeera", "trt", "sitech", "syntax", "cv", "resume"], a: { pro: "Al Jazeera and TRT in Qatar and Türkiye, Lead Designer at Syntax, Director of UX at Sitech, now freelancing. Plus teaching at Zain, 42 Amman, HTU.", fun: "Al Jazeera, TRT, a Lead title, a Director title, and now my own boss, employee and IT department. The lore is on the Experience page.", mood: "nod", go: "/experience" } },
  { keys: ["where", "based", "amman", "jordan", "location", "remote"], a: { pro: "Amman, Jordan, GMT+3. I work remotely with teams across MENA and beyond.", fun: "Amman, Jordan. Where the coffee is strong and the meetings are stronger.", mood: "nod" } },
  { keys: ["arabic", "rtl", "localis", "localiz", "bilingual"], a: { pro: "Arabic and RTL is a specialty. Mirroring an English layout isn't localising: arrows, icons, numbers and reading order all change.", fun: "If your Arabic app is just the English one flipped, we need to talk. Seriously. Call me.", mood: "think" } },
  { keys: ["doodle", "draw", "illustration", "instagram", "aliens"], a: { pro: "I draw UX explainers as @alaa_aliens on Instagram. Doodles make hard ideas simple, and they make meetings shorter.", fun: "The doodles are therapy. For me, not for you. @alaa_aliens if you want more.", mood: "blush" } },
  { keys: ["workshop", "teach", "talk", "training", "course"], a: { pro: "I run UX/UI workshops for teams, universities and bootcamps: Zain, 42 Amman, HTU, and every government university in Jordan.", fun: "I stand in front of rooms and talk about UX. Sometimes they clap. Sometimes they just want the Figma shortcuts.", mood: "laugh", go: "/experience" } },
  { keys: ["joke", "funny", "laugh"], a: { pro: "A designer walks into a bar. It had no border-radius. He left.", fun: "How many designers does it take to change a lightbulb? Does it have to be a lightbulb?", mood: "laugh", chips: ["Another one", "Why the doodles?", "Show me your best work"] } },
  { keys: ["another"], a: { pro: "Client: 'Can you make the logo bigger?' Me: 'Can you make the budget bigger?' We're still friends.", fun: "My daughter asked what I do. I said 'I make buttons.' She said 'like, with a sewing machine?' Full circle.", mood: "laugh" } },
  { keys: ["cat", "diva"], a: { pro: "Diva, my cat. Attends every call, approves nothing.", fun: "Diva. Sits on the keyboard during design reviews. Harshest critic I have.", mood: "blush" } },
  { keys: ["coffee", "drink"], a: { pro: "Coffee is the real design tool.", fun: "Coffee number four. Don't ask about one to three.", mood: "laugh" } },
  { keys: ["game console", "playstation", "gamer", "pc"], a: { pro: "Longtime console gamer. I also built a PC for sim racing. It's research.", fun: "Five PlayStation generations survived. Built a sim-racing PC. It mostly runs Figma.", mood: "laugh" } },
  { keys: ["mode", "fun", "professional", "toggle"], a: { pro: "The toggle at the top switches the whole site between Professional and Fun. Same facts, different mood.", fun: "You're already in Fun mode. Brave.", mood: "nod" } },
  { keys: ["sticker", "doodle on", "deface"], a: { pro: "The 'doodle on my site' button lets you stamp my stickers anywhere. Go wild.", fun: "Bottom left. Deface my website. I won't tell.", mood: "laugh" } },
  { keys: ["thank", "thanks", "shukran", "شكرا"], a: { pro: "Any time. Say hi if you build something.", fun: "No problem. Tip jar is coffee.", mood: "blush" } },
];

const FALLBACK: Answer[] = [
  { pro: "Good question. The real me would answer that better, write to him?", fun: "The doodle version doesn't know that one. The real me does. Allegedly.", mood: "shrug", chips: ["Write to you", "What do you do?", "Show me your best work"] },
  { pro: "I'm a doodle, so I know about the work, the story, and the cat. Try one of these.", fun: "I know the work, the lore, and the cat. That's it. I'm a drawing.", mood: "shrug", chips: CHIPS_DEFAULT },
];

const GREET: Record<string, [string, string]> = {
  "/": ["Hi! I'm your tour guide. Also the designer. Ask me anything.", "I'm the tour guide. Unpaid. Ask me stuff."],
  "/work": ["Black tag = full case study. Ask me about any of them.", "The untagged ones are in my drafts. Ask anyway."],
  "/about": ["The comic strip is my actual life. Ask me about the couches.", "Yes, the couch thing is real. Ask."],
  "/skills": ["Throw the skills around. Poke the cat. Ask me about the desk.", "Poke the things on the desk. The cat bites. Ask me anything."],
  "/experience": ["Four timelines. Ask me about any of them.", "The lore. Ask about the PlayStation years."],
  "/contact": ["Pick a reason, or just ask me first.", "Ask me first if you're shy."],
};

function answer(q: string, isPro: boolean): Answer {
  const t = q.toLowerCase();
  const hit = RULES.find((r) => r.keys.some((k) => t.includes(k)));
  if (hit) return hit.a;
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

export function AskAlaa() {
  const { isProfessional, mode } = useMode();
  const { openContact } = useContactForm();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [log, setLog] = useState<{ who: "me" | "you"; text: string }[]>([]);
  const [chips, setChips] = useState<string[]>(CHIPS_DEFAULT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [peek, setPeek] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Greeting bubble per page (only when the chat is closed)
  useEffect(() => {
    const base = pathname.startsWith("/work/") ? "/work" : pathname;
    const g = GREET[base]?.[isProfessional ? 0 : 1];
    if (!g || open) return;
    const t = window.setTimeout(() => setPeek(g), 700);
    const t2 = window.setTimeout(() => setPeek(null), 6500);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [pathname, mode, open, isProfessional]);

  // Hide over the footer
  useEffect(() => {
    const footer = document.getElementById("contact");
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting && !open), { threshold: 0.05 });
    io.observe(footer);
    return () => io.disconnect();
  }, [pathname, open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [log, typing]);

  const bump = (m: Mood) => {
    setMood(m);
    window.setTimeout(() => setMood("idle"), 1400);
  };

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setLog((l) => [...l, { who: "you", text }]);
    setInput("");
    setTyping(true);
    bump("think");
    const a = answer(text, isProfessional);
    window.setTimeout(() => {
      setTyping(false);
      setLog((l) => [...l, { who: "me", text: isProfessional ? a.pro : a.fun }]);
      setChips(a.chips ?? CHIPS_DEFAULT);
      bump(a.mood);
      if (a.go === "#contact") window.setTimeout(openContact, 600);
      else if (a.go && a.go !== pathname) window.setTimeout(() => navigate(a.go!), 900);
    }, 550 + Math.min(900, text.length * 25));
  };

  const openChat = () => {
    setOpen(true);
    setPeek(null);
    if (log.length === 0) {
      setLog([{ who: "me", text: isProfessional ? "Hi, I'm Ala'a (the doodle version). Ask me about the work, the story, or the cat." : "Yo. Doodle Ala'a here. I know the work, the lore, and the cat. Shoot." }]);
    }
  };

  const headAnim =
    mood === "nod" ? { rotate: [0, -8, 6, -4, 0], y: [0, 4, -2, 2, 0] }
    : mood === "laugh" ? { rotate: [0, 10, -10, 8, -6, 0], y: [0, -10, 0, -6, 0] }
    : mood === "think" ? { rotate: [0, 14, 12, 14], y: [0, -3, -3, -3] }
    : mood === "blush" ? { rotate: [0, -12, -10], scale: [1, 1.08, 1.05] }
    : mood === "shrug" ? { rotate: [0, -6, 6, -6, 0], y: [0, -6, -6, 0] }
    : { y: [0, -5, 0] };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: 140 }}
          animate={{ y: 0 }}
          exit={{ y: 160 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="fixed z-[75] right-3 md:right-6 bottom-3 md:bottom-4 flex items-end gap-2"
        >
          {/* Chat window */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="chat"
                role="dialog"
                aria-label="Ask Ala'a"
                initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="mb-2 w-[min(92vw,340px)] bg-[#fffaf1] border border-black rounded-[20px] shadow-[5px_6px_0_0_#1d1a17] flex flex-col overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-black bg-[#FFE9C7]">
                  <span className="font-['Playfair_Display'] font-bold text-[16px]">{isProfessional ? "Ask Ala'a" : "Ask the doodle"}</span>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="w-7 h-7 rounded-full hover:bg-black/10 text-[14px]">✕</button>
                </div>
                <div ref={listRef} className="max-h-[42vh] md:max-h-[300px] overflow-y-auto px-3 py-3 flex flex-col gap-2">
                  {log.map((m, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`max-w-[88%] px-3 py-2 rounded-[14px] font-['Work_Sans'] text-[13.5px] leading-snug ${
                        m.who === "me" ? "self-start bg-white border border-black/15 rounded-bl-[4px]" : "self-end bg-[#1d1a17] text-[#fffaf1] rounded-br-[4px]"
                      }`}
                    >
                      {m.text}
                    </motion.p>
                  ))}
                  {typing && (
                    <span className="self-start px-3 py-2 rounded-[14px] bg-white border border-black/15 flex gap-1" aria-label="typing">
                      {[0, 1, 2].map((k) => (
                        <motion.span key={k} className="w-1.5 h-1.5 rounded-full bg-black/50" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: k * 0.12 }} />
                      ))}
                    </span>
                  )}
                </div>
                <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
                  {chips.map((c) => (
                    <button key={c} onClick={() => ask(c)} className="shrink-0 rounded-full border border-black/30 bg-white px-2.5 py-1 font-['Work_Sans'] text-[12px] hover:border-black hover:bg-[#FFE9C7]">
                      {c}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    ask(input);
                  }}
                  className="flex gap-2 p-2.5 border-t-2 border-black"
                >
                  <input
                    id="ask-alaa-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isProfessional ? "Ask me anything…" : "go on, ask"}
                    className="flex-1 min-w-0 rounded-full border border-black/20 focus:border-black bg-white px-3 py-2 font-['Work_Sans'] text-[14px] outline-none"
                  />
                  <button type="submit" aria-label="Send" className="w-10 h-10 rounded-full bg-[#ff614c] border border-black text-white font-bold shadow-[2px_2px_0_0_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                    ↑
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Peek bubble when closed */}
          <AnimatePresence>
            {!open && peek && (
              <motion.button
                key={peek}
                onClick={openChat}
                initial={{ opacity: 0, scale: 0.6, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 10 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="mb-12 md:mb-14 max-w-[220px] md:max-w-[260px] text-left origin-bottom-right bg-white border border-black rounded-[16px] rounded-br-[4px] px-3 py-2 shadow-[3px_3px_0_0_black] font-['Shantell_Sans',cursive] text-[13px] md:text-[14px] leading-snug"
              >
                {peek}
                <span className="block mt-1 font-['Work_Sans'] text-[11px] uppercase tracking-wider text-[#ff614c]">ask me →</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* The head */}
          <motion.button
            onClick={() => (open ? setOpen(false) : openChat())}
            aria-label={open ? "Close Ask Ala'a" : "Open Ask Ala'a"}
            aria-expanded={open}
            className="relative w-[62px] h-[74px] md:w-[80px] md:h-[96px] shrink-0 origin-bottom"
            animate={headAnim}
            transition={{ duration: mood === "idle" ? 2.4 : 0.9, repeat: mood === "idle" ? Infinity : 0, ease: "easeInOut" }}
            whileHover={{ scale: 1.08 }}
          >
            <span aria-hidden className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-2 rounded-full bg-black/15 blur-[1px]" />
            <span className="absolute inset-0 overflow-hidden">
              <img alt="" src={imgHead} className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none" />
            </span>
            {mood === "blush" && <span aria-hidden className="absolute left-[28%] top-[52%] w-3 h-2 rounded-full bg-[#ff614c]/60 blur-[1px]" />}
            {mood === "think" && <span aria-hidden className="absolute -top-3 right-0 font-['Shantell_Sans',cursive] text-[18px]">?</span>}
            {!open && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff614c] border border-black text-[10px] font-bold text-white flex items-center justify-center" aria-hidden>?</span>
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
