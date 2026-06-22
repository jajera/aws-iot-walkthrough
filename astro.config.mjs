import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeVintage from "starlight-theme-vintage";
import { starlightBasePath } from "starlight-base-path";

export default defineConfig({
  site: "https://jajera.github.io",
  base: "/aws-iot-walkthrough/",
  integrations: [
    starlight({
      title: "AWS IoT Walkthrough",
      favicon: "/favicon.svg",
      description:
        "ESP32 AWS IoT demo walkthrough — Phase 1 device-to-cloud proof through API and dashboard hosting.",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content:
              "https://jajera.github.io/aws-iot-walkthrough/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content:
              "https://jajera.github.io/aws-iot-walkthrough/og-image.png",
          },
        },
      ],
      plugins: [starlightThemeVintage(), starlightBasePath()],
      social: [
        {
          icon: "github",
          label: "Source Repository",
          href: "https://github.com/jajera/aws-iot-walkthrough",
        },
      ],
      editLink: {
        baseUrl: "https://github.com/jajera/aws-iot-walkthrough/edit/main/",
      },
      sidebar: [
        { label: "Home", link: "/" },
        {
          label: "Introduction",
          items: [
            {
              label: "Project Overview",
              slug: "introduction/project-overview",
            },
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
            {
              label: "Policies and IAM",
              slug: "security/policies-and-iam",
            },
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
            {
              label: "Source Layout",
              slug: "firmware/source-layout",
            },
            {
              label: "Architecture and Modules",
              slug: "firmware/architecture-and-modules",
            },
            {
              label: "Payload Contract",
              slug: "firmware/payload-contract",
            },
            {
              label: "Build Configuration",
              slug: "firmware/build-configuration",
            },
          ],
        },
        {
          label: "Device Setup",
          items: [
            {
              label: "Linux USB Setup",
              slug: "device-setup/linux-usb-setup",
            },
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
            {
              label: "Ingest Pipeline",
              slug: "infrastructure/ingest-pipeline",
            },
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
          items: [
            {
              label: "Common Fixes",
              slug: "troubleshooting/common-fixes",
            },
          ],
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
            {
              label: "Teardown and Cleanup",
              slug: "reference/teardown-and-cleanup",
            },
          ],
        },
      ],
    }),
  ],
});
