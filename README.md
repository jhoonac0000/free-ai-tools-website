# ToolNest — Free Tools to Learn and Earn

**Status:** Built 2026-10-28. Static files only — deploy-ready for Cloudflare Pages. NOT published yet (parent handles deploy).

## Brand note (working brand)
"ToolNest" is a working brand name chosen for this build (the ecosystem roadmap left the name open). It can be changed in one pass (logo text + titles + footer) before launch.

## Technology used (for the record)
- **HTML5** — semantic pages, one file per tool (own URL + own SEO title/meta per tool).
- **Modern CSS** — Grid + Flexbox, mobile-first responsive, CSS variables, no framework, no build step.
- **Vanilla JavaScript (ES modules pattern, plain script files)** — `assets/app.js` (homepage search + category filter), `assets/tools.js` (all 15 tool logics). No frameworks, no jQuery, no backend, no database, no API keys.
- **Hosting:** static files → Cloudflare Pages (build command: none, output directory: this folder).
- **Privacy by architecture:** every tool runs 100% in the browser. Nothing is uploaded, nothing is stored server-side.

## Structure
- `index.html` — dashboard: hero + search + category filters + 15-tool grid + Learn guides + trust line + store teaser band.
- `tools/*.html` — 15 tool pages, each: working tool FIRST, then LEARN (steps + pro tips), FAQ (3–4), EARN (honest earning hint + one CTA), related tools (3), category link.
- `learn.html` + `learn/*.html` — Learn index + 4 original guides.
- `about.html`, `contact.html` (client-side message preparation, no fake sending), `privacy.html` (files/text never leave the browser).
- `sitemap.xml`, `robots.txt` — replace `YOUR-DOMAIN-HERE` with the real domain before deploy.
- `COMPETITOR-COMPARISON-2026-10-28.md` — Step-1 comparison (TinyWow, iLovePDF/Smallpdf, Toolify).
- `SEO-PLAN-2026-10-28.md` — SEO audit, gap list, 90-day goal plan.

## The 15 tools (exactly the user-selected list, 2026-10-23)
1. Resume Builder + Cover Letter Generator — 2. Etsy/Amazon Description Generator — 3. Cold Email + Subject Line Generator — 4. Loan/Mortgage/Tax Calculators — 5. YouTube Title/Description/Hashtag Generator — 6. Invoice Generator — 7. Text Summarizer (extractive) — 8. Paraphraser + Grammar Checker — 9. LinkedIn Headline + Bio Generator — 10. Instagram Caption + Bio Generator — 11. Business Name + Slogan Generator — 12. Freelance Rate Calculator — 13. Meeting Notes Summarizer — 14. Blog Title + Outline Generator — 15. Real Estate Listing Generator.

## Honesty notes (do not remove)
- Generators are framework/word-bank powered in the browser. Pages that use templates say so plainly; none claims a live AI model.
- The Text Summarizer is extractive (selects original sentences, invents none).
- The finance calculators carry an "educational estimate only — not financial advice" disclaimer, and tax rates are user-entered (never hard-coded by country).
- No fake stats, testimonials, traffic or revenue claims anywhere.
- Roadmap Phase-1 extras NOT in this build (PDF Toolkit, Background Remover, Word→Excel, Image pack) — they are not in the user-selected list and are next-lot candidates, not silently dropped features: see SEO-PLAN §6.

## How to add a tool later
1. Add its logic function to `assets/tools.js`.
2. Copy any `tools/*.html` page, replace the toolbox + Learn + FAQ + Earn sections, keep the same structure.
3. Add its card to `index.html` (with `data-cat`, `data-name`, `data-desc`) and a line to `sitemap.xml`.
4. Keep the rule: tool first, Learn second, Earn third, related tools last, no dead ends.
