import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const iconsDir = join(root, "public/diagram-icons");
const svgOut = join(root, "public/architecture-diagram.svg");
const pngOut = join(root, "public/architecture-diagram.png");
const ogSvgOut = join(root, "public/og-image.svg");
const ogPngOut = join(root, "public/og-image.png");

const AWS_ICONS_BASE =
  "https://raw.githubusercontent.com/jajera/aws-icons/main";

const nodes = [
  {
    id: "esp32",
    label: "ESP32-S3",
    sublabel: "MQTT + mTLS",
    url: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/espressif.svg",
    tint: "#E7352B",
    size: 64,
    labelOffsetX: 6,
  },
  {
    id: "iot-core",
    label: "IoT Core",
    sublabel: null,
    path: "icons/service/iot/Arch_AWS-IoT-Core_64.svg",
    size: 64,
  },
  {
    id: "iot-rule",
    label: "IoT Rules",
    sublabel: null,
    path: "icons/resource/iot/Res_AWS-IoT-Rule_48.svg",
    size: 48,
  },
  {
    id: "lambda",
    label: "Lambda",
    sublabel: "ingest",
    path: "icons/service/compute/Arch_AWS-Lambda_64.svg",
    size: 64,
  },
  {
    id: "dynamodb",
    label: "DynamoDB",
    sublabel: "telemetry + events",
    path: "icons/service/database/Arch_Amazon-DynamoDB_64.svg",
    size: 64,
  },
  {
    id: "api-gateway",
    label: "API Gateway",
    sublabel: "query API",
    path: "icons/service/networking/Arch_Amazon-API-Gateway_64.svg",
    size: 64,
  },
  {
    id: "amplify",
    label: "Amplify",
    sublabel: "dashboard",
    path: "icons/service/frontend/Arch_AWS-Amplify_64.svg",
    size: 64,
  },
];

mkdirSync(iconsDir, { recursive: true });

function stripSvg(svgText) {
  return svgText
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")
    .trim();
}

function extractInnerSvg(svgText) {
  const stripped = stripSvg(svgText);
  const match = stripped.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!match) {
    throw new Error("Invalid SVG content");
  }
  return match[1];
}

function getViewBox(svgText) {
  const stripped = stripSvg(svgText);
  const match = stripped.match(/viewBox="([^"]+)"/i);
  if (match) {
    return match[1];
  }
  const w = Number(stripped.match(/width="(\d+)/i)?.[1] ?? 64);
  const h = Number(stripped.match(/height="(\d+)/i)?.[1] ?? 64);
  return `0 0 ${w} ${h}`;
}

function parseViewBox(viewBox) {
  const [x, y, w, h] = viewBox.split(/\s+/).map(Number);
  return { x, y, w, h };
}

async function fetchIcon(node) {
  const url = node.url ?? `${AWS_ICONS_BASE}/${node.path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const svgText = await response.text();
  writeFileSync(join(iconsDir, `${node.id}.svg`), svgText);
  return {
    svgText,
    viewBox: getViewBox(svgText),
    inner: extractInnerSvg(svgText),
  };
}

function buildFlowContent(iconData, layout) {
  const { width, iconY, labelY, sublabelY } = layout;
  const slotWidth = width / iconData.length;

  const nodePositions = iconData.map((entry, index) => {
    const centerX = slotWidth * index + slotWidth / 2;
    const viewBox = parseViewBox(entry.viewBox);
    const targetSize = entry.node.size;
    const scale = targetSize / Math.max(viewBox.w, viewBox.h);
    const renderedW = viewBox.w * scale;
    const renderedH = viewBox.h * scale;
    const labelOffsetX = entry.node.labelOffsetX ?? 0;
    return {
      ...entry,
      centerX,
      labelX: centerX + labelOffsetX,
      iconX: centerX - renderedW / 2 - viewBox.x * scale,
      iconY: iconY + (targetSize - renderedH) / 2 - viewBox.y * scale,
      iconBox: targetSize,
      renderedW,
      scale,
      viewBox,
    };
  });

  const arrows = [];
  for (let i = 0; i < nodePositions.length - 1; i += 1) {
    const left = nodePositions[i];
    const right = nodePositions[i + 1];
    const startX = left.centerX + left.renderedW / 2 + 8;
    const endX = right.centerX - right.renderedW / 2 - 8;
    const y = iconY + left.iconBox / 2;
    arrows.push(
      `<line x1="${startX}" y1="${y}" x2="${endX - 10}" y2="${y}" stroke="#6d5f95" stroke-width="2"/>`,
      `<polygon points="${endX - 10},${y - 5} ${endX},${y} ${endX - 10},${y + 5}" fill="#6d5f95"/>`,
    );
  }

  const iconGroups = nodePositions
    .map((entry) => {
      const tint = entry.node.tint
        ? `<g fill="${entry.node.tint}">${entry.inner}</g>`
        : entry.inner;
      return `<g transform="translate(${entry.iconX} ${entry.iconY}) scale(${entry.scale})">${tint}</g>`;
    })
    .join("\n");

  const labels = nodePositions
    .map((entry) => {
      const sublabel = entry.node.sublabel
        ? `<text x="${entry.labelX}" y="${sublabelY}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="12">${entry.node.sublabel}</text>`
        : "";
      return `<text x="${entry.labelX}" y="${labelY}" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="14" font-weight="600">${entry.node.label}</text>${sublabel}`;
    })
    .join("\n");

  return `${arrows.join("\n")}\n${iconGroups}\n${labels}`;
}

function bgGradient(id, height) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#2f2440"/>
      <stop offset="1" stop-color="#17111f"/>
    </linearGradient>`;
}

function framedRect(width, height, rx = 12) {
  return `<rect width="${width}" height="${height}" rx="${rx}" fill="url(#bg)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx - 1}" stroke="#6d5f95" stroke-width="1" fill="none" opacity="0.45"/>`;
}

function phasePill(x, y, label) {
  const w = label.length * 11 + 36;
  return `<rect x="${x}" y="${y}" width="${w}" height="32" rx="16" fill="#3d3254" stroke="#6d5f95" stroke-width="1"/>
  <text x="${x + w / 2}" y="${y + 21}" text-anchor="middle" fill="#e8e0f4" font-family="sans-serif" font-size="14" font-weight="600">${label}</text>`;
}

function buildOgImage(flowContent, diagramWidth, diagramHeight) {
  const width = 1200;
  const height = 630;
  const diagramScale = 1104 / diagramWidth;
  const scaledDiagramH = diagramHeight * diagramScale;
  const diagramX = (width - diagramWidth * diagramScale) / 2;
  const diagramY = 248;

  const pills = ["Pretest", "Ingest", "Dashboard"];
  let pillX = width / 2 - (pills.length * 100 + 24) / 2;
  const pillY = 168;
  const pillMarkup = pills
    .map((label) => {
      const w = label.length * 11 + 36;
      const markup = phasePill(pillX, pillY, label);
      pillX += w + 12;
      return markup;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    ${bgGradient("bg", height)}
  </defs>
  ${framedRect(width, height)}
  <text x="${width / 2}" y="72" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="52" font-weight="700">AWS IoT Walkthrough</text>
  <text x="${width / 2}" y="118" text-anchor="middle" fill="#b8afc8" font-family="sans-serif" font-size="24">ESP32-S3 → AWS IoT Core → live dashboard</text>
  ${pillMarkup}
  <rect x="48" y="${diagramY - 16}" width="${width - 96}" height="${scaledDiagramH + 32}" rx="12" fill="#231a30" stroke="#6d5f95" stroke-width="1" opacity="0.6"/>
  <g transform="translate(${diagramX} ${diagramY}) scale(${diagramScale})">
    ${flowContent}
  </g>
  <text x="${width / 2}" y="${diagramY + scaledDiagramH + 72}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="20">Telemetry · button events · hosted dashboard</text>
  <text x="${width / 2}" y="${diagramY + scaledDiagramH + 108}" text-anchor="middle" fill="#6d5f95" font-family="sans-serif" font-size="18">jajera.github.io/aws-iot-walkthrough</text>
</svg>
`;
}

const iconData = [];
for (const node of nodes) {
  iconData.push({ node, ...(await fetchIcon(node)) });
}

const diagramWidth = 1280;
const diagramHeight = 280;
const flowLayout = {
  width: diagramWidth,
  iconY: 56,
  labelY: 150,
  sublabelY: 172,
};
const flowContent = buildFlowContent(iconData, flowLayout);

const architectureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${diagramWidth}" height="${diagramHeight}" viewBox="0 0 ${diagramWidth} ${diagramHeight}" fill="none">
  <defs>
    ${bgGradient("bg", diagramHeight)}
  </defs>
  ${framedRect(diagramWidth, diagramHeight)}
  ${flowContent}
</svg>
`;

const ogSvg = buildOgImage(flowContent, diagramWidth, diagramHeight);

writeFileSync(svgOut, architectureSvg);
writeFileSync(ogSvgOut, ogSvg);
await sharp(Buffer.from(architectureSvg)).png().toFile(pngOut);
await sharp(Buffer.from(ogSvg)).png().toFile(ogPngOut);

console.log(`Wrote ${svgOut}`);
console.log(`Wrote ${pngOut}`);
console.log(`Wrote ${ogSvgOut}`);
console.log(`Wrote ${ogPngOut}`);
