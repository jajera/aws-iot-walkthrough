# Design Document: AWS IoT Walkthrough

## Overview

This design describes the AWS IoT Walkthrough documentation site — a 12-section progressive structure. The site is purely content-organizational: section subdirectories under `src/content/docs/`, dedicated pages for security posture, firmware architecture, payload contracts, and reference lookups, with navigation configured in `astro.config.mjs`.

The site preserves all operational commands from the demo repository. The end result is 25 content pages across 12 sidebar sections plus the splash page.

This design does not change runtime behavior in firmware, provisioning scripts, or Terraform modules; it only changes documentation structure and documentation content quality.

### Design Decisions

1. **One file per page** — Each content page is a single `.mdx` file. No file contains multiple sidebar-visible pages.
2. **Directory-per-section** — Each of the 10 sections maps to exactly one subdirectory under `src/content/docs/`.
3. **Slug-based sidebar references** — The sidebar uses `slug` format (`section/filename`) matching the filesystem path, which is the Starlight convention.
4. **Content split, not duplication** — Existing pages that cover multiple new sections are split by moving relevant blocks to the new target file. No content is duplicated across pages.
5. **New content sourced from Demo_Repo** — Security and Firmware sections draw from `provision.sh`, `aws/README.md`, firmware source files, and `PAYLOAD.md` in `esp32-aws-iot-demo`, using the branch or commit selected for this restructure.

## Architecture

The site architecture remains a static Astro Starlight site deployed to GitHub Pages. The restructure changes only the content layer and navigation configuration.

```text
┌─────────────────────────────────────────────────────┐
│  astro.config.mjs                                   │
│  ┌───────────────────────────────────────────────┐  │
│  │  sidebar: [Home, 12 Section groups]           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  src/content/docs/                                  │
│  ├── index.mdx  (splash)                           │
│  ├── introduction/                                 │
│  ...                                               │
│  src/data/glossary.ts                              │
│  src/components/Tooltip.astro                      │
└─────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────┐
│  Astro Build → dist/ → GitHub Pages                 │
└─────────────────────────────────────────────────────┘
```

### Build and Validation Pipeline

```bash
npm run validate
  ├── prettier --check .
  └── markdownlint-cli2 "src/**/*.mdx"

npm run build
  └── astro build (validates all sidebar slugs resolve to files)
```

For iterative edits during implementation, validators may be run against changed files first; final acceptance still requires `npm run validate` and `npm run build` to pass.

## Components and Interfaces

### Component 1: Sidebar Configuration (`astro.config.mjs`)

The sidebar array defines navigation. It is the single source of truth for section ordering and page grouping.

**Interface:** Starlight sidebar configuration format — an array of objects with `label` and either `link`, `slug`, or `items` (for groups).

### Component 2: Content Files (`src/content/docs/**/*.mdx`)

Each `.mdx` file has YAML frontmatter (`title`, `description`) and Markdown/MDX body content. Files are addressed by their path relative to `src/content/docs/` without the extension.

**Interface:** Starlight content collection schema — requires `title` string in frontmatter.

### Component 3: Splash Page (`src/content/docs/index.mdx`)

The root `index.mdx` uses `template: splash` and Starlight hero/card components. It needs its "Get Started" link updated from the old `/pretest/setup-and-prerequisites/` to the new `/introduction/project-overview/`.

**Interface:** Starlight splash template with `hero.actions[].link` navigation.

### Component 4: Glossary and Tooltip (`src/data/glossary.ts`, `src/components/Tooltip.astro`)

Centralized term definitions power inline popover tooltips across all walkthrough pages.

**Glossary interface:**

```typescript
export const glossary: Record<string, string> = {
  "iot-core": "AWS IoT Core — ...",
  // ...
};
```

**Tooltip interface (MDX usage):**

```mdx
import Tooltip from "@/components/Tooltip.astro";

<Tooltip term="iot-core" />
<Tooltip term="mqtt" label="MQTT" />
```

**Table rule:** Any `.mdx` page that imports `Tooltip` and needs a table MUST use HTML `<table>` markup. Markdown pipe tables break when mixed with Astro components in MDX.

**Steering:** `.kiro/steering/glossary.md` defines key naming, definition style, and when to add terms.

### Component 5: Prerequisites install layout (`prerequisites/hardware-and-software-requirements.mdx`)

Software requirements follow a repeatable per-tool structure:

1. HTML summary table (tool, verify command, usage) with Tooltip on tool names
2. One `### {Tool}` section per required tool
3. `#### {Tool} on Ubuntu` — manual apt/bash steps
4. `#### {Tool} on Red Hat` — manual dnf/bash steps plus optional cli-tools curl one-liner for that tool only
5. Combined verify block after all tools
6. Aside tip for Node.js 22, PATH, and idempotent installs

cli-tools one-liners MUST NOT be grouped in a single section at the page bottom; each belongs under its tool's Red Hat subsection.

## Data Models

### Content File Frontmatter Schema

```yaml
---
title: string (required) # Page title shown in sidebar and heading
description: string (required) # Meta description for SEO and page subtitle
template: splash (optional) # Only on index.mdx
hero: object (optional) # Only on index.mdx
---
```

### Sidebar Configuration Schema

```javascript
sidebar: [
  { label: "Home", link: "/" }, // Non-collapsible link
  {
    label: "Section Name", // Section group
    items: [
      { label: "Page Title", slug: "section/filename" }, // Content reference
    ],
  },
];
```

### File-to-Slug Mapping

| Directory             | Filename                                 | Sidebar Slug                                       |
| --------------------- | ---------------------------------------- | -------------------------------------------------- |
| `introduction/`       | `project-overview.mdx`                   | `introduction/project-overview`                    |
| `prerequisites/`      | `hardware-and-software-requirements.mdx` | `prerequisites/hardware-and-software-requirements` |
| `security/`           | `certificate-provisioning.mdx`           | `security/certificate-provisioning`                |
| `security/`           | `policies-and-iam.mdx`                   | `security/policies-and-iam`                        |
| `provisioning/`       | `cloudformation-bootstrap.mdx`           | `provisioning/cloudformation-bootstrap`            |
| `provisioning/`       | `device-provisioning.mdx`                | `provisioning/device-provisioning`                 |
| `firmware/`           | `source-layout.mdx`                      | `firmware/source-layout`                           |
| `firmware/`           | `architecture-and-modules.mdx`           | `firmware/architecture-and-modules`                |
| `firmware/`           | `payload-contract.mdx`                   | `firmware/payload-contract`                        |
| `firmware/`           | `build-configuration.mdx`                | `firmware/build-configuration`                     |
| `device-setup/`       | `linux-usb-setup.mdx`                    | `device-setup/linux-usb-setup`                     |
| `device-setup/`       | `build-flash-and-monitor.mdx`            | `device-setup/build-flash-and-monitor`             |
| `cloud-verification/` | `end-to-end-validation.mdx`              | `cloud-verification/end-to-end-validation`         |
| `infrastructure/`     | `stack-source-layout.mdx`                | `infrastructure/stack-source-layout`               |
| `infrastructure/`     | `ingest-pipeline.mdx`                    | `infrastructure/ingest-pipeline`                   |
| `infrastructure/`     | `terraform-provisioning.mdx`             | `infrastructure/terraform-provisioning`            |
| `api-and-dashboard/`  | `query-api-source-layout.mdx`            | `api-and-dashboard/query-api-source-layout`        |
| `api-and-dashboard/`  | `query-api-validation.mdx`               | `api-and-dashboard/query-api-validation`           |
| `api-and-dashboard/`  | `dashboard-source-layout.mdx`            | `api-and-dashboard/dashboard-source-layout`        |
| `api-and-dashboard/`  | `dashboard-and-hosting.mdx`              | `api-and-dashboard/dashboard-and-hosting`          |
| `troubleshooting/`    | `common-fixes.mdx`                       | `troubleshooting/common-fixes`                     |
| `reference/`          | `payload-quick-reference.mdx`            | `reference/payload-quick-reference`                |
| `reference/`          | `environment-variables.mdx`              | `reference/environment-variables`                  |
| `reference/`          | `teardown-and-cleanup.mdx`               | `reference/teardown-and-cleanup`                   |

### Content Migration Mapping

| Source File (current)                 | Target File(s) (new)                                                                        | Migration Type |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| `pretest/setup-and-prerequisites.mdx` | `prerequisites/hardware-and-software-requirements.mdx` + `device-setup/linux-usb-setup.mdx` | Split          |
| `pretest/flash-and-monitor.mdx`       | `device-setup/build-flash-and-monitor.mdx`                                                  | Move + rename  |
| `pretest/cloud-verification.mdx`      | `cloud-verification/end-to-end-validation.mdx`                                              | Move + rename  |
| `proper/infrastructure-and-api.mdx`   | `infrastructure/terraform-provisioning.mdx` + `api-and-dashboard/query-api-validation.mdx`  | Split          |
| `proper/dashboard-and-hosting.mdx`    | `api-and-dashboard/dashboard-and-hosting.mdx`                                               | Move + rename  |
| `troubleshooting/common-fixes.mdx`    | `troubleshooting/common-fixes.mdx`                                                          | Stays + expand |
| `reference/source-and-links.mdx`      | `reference/teardown-and-cleanup.mdx`                                                        | Move + rework  |
| — (new)                               | `introduction/project-overview.mdx`                                                         | New content    |
| — (new)                               | `security/certificate-provisioning.mdx`                                                     | New content    |
| — (new)                               | `security/policies-and-iam.mdx`                                                             | New content    |
| — (new)                               | `provisioning/cloudformation-bootstrap.mdx`                                                 | New content    |
| — (new)                               | `provisioning/device-provisioning.mdx`                                                      | New content    |
| — (new)                               | `firmware/source-layout.mdx`                                                                | New content    |
| — (new)                               | `firmware/architecture-and-modules.mdx`                                                     | New content    |
| — (new)                               | `firmware/payload-contract.mdx`                                                             | New content    |
| — (new)                               | `firmware/build-configuration.mdx`                                                          | New content    |
| — (new)                               | `reference/payload-quick-reference.mdx`                                                     | New content    |
| — (new)                               | `reference/environment-variables.mdx`                                                       | New content    |

### Sidebar Configuration (Target State)

```javascript
sidebar: [
  { label: "Home", link: "/" },
  {
    label: "Introduction",
    items: [
      { label: "Project Overview", slug: "introduction/project-overview" },
    ],
  },
  {
    label: "Prerequisites",
    items: [
      {
        label: "Hardware and Software Requirements",
        slug: "prerequisites/hardware-and-software-requirements",
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        label: "Certificate Provisioning",
        slug: "security/certificate-provisioning",
      },
      { label: "Policies and IAM", slug: "security/policies-and-iam" },
    ],
  },
  {
    label: "AWS Provisioning",
    items: [
      {
        label: "CloudFormation Bootstrap",
        slug: "provisioning/cloudformation-bootstrap",
      },
      {
        label: "Device Provisioning",
        slug: "provisioning/device-provisioning",
      },
    ],
  },
  {
    label: "Firmware",
    items: [
      { label: "Source Layout", slug: "firmware/source-layout" },
      {
        label: "Architecture and Modules",
        slug: "firmware/architecture-and-modules",
      },
      { label: "Payload Contract", slug: "firmware/payload-contract" },
      { label: "Build Configuration", slug: "firmware/build-configuration" },
    ],
  },
  {
    label: "Device Setup",
    items: [
      { label: "Linux USB Setup", slug: "device-setup/linux-usb-setup" },
      {
        label: "Build Flash and Monitor",
        slug: "device-setup/build-flash-and-monitor",
      },
    ],
  },
  {
    label: "Cloud Verification",
    items: [
      {
        label: "End-to-End Validation",
        slug: "cloud-verification/end-to-end-validation",
      },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      {
        label: "Stack Source Layout",
        slug: "infrastructure/stack-source-layout",
      },
      { label: "Ingest Pipeline", slug: "infrastructure/ingest-pipeline" },
      {
        label: "Terraform Provisioning",
        slug: "infrastructure/terraform-provisioning",
      },
    ],
  },
  {
    label: "API and Dashboard",
    items: [
      {
        label: "Query API Source Layout",
        slug: "api-and-dashboard/query-api-source-layout",
      },
      {
        label: "Query API Validation",
        slug: "api-and-dashboard/query-api-validation",
      },
      {
        label: "Dashboard Source Layout",
        slug: "api-and-dashboard/dashboard-source-layout",
      },
      {
        label: "Dashboard and Hosting",
        slug: "api-and-dashboard/dashboard-and-hosting",
      },
    ],
  },
  {
    label: "Troubleshooting",
    items: [{ label: "Common Fixes", slug: "troubleshooting/common-fixes" }],
  },
  {
    label: "Future Improvements",
    items: [
      {
        label: "Future Improvements",
        slug: "future-improvements/future-improvements",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        label: "Payload Quick Reference",
        slug: "reference/payload-quick-reference",
      },
      {
        label: "Environment Variables",
        slug: "reference/environment-variables",
      },
      { label: "Teardown and Cleanup", slug: "reference/teardown-and-cleanup" },
    ],
  },
];
```

### Index Page Update

The splash page `hero.actions[0].link` changes from `/pretest/setup-and-prerequisites/` to `/introduction/project-overview/`. The card grid content updates to reflect the three-phase structure described in the Introduction section.

## Error Handling

Since this is a static documentation site restructure, error handling applies at build and validation time:

1. **Missing content file** — If a sidebar slug references a non-existent `.mdx` file, `astro build` fails with a clear error message indicating the missing slug. Fix: ensure file exists at the expected path before building.

2. **Frontmatter validation** — If `title` is missing from frontmatter, Starlight's content collection schema rejects the file. Fix: all new files include `title` and `description` in frontmatter.

3. **Prettier formatting** — If a file has inconsistent formatting, `prettier --check` returns non-zero. Fix: run `prettier --write .` before committing.

4. **Markdownlint violations** — If an `.mdx` file violates rules enabled by the project's `.markdownlint.json`, `markdownlint-cli2` returns non-zero. Fix: correct the reported issues or update the project config intentionally.

5. **Broken internal links** — Links using old paths (`/pretest/...`, `/proper/...`) will 404 after directory removal. Fix: update all internal links in content files and the splash page to new paths.

## Testing Strategy

Property-based testing is **not applicable** to this feature. The restructure involves declarative content files and configuration — there are no pure functions, data transformations, or algorithmic logic to validate with property-based tests. The feature's correctness is verified through build validation and lint tooling.

### Validation Approach

| Check           | Command                                                                         | What it validates                                                                |
| --------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Formatting      | `prettier --check <changed-files>` then `prettier --check .`                    | Changed files are clean during iteration, and final repo-wide style check passes |
| Markdown lint   | `markdownlint-cli2 <changed-mdx-files>` then `markdownlint-cli2 "src/**/*.mdx"` | Changed docs are clean during iteration, and final MDX lint pass succeeds        |
| Build integrity | `astro build`                                                                   | All sidebar slugs resolve, frontmatter valid, no broken imports                  |
| Combined        | `npm run validate`                                                              | Prettier + markdownlint in one pass                                              |

### Manual Review Checklist

1. All 25 content pages render correctly in the sidebar
2. Section order matches Requirement 1 exactly
3. "Get Started" on splash page navigates to Introduction
4. No content from old pages is missing in new pages
5. New Security and Firmware pages contain accurate technical information sourced from `esp32-aws-iot-demo`
6. Internal links between pages resolve correctly
7. Old directories (`pretest/`, `proper/`) are removed with no dangling references
8. All 25 content pages plus splash import `Tooltip` where glossary terms appear; HTML tables used on pages with Tooltip in tables
9. Prerequisites page follows per-tool Ubuntu/Red Hat install layout with cli-tools under each Red Hat subsection

### Execution Order

1. Create new directory structure (all 10 subdirectories)
2. Write new content files (Introduction, Security, Firmware, Reference additions)
3. Migrate existing content to new locations (split and move)
4. Expand Troubleshooting with firmware category
5. Update `astro.config.mjs` sidebar
6. Update `index.mdx` splash page links
7. Remove obsolete directories (`pretest/`, `proper/`)
8. Run `npm run validate` — must pass
9. Run `npm run build` — must pass
10. Wire glossary Tooltip across all content pages and update Kiro specs for glossary + prerequisites install pattern
