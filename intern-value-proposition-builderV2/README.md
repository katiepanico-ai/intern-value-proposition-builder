# Intern Value Proposition Builder

A fully static, client-side React app that walks Dell Global Operations interns
through a 5-step framework for building their end-of-internship value
proposition, then exports a ready-to-use PowerPoint deck — all in the browser,
no backend or API keys required.

## What's in this package

- `dist/` — the built, ready-to-upload static site. This is what goes to SharePoint.
- `src/` — full React + TypeScript source, in case you want to customize content
  or design later.

## Deploying to SharePoint

1. Upload the entire contents of `dist/` (not the folder itself, its contents:
   `index.html`, `favicon.svg`, and the `assets/` folder) to a SharePoint
   document library.
2. Either link directly to `index.html` in that library, or embed it via a
   SharePoint "Embed" web part pointing at the `index.html` URL.
3. The app uses hash-based routing (URLs like `#/builder/step-2`) specifically
   so SharePoint doesn't try to intercept the routes as real folder paths — no
   further server configuration is needed.
4. All asset paths are relative, so the app also works if you just double-click
   `dist/index.html` locally, or drop it in any subfolder/site — no absolute
   path issues.

## Editing the content without touching code

Three files in `src/config/` hold all the editable text:

- `lciPriorities.ts` — the 8 LCI / business-ambition cards on Step 2.
- `examples.ts` — every tip, worked example, and guidance-panel note across
  all 5 steps (this is where the "Executive Impact Blueprint" framework
  language — the novice-vs-executive translations, the ROI formula, the
  Automation Matrix language, and the Implementation Roadmap prompts — lives).
- `prompts.ts` — the AI Prompt Library cards.

Edit any of these, then rebuild (see below) — no other file needs to change.

## Rebuilding after edits

```
npm install
npm run build
```

This produces a fresh `dist/` folder. Upload its contents to SharePoint as above.

## Local development

```
npm install
npm run dev
```

Opens a local dev server with hot reload at the printed localhost URL.

## Tech stack

React 19 + TypeScript, Vite, Tailwind CSS, react-router-dom (HashRouter),
pptxgenjs for the client-side PowerPoint export. All data is stored in
localStorage — nothing leaves the browser except when the intern chooses to
copy a prompt to an external AI tool.
