# Implementation Plan: AWS IoT Walkthrough

## Overview

The AWS IoT Walkthrough Astro Starlight site uses a 12-section progressive structure: 25 content pages, sidebar configuration in `astro.config.mjs`, and validation via `npm run validate` and `npm run build`. All work is content and configuration — no runtime code is modified.

## Tasks

- [x] 1. Create new directory structure
  - [x] 1.1 Create all 10 section subdirectories under `src/content/docs/`
    - Create directories: `introduction/`, `prerequisites/`, `security/`, `firmware/`, `device-setup/`, `cloud-verification/`, `infrastructure/`, `api-and-dashboard/`, `troubleshooting/` (already exists), `reference/` (already exists)
    - Verify all directories exist after creation
    - _Requirements: 12.1_

- [x] 2. Write new content files — Introduction and Security
  - [x] 2.1 Create `introduction/project-overview.mdx`
    - Include frontmatter with title "Project Overview" and description
    - Describe what the reader builds across all phases (MQTT telemetry, serverless ingest, query API, hosted dashboard)
    - Include a text-based architecture diagram showing data flow: ESP32 → IoT Core → IoT Rules → Lambda → DynamoDB → API Gateway → Amplify
    - List the three walkthrough phases with one-sentence summaries each
    - Source content from Demo_Repo docs (branch or commit selected for this restructure)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.2 Create `security/certificate-provisioning.mdx`
    - Include frontmatter with title "Certificate Provisioning" and description
    - Explain X.509 device certificate generation via `provision.sh`
    - Document TLS 1.2 mutual authentication to AWS IoT Core
    - Describe purpose of each PEM file (device cert, private key, root CA) and the activation step
    - Document credential management: gitignore, per-device cert, owner-read-only permissions, storage outside working tree
    - Note MQTT connections use WiFiClientSecure with QoS 1
    - Source content from Demo_Repo `provision.sh` and `aws/README.md`
    - _Requirements: 4.2, 4.3, 4.7_

  - [x] 2.3 Create `security/policies-and-iam.mdx`
    - Include frontmatter with title "Policies and IAM" and description
    - Document IoT Policy with least-privilege rules: Connect scoped to own ThingName, Publish scoped to own device topics
    - Document IAM Role for IoT Rules with CloudWatch Logs permissions (CreateLogGroup, CreateLogStream, PutLogEvents)
    - Explain architecture prevents direct browser-to-DynamoDB access via API Gateway and Lambda fronting
    - Source content from Demo_Repo `aws/README.md` and Terraform modules
    - _Requirements: 4.4, 4.5, 4.6_

- [x] 3. Write new content files — Firmware section
  - [x] 3.1 Create `firmware/architecture-and-modules.mdx`
    - Include frontmatter with title "Architecture and Modules" and description
    - Describe each firmware module: WiFiManager, NTPSync, MQTTManager, TelemetryPublisher, EventPublisher, StatusLed, WatchdogSupervisor, Logger
    - Include behavior details per module (exponential backoff, 30s timeout, QoS 1, 60s intervals, GPIO0 debounce, blue RGB flash, task WDT, serial tagged output)
    - Source content from Demo_Repo firmware source files
    - _Requirements: 5.2_

  - [x] 3.2 Create `firmware/payload-contract.mdx`
    - Include frontmatter with title "Payload Contract" and description
    - Document telemetry message format: device_id, ts, type=connectivity, rssi, uptime_s, heap_free, chip_temp_c, chip_model, cpu_mhz, flash_bytes, wifi_ssid, wifi_status, wifi_channel, wifi_ip, wifi_gateway, wifi_dns, clock_offset_ms
    - Document event message format: device_id, ts, type=button, event=press
    - Document MQTT topic structure: `devices/{Thing_Name}/telemetry` and `devices/{Thing_Name}/events`
    - Include one complete JSON example per message type with representative values
    - Source content from Demo_Repo `PAYLOAD.md`
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [x] 3.3 Create `firmware/build-configuration.mdx`
    - Include frontmatter with title "Build Configuration" and description
    - Document PlatformIO board config (ESP32-S3-N16R8), framework (Arduino), key dependencies (MQTT, ArduinoJson)
    - Document `generate-headers.sh` script that produces `config.h` and `certs.h` from env vars and provisioned certs
    - Source content from Demo_Repo `platformio.ini` and build scripts
    - _Requirements: 5.7, 5.8_

- [x] 4. Write new content files — Reference additions
  - [x] 4.1 Create `reference/payload-quick-reference.mdx`
    - Include frontmatter with title "Payload Quick Reference" and description
    - Include a table with columns: field name, data type, example value
    - Cover all telemetry and event fields referenced in the walkthrough
    - _Requirements: 11.2_

  - [x] 4.2 Create `reference/environment-variables.mdx`
    - Include frontmatter with title "Environment Variables" and description
    - List all env vars: WIFI_SSID, WIFI_PASSWORD, THING_NAME, AWS_REGION, API_URL, VITE_API_URL, AMPLIFY_APP_ID, AMPLIFY_BRANCH, TELEMETRY_TABLE, EVENTS_TABLE
    - Include purpose and walkthrough page where each is first set
    - Note TELEMETRY_TABLE and EVENTS_TABLE are derived from Terraform outputs
    - _Requirements: 11.3_

- [x] 5. Checkpoint - Validate new content files
  - Ensure all new files have valid frontmatter and pass formatter/lint checks on changed files first, then full project checks before final validation.

- [x] 6. Migrate existing content to new locations
  - [x] 6.1 Split `pretest/setup-and-prerequisites.mdx` into `prerequisites/hardware-and-software-requirements.mdx` and `device-setup/linux-usb-setup.mdx`
    - Move hardware/software requirements, AWS account requirements, and env var exports to `prerequisites/hardware-and-software-requirements.mdx`
    - Move Linux USB setup commands and verification steps to `device-setup/linux-usb-setup.mdx`
    - Ensure no content is lost during split
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.1, 6.2_

  - [x] 6.2 Move `pretest/flash-and-monitor.mdx` to `device-setup/build-flash-and-monitor.mdx`
    - Update frontmatter title to "Build Flash and Monitor"
    - Retain PlatformIO build/upload/monitor commands with `esp32-s3-n16r8` env flag
    - Retain BOOT+RST fallback, expected serial markers, and LED behavior documentation
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [x] 6.3 Move `pretest/cloud-verification.mdx` to `cloud-verification/end-to-end-validation.mdx`
    - Update frontmatter title to "End-to-End Validation"
    - Retain CloudWatch tail commands, diagnostic commands, and Phase 1 pass criteria
    - Ensure all log group names and IoT rule names are preserved
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 6.4 Split `proper/infrastructure-and-api.mdx` into `infrastructure/terraform-provisioning.mdx` and `api-and-dashboard/query-api-validation.mdx`
    - Move Terraform init/plan/apply/output commands and DynamoDB scan commands to `infrastructure/terraform-provisioning.mdx`
    - Move API curl commands and endpoint testing to `api-and-dashboard/query-api-validation.mdx`
    - Include Terraform outputs list and module summary in infrastructure page
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2_

  - [x] 6.5 Move `proper/dashboard-and-hosting.mdx` to `api-and-dashboard/dashboard-and-hosting.mdx`
    - Update frontmatter title to "Dashboard and Hosting"
    - Retain local run procedure, Amplify deploy procedure, and rollout checklist
    - Ensure rollout checklist has exactly 5 items per Requirement 9.5
    - _Requirements: 9.3, 9.4, 9.5_

  - [x] 6.6 Rework `reference/source-and-links.mdx` into `reference/teardown-and-cleanup.mdx`
    - Update frontmatter title to "Teardown and Cleanup"
    - Present teardown in reverse-provisioning order: Amplify/API Gateway cleanup → terraform destroy → device deprovisioning
    - Include links to source repo and supporting docs (PAYLOAD.md, ARCHITECTURE.md, aws/README.md, terraform/README.md)
    - _Requirements: 11.4, 11.5_

- [x] 7. Expand Troubleshooting with firmware category
  - [x] 7.1 Update `troubleshooting/common-fixes.mdx` with Firmware Issues category
    - Add "Firmware Issues" category with entries for: Wi-Fi reconnect loops, MQTT disconnect after NTP failure, watchdog reset triggers
    - Ensure all categories (USB/Permissions, Upload Failures, Serial Runtime, Cloud Verification, Firmware Issues) have at least 2 problem entries each
    - Ensure each problem heading is the exact error message or symptom, followed by numbered/bulleted fix steps with commands in code blocks
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 8. Checkpoint - Validate migrated content
  - Ensure all migrated and updated files pass formatter/lint checks on changed files first, then full project checks before final validation.

- [x] 9. Update sidebar configuration
  - [x] 9.1 Rewrite the `sidebar` array in `astro.config.mjs` to the 10-section structure
    - Replace existing sidebar with: Home link, then 10 groups (Introduction, Prerequisites, Security, Firmware, Device Setup, Cloud Verification, Infrastructure, API and Dashboard, Troubleshooting, Reference)
    - Use slug format matching filesystem paths for all 17 content pages
    - Retain Home link as first entry with `link: "/"`
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 14.1, 14.2, 14.3, 14.4_

- [x] 10. Update splash page
  - [x] 10.1 Update `src/content/docs/index.mdx` hero link and card content
    - Change "Get Started" link from `/pretest/setup-and-prerequisites/` to `/introduction/project-overview/`
    - Update card grid content to reflect three-phase structure
    - Retain splash template, hero tagline style, and GitHub link
    - _Requirements: 1.3, 1.4_

- [x] 11. Remove obsolete directories
  - [x] 11.1 Delete `src/content/docs/pretest/` directory and all files within
    - Confirm all content has been migrated before deletion
    - _Requirements: 12.2_

  - [x] 11.2 Delete `src/content/docs/proper/` directory and all files within
    - Confirm all content has been migrated before deletion
    - _Requirements: 12.2_

  - [x] 11.3 Delete obsolete `reference/source-and-links.mdx` (replaced by `teardown-and-cleanup.mdx`)
    - Only if the file was not already removed/renamed during migration step 6.6
    - _Requirements: 12.2_

- [x] 12. Final validation
  - [x] 12.1 Run `npm run validate` and fix any issues
    - Execute `npm run validate` (prettier + markdownlint)
    - Fix any formatting or linting errors reported
    - Re-run until exit code 0
    - _Requirements: 13.1, 13.2, 13.4_

  - [x] 12.2 Run `npm run build` and fix any issues
    - Execute `npm run build` (astro build)
    - Verify all sidebar slugs resolve to existing content files
    - Fix any build errors (missing files, invalid frontmatter, broken imports)
    - Re-run until exit code 0
    - _Requirements: 13.3, 14.5_

- [x] 13. Prerequisites software install layout
  - [x] 13.1 Rewrite `prerequisites/hardware-and-software-requirements.mdx` software section with HTML summary table, per-tool `###` sections, Ubuntu and Red Hat manual steps, cli-tools curl one-liner under each tool's Red Hat subsection, combined verify block, and Aside tip for Node.js 22 / PATH / idempotency
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 14. Glossary and Tooltip wiring
  - [x] 14.1 Create `src/data/glossary.ts` and `src/components/Tooltip.astro`
  - [x] 14.2 Add `.kiro/steering/glossary.md` and document pattern in `AGENTS.md` / `.kiro/steering/docs-pattern.md`
  - [x] 14.3 Wire `Tooltip` across all 20 content pages plus splash `index.mdx`; use HTML tables where tables contain tooltips
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 15. Update Kiro specs for glossary and prerequisites install
  - [x] 15.1 Update `requirements.md` with Requirement 15 (glossary) and expanded Requirement 3 (install layout)
  - [x] 15.2 Update `design.md` with glossary/tooltip and prerequisites install components
  - [x] 15.3 Update `tasks.md` with tasks 13–15 and mark completed work

- [x] 16. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Firmware source layout page
  - [x] 17.1 Create `firmware/source-layout.mdx` with directory tree, `main.cpp` entry flow, HTML file-purpose table, and link to demo repo `main` branch
  - [x] 17.2 Add `firmware/source-layout` as first Firmware sidebar item in `astro.config.mjs`
  - [x] 17.3 Cross-link architecture, payload-contract, and build-configuration pages; pin lib versions in build-configuration
  - [x] 17.4 Update Kiro specs for fourth firmware page (18 total content pages)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.12, 5.13, 5.14_

- [x] 18. AWS Provisioning section
  - [x] 18.1 Create `provisioning/cloudformation-bootstrap.mdx` and `provisioning/device-provisioning.mdx`
  - [x] 18.2 Refactor `security/certificate-provisioning.mdx` to concepts-only; cross-link policies-and-iam to bootstrap
  - [x] 18.3 Add AWS Provisioning sidebar group in `astro.config.mjs`; update project-overview Phase 1 list and cross-links
  - [x] 18.4 Add `phase1-stack` glossary term; update Kiro specs for 11th section (20 content pages)
    - _Requirements: 5.1–5.7_

- [x] 19. Backend and dashboard source layout pages
  - [x] 19.1 Create `infrastructure/stack-source-layout.mdx` and `infrastructure/ingest-pipeline.mdx`
  - [x] 19.2 Create `api-and-dashboard/query-api-source-layout.mdx` and `api-and-dashboard/dashboard-source-layout.mdx`
  - [x] 19.3 Update sidebar, project-overview Phase 2/3 lists, and cross-links on ops pages
  - [x] 19.4 Update Kiro specs for 24 content pages
    - _Requirements: 9.1–9.8, 10.1–10.8_

- [x] 20. Future Improvements section
  - [x] 20.1 Create `future-improvements/future-improvements.mdx` with terse roadmap bullets
  - [x] 20.2 Add Future Improvements sidebar group before Reference; cross-link from project-overview
  - [x] 20.3 Update Kiro specs for 12 sections and 25 content pages

## Notes

- No property-based tests are applicable — this is a declarative content restructure with no algorithmic logic
- Source material for new content (Security, Firmware, Reference) comes from `esp32-aws-iot-demo` at the branch or commit selected for this restructure
- Existing content in `pretest/` and `proper/` directories must be fully migrated before those directories are deleted
- The `troubleshooting/common-fixes.mdx` file stays in place but is expanded with a new Firmware Issues category
- The `reference/` directory already exists; new files are added alongside or replacing existing ones
- All 25 content pages must be present and referenced in the sidebar for `astro build` to succeed
- Checkpoints at tasks 5 and 8 catch formatting/lint issues early before the final validation pass
- Glossary pages that include tables must use HTML `<table>` markup, not markdown pipe tables
- cli-tools install one-liners belong under each tool's Red Hat subsection, not in a shared block at page end

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    {
      "id": 1,
      "tasks": ["2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "4.1", "4.2"]
    },
    { "id": 2, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "7.1"] },
    { "id": 3, "tasks": ["9.1", "10.1"] },
    { "id": 4, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 5, "tasks": ["12.1"] },
    { "id": 6, "tasks": ["12.2"] },
    {
      "id": 7,
      "tasks": ["13.1", "14.1", "14.2", "14.3", "15.1", "15.2", "15.3"]
    },
    { "id": 8, "tasks": ["16"] },
    { "id": 9, "tasks": ["17.1", "17.2", "17.3", "17.4"] },
    { "id": 10, "tasks": ["18.1", "18.2", "18.3", "18.4"] },
    { "id": 11, "tasks": ["19.1", "19.2", "19.3", "19.4"] }
  ]
}
```
