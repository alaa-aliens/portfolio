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
