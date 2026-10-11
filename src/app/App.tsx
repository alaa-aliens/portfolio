import { ModeProvider } from "./components/ModeContext";
import { ContactFormProvider } from "./components/ContactFormContext";
import { ContactFormModal } from "./components/ContactFormModal";
import { useContactForm } from "./components/ContactFormContext";
import { useMode } from "./components/ModeContext";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { AboutSection } from "./components/AboutSection";
import { WhatIDoSection } from "./components/WhatIDoSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { WorkExperienceSection } from "./components/WorkExperienceSection";
import { FooterSection } from "./components/FooterSection";
import { ArabicPlaceholderPage } from "./components/ArabicPlaceholderPage";
import { useEffect } from "react";
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from "react-router";

// The single-file preview build uses #/ URLs because it has no server to route paths.
const Router = import.meta.env.MODE === "preview" ? HashRouter : BrowserRouter;
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { WorkPage } from "./pages/WorkPage";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { ScrollProgress } from "./components/ScrollProgress";
import { usePageMeta } from "./usePageMeta";
import { Stickers } from "./components/play/Stickers";
import { TourGuide } from "./components/play/TourGuide";
import { SkillsTable } from "./components/play/SkillsTable";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // wait a tick for the page to render, then jump to the section
      const id = hash.slice(1);
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function HomePage() {
  usePageMeta();
  return (
    <main className="flex flex-col gap-16 md:gap-24">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <WhatIDoSection />
      <SkillsTable />
      <ProjectsSection />
      <WorkExperienceSection />
    </main>
  );
}

function AppContent() {
  const { isContactOpen, closeContact } = useContactForm();
  const { isArabic } = useMode();
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#fdecd0] flex flex-col">
      <ScrollProgress />
      {!isArabic && <Stickers />}
      {!isArabic && <TourGuide />}
      <Navbar />
      <ScrollManager />
      {isArabic ? (
        <main className="flex-1">
          <ArabicPlaceholderPage />
        </main>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="flex-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="*" element={<CaseStudyPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="mt-16 md:mt-24">
        <FooterSection />
      </div>
      <ContactFormModal isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MotionConfig reducedMotion="user">
        <ModeProvider>
          <ContactFormProvider>
            <AppContent />
          </ContactFormProvider>
        </ModeProvider>
      </MotionConfig>
    </Router>
  );
}
