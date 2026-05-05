# Wiki Schema: Design · Security · AI Agents (Public)

This wiki is **publicly published** at a Netlify URL. Everything in `src/content/` is live on the internet. Read this file before every session.

---

## Project structure

```
wiki-public/
├── CLAUDE.md                     ← this file (read-only)
├── astro.config.mjs              ← Astro config (edit only for site settings)
├── netlify.toml                  ← Netlify deploy config
├── src/
│   ├── content.config.ts         ← Zod schemas for all 7 content types
│   ├── content/                  ← PUBLIC — everything here is published
│   │   ├── concepts/
│   │   ├── entities/
│   │   ├── tools/
│   │   ├── patterns/
│   │   ├── sources/
│   │   ├── synthesis/
│   │   └── sessions/
│   ├── layouts/                  ← Astro layout components (don't touch unless styling)
│   ├── pages/                    ← Astro page routes (don't touch unless adding new routes)
│   └── styles/wiki.css           ← The one CSS file — edit freely
└── draft/                        ← PRIVATE staging area (gitignored, never published)
```

**Rules:**
- You write to `src/content/` and `draft/` only
- `draft/` is gitignored — never published, safe for sensitive material
- Never modify `CLAUDE.md`, `astro.config.mjs`, `netlify.toml`, `src/layouts/`, or `src/pages/`
- Before moving any file from `draft/` to `src/content/`, run the publish checklist

---

## Public safety rules

This wiki is **public on the internet**. Every file in `src/content/` must pass all of these:

1. **No personal details** — no home location, employer names, income, health info, or anything identifying beyond "a software engineer based in Europe"
2. **No credentials or config secrets** — no API keys, account IDs, internal hostnames, ARNs, bucket names, IP ranges, `.env` contents
3. **No internal tooling specifics** — generic patterns and concepts are fine; "here's how [Company]'s internal auth works" is not
4. **No draft opinions** — synthesis pages should reflect considered, defensible positions. Half-formed thoughts go in `draft/`
5. **No third-party confidential info** — nothing from private Slack threads, NDA'd documents, or private conversations
6. **No personal grievances** — no commentary on specific employers, colleagues, or vendors that reads as a complaint

When in doubt: file to `draft/`, add a note explaining the concern, and flag it.

---

## Page format

Every page in `src/content/` must have valid frontmatter matching the Zod schema in `src/content.config.ts`. Build will fail otherwise — this is a feature.

```markdown
---
title: "Page Title"
summary: "One sentence describing what this page is about."
tags: [tag1, tag2]
related: ["Other Page Title", "Another Page"]
draft: false
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Page Title

[Body — see type conventions below]
```

- `summary` is shown in index listings — make it useful at a glance
- `related` is a list of page titles (not slugs); the layout renders them as links
- `draft: true` prevents the page from building even if it's in `src/content/`
- Pages in `draft/` directory don't need valid frontmatter — they're never built

---

## Page types and conventions

### `concepts/` — Ideas, principles, architectures, threat models
**Sections:** What it is · Why it matters · How it works · Variants · In practice · Open questions

**Voice:** Explain from first principles. Assume the reader is a smart engineer who hasn't encountered this specific concept before. No jargon without definition.

Examples: `zero-trust.md`, `prompt-injection.md`, `agentic-loop.md`, `least-privilege.md`

---

### `entities/` — Named orgs, frameworks, standards, projects
**Sections:** Overview · Key outputs · Relevance to this wiki · Relationships

Examples: `owasp.md`, `nist-csf.md`, `anthropic.md`, `langchain.md`

---

### `tools/` — Specific tools and services
**Sections:** What it does · Core concepts · Common patterns · Gotchas · References

**Public safety note:** Write about the tool generically. Don't include account-specific config, private endpoint URLs, or internal usage details.

Examples: `aws-secrets-manager.md`, `ansible.md`, `claude-code.md`, `terraform.md`

---

### `patterns/` — Reusable solutions
**Sections:** Problem · Solution · Diagram or pseudocode · When to use / avoid · Examples · Trade-offs

Take positions. "Prefer X when Y" is better than "it depends."

Examples: `secrets-rotation.md`, `tool-use-agent.md`, `human-in-the-loop.md`, `defense-in-depth.md`

---

### `sources/` — One page per ingested source
**Sections:** Metadata (title, author, date, URL) · Summary · Key claims · Relevance · Pages updated

Filename convention: `YYYY-MM-slug.md`. Only include public sources.

Additional frontmatter for sources:
```yaml
sourceUrl: "https://..."
sourceAuthor: "Author Name"
sourceDate: YYYY-MM-DD
```

---

### `synthesis/` — Filed answers and analyses
**Sections:** Question · Answer · Evidence · Confidence · Open threads

Additional frontmatter:
```yaml
question: "The question this page answers"
confidence: high | medium | low
```

---

### `sessions/` — Saved conversation summaries
**Sections:** Date · Topic · Key takeaways · Pages created/updated · Follow-up

**Public safety note:** Scrub all sensitive context. Publish takeaways and insights only, not raw conversation.

Additional frontmatter:
```yaml
topic: "What the conversation covered"
```

---

## Operations

### Ingest
When told to ingest a source:
1. Read the source
2. Briefly discuss key takeaways — ask what to emphasize or skip
3. Create a source summary page in `draft/sources/`
4. Create or update concept, entity, tool, or pattern pages in `draft/`
5. Run publish checklist on each draft page
6. Move passing pages to the appropriate `src/content/` subdirectory
7. Leave failing pages in `draft/` with a one-line comment explaining why
8. Report: N pages published, M pages held in draft, reasons for holds

A single source will typically touch 3–8 pages. That's normal.

### Query
1. Scan `src/content/` subdirectories to find relevant pages
2. Read those pages
3. Synthesize an answer with references to specific pages
4. If the answer is substantive and non-obvious: "Should I file this as a synthesis page?"
5. If yes: draft it, run checklist, publish if it passes

### Lint
Check for:
- Pages in `src/content/` with broken `related` references (title doesn't match any page)
- Concepts mentioned in body text that don't have their own page
- `draft/` pages older than 30 days with no explanation note
- Missing required frontmatter fields (build will catch these, but flag proactively)
- Any content that might violate public safety rules

### Session save
1. Summarize key insights from the conversation, scrubbed of sensitive context
2. Create a session page in `draft/sessions/`
3. Run publish checklist
4. Publish if it passes; leave in `draft/` if not, with explanation

---

## Publish checklist

Run before moving any page from `draft/` to `src/content/`:

- [ ] Passes all 6 public safety rules
- [ ] Frontmatter complete and valid: `title`, `summary`, `tags`, `related`, `created`, `updated`, `draft: false`
- [ ] Any type-specific frontmatter present (`question`/`confidence` for synthesis, `sourceUrl` for sources, `topic` for sessions)
- [ ] Summary is one useful sentence — not "This page is about X" but the actual point
- [ ] Content is complete enough to be useful, not just a stub
- [ ] No wikilinks or `related` entries that refer to pages not yet in `src/content/`

---

## Domain scope

**Design** — system architecture, distributed systems, API design, scalability, DevOps/IaC, Git workflows, cloud-native patterns

**Security** — threat modeling, secrets management, IAM, zero trust, OWASP (especially LLM Top 10), supply chain security, cloud security (AWS-focused), compliance frameworks (NIST, SOC2)

**AI Agents** — agent architectures, tool use, prompt engineering, memory systems, multi-agent coordination, MCP protocol, evaluation, LLM ops, agent security

Cross-link aggressively across domains — agent security, agentic system design, and secrets in CI/CD are all the same conversation.

---

## Writing voice (broader audience)

This wiki is for working engineers who may not be specialists in all three domains. Write accordingly:

- **Explain concepts from first principles** — don't assume the reader knows what an IAM role is, what prompt injection means, or what an agentic loop is. Define it, then go deep.
- **Take positions** — "prefer X over Y when Z" is more useful than "there are trade-offs"
- **Use concrete examples** — abstract principles land better with a specific scenario
- **No preamble** — start with the substance, not "In this page, we will explore..."
- **Cite sources** — link to `sources/` pages and external URLs; distinguish your synthesis from established consensus
- **Flag uncertainty** — if something is contested or evolving, say so explicitly
- **Write for skimmability** — use headers, short paragraphs, and lists where they genuinely help

---

## Astro-specific notes

- Pages are in `src/content/[type]/filename.md` — Astro builds them to `/[type]/[filename]/`
- The Zod schemas in `src/content.config.ts` validate every page at build time — a missing required field will fail the build. This is a safety net.
- `draft: true` in frontmatter prevents the page from appearing anywhere on the site, even if it's in `src/content/`
- Do not add `layout:` frontmatter — layouts are handled by the Astro page routes, not frontmatter
- Tags become browsable at `/tags/[tag-slug]/` automatically
- CSS lives in `src/styles/wiki.css` — one file, well-commented, edit freely to adjust the visual design
