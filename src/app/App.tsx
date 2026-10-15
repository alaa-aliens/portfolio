import { ScoreTracker } from "./components/play/Score";
import { ModeProvider } from "./components/ModeContext";
import { ContactFormProvider } from "./components/ContactFormContext";
import { useMode } from "./components/ModeContext";
import { Navbar } from "./components/Navbar";
import { FooterSection } from "./components/FooterSection";
import { ArabicPlaceholderPage } from "./components/ArabicPlaceholderPage";
import { useEffect } from "react";
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from "react-router";

// The single-file preview build uses #/ URLs because it has no server to route paths.
const Router = import.meta.env.MODE === "preview" || import.meta.env.MODE === "v2" ? HashRouter : BrowserRouter;
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { WorkPage } from "./pages/WorkPage";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { ScrollProgress } from "./components/ScrollProgress";
import { Stickers } from "./components/play/Stickers";
import { InkCursor } from "./components/play/InkCursor";
import { ModeSwitchFX } from "./components/play/ModeSwitchFX";
import { AskAlaa } from "./components/play/AskAlaa";
import { DayPage } from "./pages/DayPage";
import { BlogPage, PostPage } from "./pages/BlogPage";
import { AboutPage } from "./pages/AboutPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { ContactPage } from "./pages/ContactPage";

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

function AppContent() {
  const { isArabic } = useMode();
  const location = useLocation();

  return (
    <div className={`relative min-h-screen flex flex-col ${location.pathname === "/" ? "" : "bg-[#fdecd0]"}`}>
      <ScrollProgress />
      <InkCursor />
      <ModeSwitchFX />
      {!isArabic && <Stickers />}
      <ScoreTracker />
      {!isArabic && <AskAlaa />}
      <Navbar />
      <ScrollManager />
      {isArabic && !location.pathname.startsWith("/blog") ? (
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
              <Route path="/" element={<DayPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/topic/:cat" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<PostPage />} />
              <Route path="/blog/:slug/:lang" element={<PostPage />} />
              <Route path="*" element={<CaseStudyPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="mt-16 md:mt-24">
        <FooterSection />
      </div>
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
