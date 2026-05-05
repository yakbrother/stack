# stack.yakbrother.dev

My personal knowledge base on **Design · Security · AI Agents**, built with [Astro](https://astro.build) and deployed on Netlify. Zero client-side JavaScript.

Maintained with [Claude Code](https://claude.ai/code) using the [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) by Andrej Karpathy.

## Setup

```bash
cd ~/wiki-public
npm install

# Local dev server
npm run dev

# Production build
npm run build
```

## Netlify deploy

1. Push repo to GitHub
2. Connect to Netlify → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`

Or use the `netlify.toml` — it's already configured.

## Working with Claude Code

Open this folder in Claude Code. It reads `CLAUDE.md` automatically.

Key commands:
- `"Ingest [source or URL]"` — process a new source into the wiki
- `"Save this session"` — file the current conversation
- `"Lint the wiki"` — health check for gaps, broken references, draft backlog
- `"[Any question]"` — query the wiki for a synthesized answer

## Structure

```
wiki-public/
├── CLAUDE.md              ← LLM operating instructions
├── astro.config.mjs       ← Astro config
├── netlify.toml           ← Deploy config + security headers
├── src/
│   ├── content.config.ts  ← Zod schemas for all content types
│   ├── content/           ← Published wiki pages (public)
│   │   ├── concepts/
│   │   ├── entities/
│   │   ├── tools/
│   │   ├── patterns/
│   │   ├── sources/
│   │   ├── synthesis/
│   │   └── sessions/
│   ├── layouts/           ← Astro layouts
│   ├── pages/             ← Astro routes
│   └── styles/wiki.css    ← The one CSS file
└── draft/                 ← Private staging (gitignored)
```
