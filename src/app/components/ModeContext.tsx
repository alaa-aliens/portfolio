import React, { createContext, useContext, useState } from "react";

type Mode = "professional" | "fun";
type Lang = "en" | "ar";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  isProfessional: boolean;
  lang: Lang;
  setLang: (lang: Lang) => void;
  isArabic: boolean;
}

const ModeContext = createContext<ModeContextType>({
  mode: "professional",
  setMode: () => {},
  isProfessional: true,
  lang: "en",
  setLang: () => {},
  isArabic: false,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("professional");
  const [lang, setLang] = useState<Lang>("en");
  return (
    <ModeContext.Provider value={{
      mode, setMode, isProfessional: mode === "professional",
      lang, setLang, isArabic: lang === "ar",
    }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}