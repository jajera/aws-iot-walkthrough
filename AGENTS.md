# AWS IoT Walkthrough — Agent Notes

## Layout

```
src/content/docs/     # Starlight MDX pages (12 sections)
src/data/glossary.ts  # Tooltip term definitions
src/components/       # Tooltip.astro
.kiro/steering/       # Docs and glossary conventions
.kiro/specs/          # Requirements, design, tasks
```

## Content conventions

- Every content page imports `Tooltip` and uses glossary terms on first occurrence per section.
- Prerequisites software installs: manual Ubuntu/Red Hat steps per tool; cli-tools scripts under each Red Hat subsection.
- HTML tables when `Tooltip` is imported — see `.kiro/steering/markdown-tables.md`.
- Base path for internal links: `/aws-iot-walkthrough/`.

## Validation

```bash
npm run validate
npm run test
```
