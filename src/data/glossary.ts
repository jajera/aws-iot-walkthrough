export const glossary: Record<string, string> = {
  amplify:
    "AWS Amplify — hosts the walkthrough dashboard frontend and connects it to the query API URL.",
  "api-gateway":
    "Amazon API Gateway — exposes HTTP routes for latest telemetry and recent events. The browser reads data through API Gateway, not DynamoDB directly.",
  aws: "Amazon Web Services — the cloud platform used for IoT Core, serverless ingest, storage, API, and hosting in this walkthrough.",
  "cli-tools":
    "jdevto/cli-tools — install scripts for Git, AWS CLI, PlatformIO, Terraform, and Node.js used as an optional Red Hat install path in prerequisites.",
  cloudwatch:
    "Amazon CloudWatch Logs — stores IoT rule output for Phase 1 verification (`/aws/iot/esp32-demo/telemetry` and `/events`).",
  "demo-repo":
    "esp32-aws-iot-demo — source repository for firmware, provisioning scripts, Terraform, and dashboard code. Commands run from its root unless stated otherwise.",
  dynamodb:
    "Amazon DynamoDB — persists telemetry and event records after Lambda ingest in Phase 2.",
  esp32:
    "Espressif ESP32 family microcontroller — this walkthrough targets ESP32-S3-N16R8 with PlatformIO firmware.",
  firmware:
    "PlatformIO-based ESP32 application in `firmware/` — connects to Wi-Fi, syncs time, and publishes MQTT telemetry and events.",
  git: "Distributed version control — used to clone the demo repository and supporting docs.",
  iam: "AWS Identity and Access Management — controls roles and permissions for IoT Rules, Lambda, and other services.",
  "iot-core":
    "AWS IoT Core — managed MQTT broker with X.509 device authentication for ESP32 telemetry and events.",
  "iot-policy":
    "AWS IoT Core policy — least-privilege MQTT permissions scoped to a device's Thing name and topic namespace.",
  "iot-rules":
    "AWS IoT Rules — route incoming MQTT messages to Lambda and CloudWatch Logs for ingest and verification.",
  lambda:
    "AWS Lambda — processes IoT rule payloads and serves query API logic behind API Gateway.",
  mqtt: "Message Queuing Telemetry Transport — lightweight publish/subscribe protocol used between ESP32 and AWS IoT Core.",
  mtls: "Mutual TLS — both client and server present certificates. ESP32 uses mTLS with AWS IoT Core over TLS 1.2.",
  "payload-contract":
    "JSON schema for telemetry (`type=connectivity`) and event (`type=button`, `event=press`) MQTT messages.",
  platformio:
    "PlatformIO — build, upload, and serial monitor toolchain (`pio`) for ESP32 firmware.",
  "phase1-stack":
    "CloudFormation stack `esp32-demo-phase1` — deploys Phase 1 IoT rules and CloudWatch log groups for pretest verification before Terraform.",
  pretest:
    "Phase 1 verification flow — Prerequisites through Cloud Verification in the sidebar (includes AWS Provisioning). Proves device-to-cloud connectivity in CloudWatch before full Terraform rollout.",
  qos: "Quality of Service — firmware publishes with MQTT QoS 1 (at least once delivery).",
  terraform:
    "HashiCorp Terraform — provisions shared infrastructure (IoT rules fan-out, Lambda, DynamoDB, API Gateway, Amplify).",
  "terraform-stack":
    "Terraform modules in `terraform/` of the demo repo — provisions the full serverless ingest and query stack.",
  thing:
    "AWS IoT Thing — logical device identity (example: `esp32-c`) bound to certificates and MQTT topics.",
  x509: "X.509 certificate standard — device identity format used for AWS IoT Core mutual authentication.",
};
