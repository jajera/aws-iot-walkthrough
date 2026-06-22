---
inclusion: fileMatch
fileMatchPattern: "src/data/glossary*"
---

# Glossary Conventions

## File structure

- Glossary lives in `src/data/glossary.ts`
- Type: `Record<string, string>` — key is the term slug, value is the definition
- Keep entries in **alphabetical order** by key
- Keys use lowercase kebab-case (e.g. `iot-core`, `api-gateway`)

## Definition style

- Start with the expanded form / full name
- Keep definitions to one or two sentences max
- Include walkthrough-specific context (log group names, phase references) when helpful

## Usage in pages

```mdx
import Tooltip from "@/components/Tooltip.astro";

<Tooltip term="aws" />
<Tooltip term="iot-core" label="IoT Core" />
```

## When to add a new term

Add a glossary entry when:

- A term appears on multiple pages
- The term has a specific meaning in this walkthrough
- First-time readers might not know the abbreviation
