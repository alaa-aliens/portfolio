import { useEffect } from "react";

const DEFAULT_TITLE = "Ala'a Ali — UX/UI Designer";
const DEFAULT_DESC =
  "UX/UI Designer • Illustrator • Facilitator — I design apps, platforms, and dashboards that people don't need a manual to use. That's the whole job, really.";

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
    setMeta("property", "og:url", window.location.href);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://alaa-ali.com${window.location.pathname}`;
  }, [title, description]);
}
