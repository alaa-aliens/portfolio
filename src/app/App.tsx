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
import faviconImg from "figma:asset/91302547bc91ac7f0baa4ec137febfe13f1115ff.png";

function useFavicon() {
  useEffect(() => {
    document.title = "Ala'a Ali — UX/UI Designer";

    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconImg;

    /* ── Open Graph & social sharing meta tags ── */
    const ogTags: Record<string, string> = {
      "og:title": "Hey, My Name is Ala'a Ali",
      "og:description":
        "UX/UI Designer • Illustrator • Facilitator — I design apps, platforms, and dashboards that people don't need a manual to use. That's the whole job, really.",
      "og:image": faviconImg,
      "og:type": "website",
      "og:url": "https://alaa-ali.com",
      "og:site_name": "Ala'a Ali — UX/UI Designer",
    };

    const twitterTags: Record<string, string> = {
      "twitter:card": "summary_large_image",
      "twitter:title": "Hey, My Name is Ala'a Ali",
      "twitter:description":
        "UX/UI Designer • Illustrator • Facilitator — I design apps, platforms, and dashboards that people don't need a manual to use. That's the whole job, really.",
      "twitter:image": faviconImg,
    };

    // Set standard description meta
    let descMeta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.name = "description";
      document.head.appendChild(descMeta);
    }
    descMeta.content =
      "UX/UI Designer • Illustrator • Facilitator — I design apps, platforms, and dashboards that people don't need a manual to use. That's the whole job, really.";

    // Set OG meta tags
    for (const [property, content] of Object.entries(ogTags)) {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    }

    // Set Twitter card meta tags
    for (const [name, content] of Object.entries(twitterTags)) {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    }
  }, []);
}

function AppContent() {
  const { isContactOpen, closeContact } = useContactForm();
  const { isArabic } = useMode();
  useFavicon();

  if (isArabic) {
    return (
      <div className="min-h-screen bg-[#fdecd0] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <ArabicPlaceholderPage />
        </main>
        <FooterSection />
        <ContactFormModal isOpen={isContactOpen} onClose={closeContact} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdecd0] flex flex-col">
      <Navbar />
      <main className="flex flex-col gap-16 md:gap-24">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <WhatIDoSection />
        <ProjectsSection />
        <WorkExperienceSection />
      </main>
      <div className="mt-16 md:mt-24">
        <FooterSection />
      </div>
      <ContactFormModal isOpen={isContactOpen} onClose={closeContact} />
    </div>
  );
}

export default function App() {
  return (
    <ModeProvider>
      <ContactFormProvider>
        <AppContent />
      </ContactFormProvider>
    </ModeProvider>
  );
}