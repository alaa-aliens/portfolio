import imgImage4 from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";
import { useMode } from "./ModeContext";
import { useState, useEffect } from "react";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const { mode, setMode, lang, setLang, isArabic } = useMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#fdecd0] flex items-center justify-between px-6 md:px-10 h-[80px] md:h-[100px] transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.08)]" : ""}`}>
      {/* Logo */}
      <button
        onClick={() => scrollToSection("hero")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-10 h-12 relative overflow-hidden shrink-0">
          <img
            alt="Logo"
            className="absolute h-[121%] left-[-27%] top-[-7%] w-[142%] max-w-none"
            src={imgImage4}
          />
        </div>
        <span className="font-['IBM_Plex_Serif'] font-bold text-[22px] md:text-[28px] text-black">
          Ala'a Ali
        </span>
      </button>

      {/* Toggle */}
      <div className={`hidden md:flex items-center gap-0 rounded-full border border-[#c9b9a0] p-[6px] w-[340px] md:w-[400px] transition-opacity duration-300`}>
        <button
          onClick={() => setMode("professional")}
          className={`flex-1 py-2 px-4 rounded-full font-['DM_Serif_Display'] text-[17px] md:text-[19px] transition-all duration-300 ${
            mode === "professional"
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-[#979797]"
          }`}
        >
          Professional
        </button>
        <button
          onClick={() => setMode("fun")}
          className={`flex-1 py-2 px-4 rounded-full font-['DM_Serif_Display'] text-[17px] md:text-[19px] transition-all duration-300 ${
            mode === "fun"
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-[#979797]"
          }`}
        >
          Fun
        </button>
      </div>

      {/* Language */}
      <div className="flex items-center gap-2 font-['IBM_Plex_Serif'] font-bold text-[18px] md:text-[20px]">
        <button
          onClick={() => {
            setLang("en");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`cursor-pointer transition-colors ${lang === "en" ? "text-black" : "text-[#999]"}`}
        >
          En
        </button>
        <span className="text-[#c9b9a0]">|</span>
        <button
          onClick={() => {
            setLang("ar");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`cursor-pointer transition-colors ${lang === "ar" ? "text-black" : "text-[#999]"}`}
        >
          Ar
        </button>
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0 rounded-full border border-[#c9b9a0] bg-[#fdecd0] p-[5px] w-[260px] shadow-lg">
        <button
          onClick={() => setMode("professional")}
          className={`flex-1 py-2 px-3 rounded-full font-['DM_Serif_Display'] text-[15px] transition-all duration-300 ${
            mode === "professional"
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-[#979797]"
          }`}
        >
          Professional
        </button>
        <button
          onClick={() => setMode("fun")}
          className={`flex-1 py-2 px-3 rounded-full font-['DM_Serif_Display'] text-[15px] transition-all duration-300 ${
            mode === "fun"
              ? "bg-white text-black shadow-sm"
              : "bg-transparent text-[#979797]"
          }`}
        >
          Fun
        </button>
      </div>
    </nav>
  );
}