# AWS IoT Walkthrough

Dedicated documentation site for the
[esp32-aws-iot-demo](https://github.com/jajera/esp32-aws-iot-demo) project.

This repository publishes walkthrough content that was originally maintained in a
single file:
[`docs/WALKTHROUGH.md`](https://github.com/jajera/esp32-aws-iot-demo/blob/main/docs/WALKTHROUGH.md).

## What this repo is

Content is organized into progressive sidebar sections:

| Phase             | Sections                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Phase 1 (pretest) | Introduction, Prerequisites, Security, AWS Provisioning, Firmware, Device Setup, Cloud Verification |
| Phase 2           | Infrastructure                                                                                      |
| Phase 3           | API and Dashboard                                                                                   |
| Cross-cutting     | Troubleshooting, Future Improvements, Reference                                                     |

## Prerequisites

- [Node.js](https://nodejs.org/) 22 (see `.nvmrc`)
- npm

## Local development

```bash
npm ci
npm run dev
```

Open the URL printed by Astro (typically `http://localhost:4321/aws-iot-walkthrough/`).

## Scripts

| Script             | Purpose                        |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start local development server |
| `npm run build`    | Production build to `dist/`    |
| `npm run preview`  | Serve production build locally |
| `npm run validate` | Prettier check + markdown lint |
| `npm run format`   | Auto-format repository files   |
| `npm run lint`     | Lint MDX docs under `src/`     |

## Content source

Primary source:

- [`esp32-aws-iot-demo/docs/WALKTHROUGH.md`](https://github.com/jajera/esp32-aws-iot-demo/blob/main/docs/WALKTHROUGH.md)

Supporting sources:

- [`docs/PAYLOAD.md`](https://github.com/jajera/esp32-aws-iot-demo/blob/main/docs/PAYLOAD.md)
- [`docs/ARCHITECTURE.md`](https://github.com/jajera/esp32-aws-iot-demo/blob/main/docs/ARCHITECTURE.md)
- [`aws/README.md`](https://github.com/jajera/esp32-aws-iot-demo/blob/main/aws/README.md)
