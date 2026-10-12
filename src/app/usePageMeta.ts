import { useEffect } from "react";

const DEFAULT_TITLE = "Ala'a Ali — UX/UI Designer";
const DEFAULT_DESC =
  "Ala'a Ali is a UX/UI designer, illustrator and workshop facilitator in Amman, Jordan. 15+ years designing apps, dashboards and platforms across MENA.";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Sets the browser title + description (and social tags) for the current page. */
export function usePageMeta({ title, description }: { title?: string; description?: string } = {}) {
  useEffect(() => {
    const t = title ?? DEFAULT_TITLE;
    const d = description ?? DEFAULT_DESC;
    document.title = t;
    setMeta("name", "description", d);
    setMeta("property", "og:title", t);
    setMeta("property", "og:description", d);
    setMeta("property", "og:url", `https://alaa-ali.com${window.location.pathname}`);
    setMeta("name", "twitter:title", t);
    setMeta("name", "twitter:description", d);
    // GA4 page view per route (the tag is set to not auto-send)
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (g) g("event", "page_view", { page_title: t, page_location: window.location.href, page_path: window.location.pathname });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://alaa-ali.com${window.location.pathname}`;
  }, [title, description]);
}
