---
inclusion: fileMatch
fileMatchPattern: "src/content/docs/**"
---

# Documentation Page Pattern

## Page structure

1. **Frontmatter** — `title`, `description`
2. **Imports** — Starlight components, then `Tooltip` from `@/components/Tooltip.astro`
3. **Intro** — one paragraph on what the page covers
4. **Sections** — headed steps with CLI commands
5. **Verification** — how to confirm success

## Standard imports

```mdx
import { Aside } from "@astrojs/starlight/components";
import Tooltip from "@/components/Tooltip.astro";
```

## Tooltip usage

Use `<Tooltip term="key" />` or `<Tooltip term="key" label="Display text" />` on the first occurrence of a glossary term per section.

## MDX tables

When a page imports custom components (e.g. `Tooltip`), use HTML `<table>` — not markdown pipe tables. See `markdown-tables.md`.

## Internal links

Include the site base path: `/aws-iot-walkthrough/`.

## Prerequisites software installs

The prerequisites page documents manual Ubuntu and Red Hat steps per tool, with optional [cli-tools](https://github.com/jdevto/cli-tools/) one-liners under each tool's Red Hat subsection.
