# Requirements Document: AWS IoT Walkthrough

## Introduction

This specification defines the AWS IoT Walkthrough documentation site — a 12-section progressive structure covering device provisioning, firmware, cloud verification, infrastructure, API, dashboard, and reference material for the `esp32-aws-iot-demo` project.

The site retains operational walkthrough content while covering security posture, firmware architecture, and payload contracts. Content files are `.mdx` in `src/content/docs/`, the sidebar is configured in `astro.config.mjs`, and the site must pass `prettier --check` and `markdownlint-cli2` validation.

This specification covers documentation structure and content quality only. It does not require changing runtime behavior in the demo firmware or Terraform modules.

## Glossary

- **Site**: The Astro Starlight documentation site at `https://jajera.github.io/aws-iot-walkthrough/`
- **Sidebar**: The navigation structure defined in the `sidebar` array of `astro.config.mjs`
- **Content_File**: A `.mdx` file located under `src/content/docs/` that represents one documentation page
- **Section**: A top-level sidebar group containing one or more Content_Files
- **Demo_Repo**: The source repository `esp32-aws-iot-demo` from which walkthrough commands are run
- **Firmware**: The PlatformIO-based ESP32 application code in the Demo_Repo `firmware/` directory
- **IoT_Policy**: An AWS IoT Core policy document that controls device MQTT permissions
- **Payload_Contract**: The JSON schema and field definitions for telemetry and event MQTT messages
- **Phase1_Stack**: The CloudFormation stack `esp32-demo-phase1` deployed by `provision-infra.sh` for Phase 1 IoT rules and CloudWatch log groups
- **Pretest**: The Phase 1 verification flow that proves device-to-cloud connectivity before full infrastructure deployment (includes AWS Provisioning through Cloud Verification)
- **Terraform_Stack**: The Terraform modules in the Demo_Repo that provision IoT rules, Lambda, DynamoDB, API Gateway, and Amplify

## Requirements

### Requirement 1: Sidebar Structure

**User Story:** As a reader, I want the documentation organized into logical progressive sections, so that I can follow the walkthrough in a natural order without mixed concerns.

#### Acceptance Criteria - Sidebar Structure

1. THE Site SHALL present exactly 12 top-level Sections in the Sidebar in this fixed order: Introduction, Prerequisites, Security, AWS Provisioning, Firmware, Device Setup, Cloud Verification, Infrastructure, API and Dashboard, Troubleshooting, Future Improvements, Reference
2. WHEN the Site is built, THE Sidebar SHALL render each of the 12 Sections as a collapsible group containing its child Content_Files
3. THE Site SHALL preserve the Home splash page as the landing page, linked as a non-collapsible entry positioned before the first Section in the Sidebar
4. WHEN a reader navigates to the Site without specifying a path, THE Site SHALL display the Home splash page rather than the first Section
5. THE Sidebar labels SHALL exactly match the Section names listed in Acceptance Criterion 1

### Requirement 2: Introduction Section

**User Story:** As a reader, I want a dedicated introduction page, so that I understand the project scope, architecture, and data flow before starting hands-on steps.

#### Acceptance Criteria - Introduction Section

1. THE Site SHALL include an Introduction Section in the sidebar navigation, positioned before the Prerequisites section, containing a single Content_File titled "Project Overview"
2. THE Project Overview page SHALL describe what the reader will build across all phases, listing each deliverable: device telemetry via MQTT, serverless ingest pipeline, query API, and hosted dashboard
3. THE Project Overview page SHALL include an architecture diagram rendered as a text-based code block showing the directional data flow from ESP32 through IoT Core, IoT Rules, Lambda, DynamoDB, API Gateway, and Amplify, with arrows or connectors indicating flow direction between each component
4. THE Project Overview page SHALL list the three walkthrough phases in order: Phase 1: Zero to First Message, Phase 2: Serverless Ingest, Phase 3: API and Dashboard, each with a one-sentence summary of its goal

### Requirement 3: Prerequisites Section

**User Story:** As a reader, I want a clear list of everything I need before starting, so that I can prepare my environment without surprises mid-walkthrough.

#### Acceptance Criteria - Prerequisites Section

1. THE Site SHALL include a Prerequisites Section containing a single Content_File titled "Hardware and Software Requirements"
2. THE Prerequisites page SHALL list hardware requirements including board model (ESP32-S3-N16R8), USB data cable with explicit note that charge-only cables are insufficient, and a 2.4 GHz Wi-Fi network with credentials available for the board
3. THE Prerequisites page SHALL list software requirements including PlatformIO CLI, AWS CLI v2, Terraform, Node.js, and Git
4. THE Prerequisites page SHALL present software requirements using an HTML summary table (not a markdown pipe table) with columns for tool name, verify command, and walkthrough usage, because pages that import the Tooltip component cannot use markdown pipe tables
5. THE Prerequisites page SHALL document manual installation steps for each required tool (Git, AWS CLI v2, Terraform, PlatformIO, Node.js 22) as a dedicated `###` subsection per tool, each containing an `####` Ubuntu subsection and an `####` Red Hat subsection with copy-paste bash commands
6. WHEN documenting Red Hat family installs, THE Prerequisites page SHALL include an optional jdevto/cli-tools curl one-liner under that tool's Red Hat subsection (not grouped in a single shared section at the end of the page)
7. THE Prerequisites page SHALL include a combined toolchain verification block after the per-tool install sections with verify commands for all required tools
8. THE Prerequisites page SHALL include an Aside tip noting Node.js 22 (`.nvmrc`), PATH updates after install, and idempotent re-runs of install commands
9. THE Prerequisites page SHALL list AWS account requirements including IAM permissions for IoT, IAM, CloudFormation, CloudWatch Logs, Lambda, DynamoDB, API Gateway, and Amplify
10. THE Prerequisites page SHALL include bash environment variable export commands for WIFI_SSID, WIFI_PASSWORD, THING_NAME, and AWS_REGION, each shown with a placeholder value that the reader replaces with their own configuration
11. WHEN the reader has a Linux host, THE Prerequisites page SHALL include a one-time USB setup section with the command to run the setup script and verification steps to confirm port access

### Requirement 4: Security Section

**User Story:** As a reader, I want a dedicated security section, so that I understand the trust model, certificate lifecycle, and least-privilege policies before provisioning devices.

#### Acceptance Criteria - Security Section

1. THE Site SHALL include a Security Section containing two Content_Files: "Certificate Provisioning" and "Policies and IAM"
2. THE Certificate Provisioning page SHALL explain TLS 1.2 mutual authentication to AWS IoT Core, the purpose of each PEM file (device cert, private key, root CA), and credential management practices; operational provisioning commands SHALL be documented in the AWS Provisioning section instead
3. THE Certificate Provisioning page SHALL document credential management practices including gitignore of PEM files, per-device certificate generation, restriction of PEM file permissions to owner-read-only, and storage of PEM files outside the repository working tree
4. THE Policies and IAM page SHALL document the IoT Policy with least-privilege rules: Connect scoped to own ThingName, Publish scoped to own device topics only
5. THE Policies and IAM page SHALL document the IAM Role used by IoT Rules with permissions restricted to CloudWatch Logs write access, including at minimum `logs:CreateLogGroup`, `logs:CreateLogStream`, and `logs:PutLogEvents`, and SHALL note the role is created by the Phase1_Stack CloudFormation bootstrap
6. THE Policies and IAM page SHALL explain that the architecture prevents direct browser-to-DynamoDB access by fronting data through API Gateway and Lambda
7. WHEN describing TLS configuration, THE Certificate Provisioning page SHALL note that MQTT connections use WiFiClientSecure with QoS 1

### Requirement 5: AWS Provisioning Section

**User Story:** As a reader, I want dedicated AWS provisioning steps for Phase 1 bootstrap and device registration, so that I deploy CloudFormation shared infra and device credentials before flashing firmware.

#### Acceptance Criteria - AWS Provisioning Section

1. THE Site SHALL include an AWS Provisioning Section containing two Content_Files: "CloudFormation Bootstrap" and "Device Provisioning", positioned after Security and before Firmware
2. THE CloudFormation Bootstrap page SHALL document `./aws/provision-infra.sh`, stack name `esp32-demo-phase1`, template path `aws/cloudformation/phase1-infra.yaml`, and resources created: CloudWatch log groups `/aws/iot/esp32-demo/telemetry`, `/events`, `/errors`, IoT rules `esp32_demo_telemetry_rule` and `esp32_demo_events_rule`, and IAM role for rule delivery
3. THE CloudFormation Bootstrap page SHALL include verify commands for stack status and IoT rule disabled state
4. THE CloudFormation Bootstrap page SHALL distinguish Phase 1 CloudFormation bootstrap from Phase 2 Terraform provisioning
5. THE Device Provisioning page SHALL document the full `./aws/provision.sh` flow (infra then device), optional `./aws/provision-device.sh`, and `./scripts/generate-headers.sh` with required environment variables
6. THE Device Provisioning page SHALL document outputs: PEM files in `firmware/certs/`, printed `AWS_IOT_ENDPOINT`, and generated `config.h` / `certs.h`
7. THE Device Provisioning page SHALL cross-link to Certificate Provisioning for PEM practices and warn against re-running device provisioning on an already-provisioned Thing

### Requirement 6: Firmware Section

**User Story:** As a reader, I want a dedicated firmware section, so that I understand how the ESP32 code is structured, what each module does, and the payload format before flashing.

#### Acceptance Criteria - Firmware Section

1. THE Site SHALL include a Firmware Section containing four Content_Files: "Source Layout", "Architecture and Modules", "Payload Contract", and "Build Configuration"
2. THE Source Layout page SHALL link to the Demo_Repo `firmware/` directory on the `main` branch and present a condensed directory tree covering `platformio.ini`, `include/`, `src/`, and `test/`
3. THE Source Layout page SHALL document `main.cpp` entry-point responsibilities including compile-time header guards, `setup()` initialization order, and `loop()` tick order
4. THE Source Layout page SHALL include an HTML file-purpose table mapping each operational source file to its role and primary consumer
5. THE Source Layout page SHALL distinguish committed template files (`*.example.h`, `src/`, `platformio.ini`) from generated local files (`config.h`, `certs.h`, PEM material)
6. THE Architecture and Modules page SHALL describe each firmware module: WiFiManager (exponential backoff reconnect), NTPSync (30-second timeout with ts=0 fallback), MQTTManager (TLS MQTT QoS 1), TelemetryPublisher (publishes connectivity payload every 60 seconds), EventPublisher (GPIO0 debounced button press), StatusLed (blue RGB flash on publish), WatchdogSupervisor (task WDT and connectivity timeout reset), and Logger (serial tagged output)
7. THE Architecture and Modules page SHALL cross-link to the Source Layout page for file paths and `main.cpp` flow
8. THE Payload Contract page SHALL document the telemetry message format including fields: device_id (string), ts (integer epoch seconds), type=connectivity, rssi (integer dBm), uptime_s (integer seconds), heap_free (integer bytes), chip_temp_c (number Celsius), chip_model (string), cpu_mhz (integer), flash_bytes (integer), wifi_ssid (string), wifi_status (integer), wifi_channel (integer), wifi_ip (string), wifi_gateway (string), wifi_dns (string), and clock_offset_ms (integer)
9. THE Payload Contract page SHALL document the event message format including fields: device_id (string), ts (integer epoch seconds), type=button, and event=press
10. THE Payload Contract page SHALL document MQTT topic structure for both telemetry and event message types, specifying the topic pattern: `devices/{Thing_Name}/telemetry` and `devices/{Thing_Name}/events`
11. THE Payload Contract page SHALL include one complete JSON example per message type showing all documented fields populated with representative values
12. THE Payload Contract page SHALL reference `firmware/src/payload_codec.h` and the Demo_Repo `PAYLOAD.md` as implementation and canonical contract sources
13. THE Build Configuration page SHALL document the PlatformIO board configuration (ESP32-S3-N16R8), framework (Arduino), and key dependencies with pinned versions from the Demo_Repo (`256dpi/MQTT @ ^2.5.3`, `bblanchon/ArduinoJson @ ^7.0.0`)
14. THE Build Configuration page SHALL document the `generate-headers.sh` script that produces `config.h` and `certs.h` from environment variables and provisioned certificates

### Requirement 7: Device Setup Section

**User Story:** As a reader, I want step-by-step instructions for preparing my Linux host, building firmware, and flashing the board, so that I can get serial output confirmed before moving to cloud steps.

#### Acceptance Criteria - Device Setup Section

1. THE Site SHALL include a Device Setup Section containing two Content_Files: "Linux USB Setup" and "Build Flash and Monitor"
2. THE Linux USB Setup page SHALL include the `setup-linux-usb.sh` command, logout/reboot requirement, and verification commands (`groups`, `lsusb`, `ls /dev/ttyACM*`)
3. THE Build Flash and Monitor page SHALL include PlatformIO build, upload, and monitor commands with the correct environment flag (`esp32-s3-n16r8`)
4. THE Build Flash and Monitor page SHALL document the BOOT+RST fallback sequence for first-upload connection issues
5. THE Build Flash and Monitor page SHALL list expected serial output markers: `[wifi] connected`, `[mqtt] connected`, `[telemetry] published`, and `[event] published`
6. THE Build Flash and Monitor page SHALL describe LED behavior: blue RGB flash on successful publish, and GPIO48 vs PIN_NEOPIXEL=38 board variant note

### Requirement 8: Cloud Verification Section

**User Story:** As a reader, I want to verify that device messages reach AWS before building full infrastructure, so that I can confirm Phase 1 is working end-to-end.

#### Acceptance Criteria - Cloud Verification Section

1. THE Site SHALL include a Cloud Verification Section containing a single Content_File titled "End-to-End Validation"
2. THE End-to-End Validation page SHALL include commands to tail CloudWatch log groups `/aws/iot/esp32-demo/telemetry` and `/aws/iot/esp32-demo/events` in real-time follow mode, and commands to query recent log entries from the same log groups within a specified time window
3. THE End-to-End Validation page SHALL include diagnostic commands for verifying the AWS_REGION variable is set, tailing the error log group `/aws/iot/esp32-demo/errors`, and checking IoT rule disabled status for rules `esp32_demo_telemetry_rule` and `esp32_demo_events_rule`
4. THE End-to-End Validation page SHALL define explicit Phase 1 pass criteria: upload succeeds with ESP32-S3 detection and verified hash, device serial shows telemetry publishes, BOOT button press emits an event publish, and CloudWatch receives both telemetry messages containing fields device_id, ts, and type=connectivity, and event messages containing fields device_id, ts, type=button, and event=press
5. THE End-to-End Validation page SHALL describe expected CloudWatch log content for each message type: telemetry JSON including device_id, ts, type, and metric values, and event JSON including device_id, ts, type=button, and event=press

### Requirement 9: Infrastructure Section

**User Story:** As a reader, I want to provision the full serverless stack and validate data persistence, so that I can move from Phase 1 to Phase 2 with confidence.

#### Acceptance Criteria - Infrastructure Section

1. THE Site SHALL include an Infrastructure Section containing three Content_Files: "Stack Source Layout", "Ingest Pipeline", and "Terraform Provisioning"
2. THE Stack Source Layout page SHALL link to the Demo_Repo `terraform/` directory, present a module tree, document `main.tf` composition order, and include an HTML table mapping each Terraform module to purpose and key outputs
3. THE Stack Source Layout page SHALL document processor and query Lambda handler paths under `terraform/modules/lambda_processor/src/` and `terraform/modules/lambda_query_api/src/`
4. THE Ingest Pipeline page SHALL document the data flow from IoT rules through the processor Lambda to DynamoDB, including payload validation, `effective_ts` / `ts_fallback_used` behavior, and table/GSI design
5. THE Terraform Provisioning page SHALL include code blocks for copying tfvars from example, running `terraform init`, `terraform plan`, `terraform apply`, and capturing outputs via `terraform output`
6. THE Terraform Provisioning page SHALL list these Terraform outputs by name: `query_api_invoke_url`, `telemetry_table_name`, `events_table_name`, and `amplify_app_url`
7. THE Terraform Provisioning page SHALL include DynamoDB scan commands for both the telemetry and events tables, each with a `--max-items` flag, so a tester can confirm at least one item is returned per table
8. THE Terraform Provisioning page SHALL cross-link to Stack Source Layout and Ingest Pipeline for code-oriented readers

### Requirement 10: API and Dashboard Section

**User Story:** As a reader, I want to validate the query API and deploy the hosted dashboard, so that I can complete Phase 3 with a working end-user interface.

#### Acceptance Criteria - API and Dashboard Section

1. THE Site SHALL include an API and Dashboard Section containing four Content_Files: "Query API Source Layout", "Query API Validation", "Dashboard Source Layout", and "Dashboard and Hosting"
2. THE Query API Source Layout page SHALL document the query Lambda handler path, HTTP routes (`/devices/{deviceId}/telemetry/latest` and `/devices/{deviceId}/events`), response shapes, and HTTP status codes including 404 for unknown devices
3. THE Query API Validation page SHALL include curl command examples that test the telemetry and events endpoints, specifying expected HTTP 200 status for an existing device and HTTP 404 status for an unknown device ID
4. THE Dashboard Source Layout page SHALL link to the Demo_Repo `web/` directory, present the source tree, document `main.js` entry behavior (VITE_API_URL, parallel fetch, polling), and list supporting modules (`format.js`, `charts.js`, `theme.js`)
5. THE Dashboard and Hosting page SHALL include a local run procedure containing: dependency installation command (`npm ci`), the `VITE_API_URL` environment variable set from Terraform output, the Vite dev server start command, and at least one verification step confirming the dashboard renders device data
6. THE Dashboard and Hosting page SHALL include an Amplify deploy procedure containing: required environment variables (`API_URL`, `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH`, `VITE_API_URL`), invocation of the `deploy-amplify.sh` script, and a command to retrieve the hosted URL from Terraform output
7. THE Dashboard and Hosting page SHALL include a rollout checklist containing exactly 5 items: device publishes telemetry and events, cloud logs receive payloads, API returns latest telemetry and recent events, dashboard renders live API data, and browser does not access DynamoDB directly
8. THE Query API Validation and Dashboard and Hosting pages SHALL cross-link to their respective source layout pages

### Requirement 11: Troubleshooting Section

**User Story:** As a reader, I want troubleshooting guidance organized by failure category, so that I can quickly find the fix for the specific problem I encounter.

#### Acceptance Criteria - Troubleshooting Section

1. THE Site SHALL include a Troubleshooting Section containing a single Content_File titled "Common Fixes"
2. THE Common Fixes page SHALL organize problems into categories: USB and Permissions, Upload Failures, Serial Runtime, Cloud Verification, and Firmware Issues, with each category containing at least 2 problem entries
3. WHEN presenting a problem, THE Common Fixes page SHALL display the problem heading as the exact error message text or observable symptom description, followed by a numbered or bulleted list of 1 to 6 fix steps where each step contains a concrete user action or command
4. THE Common Fixes page SHALL include a Firmware Issues category covering scenarios: Wi-Fi reconnect loops, MQTT disconnect after NTP failure, and watchdog reset triggers
5. WHEN a fix involves running a command, THE Common Fixes page SHALL present the command in a code-formatted block

### Requirement 12: Reference Section

**User Story:** As a reader, I want a reference section for quick lookups and teardown procedures, so that I can find information without re-reading the full walkthrough.

#### Acceptance Criteria - Reference Section

1. THE Site SHALL include a Reference Section containing three Content_Files: "Payload Quick Reference", "Environment Variables", and "Teardown and Cleanup"
2. THE Payload Quick Reference page SHALL include a table with columns for field name, data type, and example value, covering at minimum all telemetry and event fields referenced in the walkthrough
3. THE Environment Variables page SHALL list every environment variable used across the walkthrough (at minimum: `WIFI_SSID`, `WIFI_PASSWORD`, `THING_NAME`, `AWS_REGION`, `API_URL`, `VITE_API_URL`, `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH`, `TELEMETRY_TABLE`, `EVENTS_TABLE`) with its purpose and the walkthrough page where it is first set, and SHALL note that `TELEMETRY_TABLE` and `EVENTS_TABLE` are runtime shell variables derived from Terraform outputs `telemetry_table_name` and `events_table_name`
4. THE Teardown and Cleanup page SHALL present teardown steps in reverse-provisioning order: Amplify and API Gateway cleanup first, then `terraform -chdir=terraform destroy`, then device deprovisioning via `deprovision.sh`
5. THE Teardown and Cleanup page SHALL include a link to the source repository and links to each supporting documentation file referenced in the walkthrough (PAYLOAD.md, ARCHITECTURE.md, aws/README.md, terraform/README.md)

### Requirement 13: Content File Organization

**User Story:** As a maintainer, I want content files organized in subdirectories matching section names, so that the file system mirrors the sidebar structure.

#### Acceptance Criteria - Content File Organization

1. THE Site SHALL store Content_Files in subdirectories under `src/content/docs/` where each subdirectory name exactly matches its Section slug (introduction, prerequisites, security, provisioning, firmware, device-setup, cloud-verification, infrastructure, api-and-dashboard, troubleshooting, future-improvements, reference) and each Content_File resides at exactly one level of nesting below its section subdirectory
2. WHEN restructuring content, THE Site SHALL remove obsolete directories (`pretest/`, `proper/`) only after all Content_Files from those directories have been moved to their new section subdirectories with no content loss, and no references to the obsolete directory paths remain in the sidebar configuration
3. THE Site SHALL use kebab-case filenames for all Content_Files
4. THE Site SHALL store the root index page (`index.mdx`) directly in `src/content/docs/` without placing it inside any section subdirectory

### Requirement 14: Validation Compliance

**User Story:** As a maintainer, I want all content files to pass existing linting and formatting checks, so that CI validation continues to pass after restructuring.

#### Acceptance Criteria - Validation Compliance

1. WHEN any file within the `src/` directory is created or modified, THEN running `prettier --check` against the changed files (with project `.prettierrc` and `.prettierignore`) SHALL return exit code 0
2. WHEN any `.mdx` file matching the glob `src/**/*.mdx` is created or modified, THEN running `markdownlint-cli2` against the changed files (with project `.markdownlint.json`) SHALL return exit code 0
3. WHEN all restructuring changes are applied, THE Site SHALL produce exit code 0 when built using `astro build` with no error-level diagnostic output
4. WHEN the `npm run validate` script is executed after restructuring, THE script SHALL produce exit code 0 confirming both prettier and markdownlint checks pass in a single invocation

### Requirement 15: Sidebar Configuration Update

**User Story:** As a maintainer, I want the `astro.config.mjs` sidebar array to reflect the 12-section structure, so that navigation matches the content reorganization.

#### Acceptance Criteria - Sidebar Configuration Update

1. WHEN the restructuring is complete, THE `astro.config.mjs` file SHALL define the sidebar with exactly 12 Section groups in this order: Introduction, Prerequisites, Security, AWS Provisioning, Firmware, Device Setup, Cloud Verification, Infrastructure, API and Dashboard, Troubleshooting, Future Improvements, Reference
2. THE sidebar configuration SHALL reference each Content_File using the slug format `{section-subdirectory}/{filename-without-extension}` where the subdirectory and filename match the paths defined in Requirement 12
3. THE sidebar configuration SHALL retain the Home link as the first entry before the Section groups, using a link value of `/`
4. THE sidebar configuration SHALL define each Section group as a Starlight sidebar group with an `items` array containing one entry per Content_File specified for that Section in Requirements 2 through 12, totalling 25 Content_File entries across all groups
5. IF a slug in the sidebar configuration does not correspond to an existing Content_File, THEN THE Site SHALL fail the `astro build` step with a build error

### Requirement 16: Glossary and Tooltip UX

**User Story:** As a reader, I want inline glossary tooltips on technical terms, so that I can learn AWS and firmware vocabulary without leaving the walkthrough.

#### Acceptance Criteria - Glossary and Tooltip UX

1. THE Site SHALL maintain a centralized glossary in `src/data/glossary.ts` as a `Record<string, string>` with lowercase kebab-case keys and one- to two-sentence definitions
2. THE Site SHALL provide a reusable `Tooltip.astro` component that renders a popover definition from the glossary by `term` key, with an optional `label` override for display text
3. WHEN a Content_File references glossary terms, THE Content_File SHALL import `Tooltip` from `@/components/Tooltip.astro` and use `<Tooltip term="key" />` or `<Tooltip term="key" label="Display" />` on the first meaningful occurrence of each term per section
4. THE Site SHALL wire glossary tooltips across all walkthrough Content_Files under `src/content/docs/` (25 content pages plus the splash `index.mdx`)
5. WHEN a Content_File imports `Tooltip` and includes a table with glossary terms, THE table SHALL be authored as an HTML `<table>` element rather than a markdown pipe table
6. THE Site SHALL document glossary conventions in `.kiro/steering/glossary.md` and reference the pattern in `AGENTS.md` or `.kiro/steering/docs-pattern.md`
