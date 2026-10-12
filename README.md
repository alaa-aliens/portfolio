# alaa-ali.com

Ala'a Ali's portfolio — React + Vite + Tailwind + Motion. Originally generated in Figma Make, now a normal code project.

## Run it

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # production build in dist/ (also writes sitemap.xml)
```

## Add or update a project

Everything lives in **`src/app/data/projects.tsx`**.

1. Copy any entry and give it a unique `slug` (used in the URL: `/work/<slug>`).
2. Pick a `category`: `gov`, `saas`, `fintech`, `edtech`, `games`, `media`, `own`.
3. Add `proHook` / `funHook` (one line each — Professional and Fun mode).
4. `featured: true` puts it on the homepage grid.
5. To publish the case study: set `status: "ready"` and fill `caseStudy`
   (problem, steps, before/after, results, gallery, closing). Empty parts are hidden.

Images: put them in `public/work/<slug>/` (WebP or JPG, ~1600px wide) and reference them
as `"/work/<slug>/screen-1.webp"`.

## Pages

| URL | What |
| --- | --- |
| `/` | Homepage |
| `/work` | All projects with category filters (`/work?f=edtech`) |
| `/work/<slug>` | Case study (or a "coming soon" page if not ready) |

## Animation building blocks

`src/app/components/motion/Doodles.tsx` — `Reveal`, `PenWipe`, `ScribbleUnderline`,
`SectionTitle`, `Doodle`, `CountUp`. All respect the visitor's "reduce motion" setting.

## Hosting

It's a single-page app, so the host must send every route to `index.html`.
`vercel.json` (Vercel) and `public/_redirects` (Netlify / Cloudflare Pages) already do that.


## Design language (read before touching the look)

Ala'a's own words, after one night of feedback:

- **Not** thick black borders, hard offset shadows on cards, or chunky bubble fonts: that reads as an "AI template" to him.
- **Yes**: cream `#fdecd0`, coral `#ff614c`, thin ink lines, lots of air, his doodle illustrations, hand-drawn (roughjs) frames (`src/app/components/ui/RoughBox.tsx`).
- Display font: **Gochi Hand** (`.font-display`), lowercase. Body: IBM Plex Serif. UI: Work Sans. Handwriting: Shantell Sans.
- One button: his original rectangle (`Button` in `ui/Kit.tsx`): white, 1px line, hard 4px shadow, DM Serif. Coral tone on dark.
- Tags are his coral labels (`Chip tone="ink"`), "next page" links are big marker words (`NextTiles`), never black boxes.
- Section titles use `DoodleTitle` with a `{token}` doodle.

## The game layer

`src/app/components/play/Score.tsx`: hearts (start with 1, fill at 30/80/150 points), points for pages (+5), case studies (+10), asking (+5), shuffling the sketchbook (+2), poking (+1), contact (+25 open, +50 copy, +100 send). Dead clicks (coming-soon projects, 404) cost a heart. Click the hearts for the rules card.

## Generated assets

- `src/assets/comic/*` six comic panels, `src/assets/covers/*` project covers, `src/assets/stickers/*` the sticker set: Magnific (gpt-2-mini) with his hero illustration as style reference. Prompts are in the session log; regenerate the same way for new projects.
- `src/assets/sfx/*` UI sounds: ElevenLabs via Magnific. Off by default; toggle in the sticker tray.
- `src/assets/head.webp` is the clean cut-out of his head. Use it instead of cropping the original PNG.

## Contact

No modal. Every "Get in Touch" goes to `/contact`, the postcard, which opens a `mailto:` with the stamped reason, the message and the signature.


## Hosting

Live at **alaa-ali.com** on GitHub Pages. Every push to `main` on `alaa-aliens/portfolio` runs `.github/workflows/deploy.yml` (build → `dist/` with `404.html` SPA fallback + `CNAME`) and publishes. GoDaddy DNS: four A records on `@` → 185.199.108/109/110/111.153 and `www` CNAME → `alaa-aliens.github.io`. The `siba` and `list` subdomains still point to Vercel.

## Contact form

The postcard posts to Formspree (`VITE_FORM_ENDPOINT` in `.env.production`, form "Postcard (alaa-ali.com)" in the Formspree account under alaa@alaa-ali.com). Without the env it falls back to a `mailto:`.
