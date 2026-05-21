#!/usr/bin/env node
/**
 * Generate a social preview image (1280×640) for GitHub repo.
 * Outputs an SVG that can be converted to PNG via any browser or tool.
 *
 * Usage:
 *   npx tsx scripts/social-preview.ts > social-preview.svg
 */

import fs from "node:fs";
import path from "node:path";

const providersDir = path.join(import.meta.dirname, "..", "providers");

let providerCount = 0;
let modelCount = 0;

for (const p of fs.readdirSync(providersDir)) {
  const mDir = path.join(providersDir, p, "models");
  if (!fs.existsSync(mDir)) continue;
  providerCount++;
  for (const _f of fs.readdirSync(mDir).filter((f) => f.endsWith(".yaml"))) {
    modelCount++;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117"/>
      <stop offset="50%" style="stop-color:#161b22"/>
      <stop offset="100%" style="stop-color:#0d1117"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#58a6ff"/>
      <stop offset="50%" style="stop-color:#bc8cff"/>
      <stop offset="100%" style="stop-color:#f778ba"/>
    </linearGradient>
    <linearGradient id="card" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1c2333"/>
      <stop offset="100%" style="stop-color:#161b22"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="640" fill="url(#bg)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1280" height="5" fill="url(#accent)"/>

  <!-- Emoji icon -->
  <text x="640" y="90" text-anchor="middle" fill="#ffffff" font-size="48">🤖</text>

  <!-- Title -->
  <text x="640" y="140" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700">AI Models Catalog</text>

  <!-- Subtitle -->
  <text x="640" y="175" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="22">The most comprehensive structured catalog of AI models on GitHub</text>

  <!-- Stats cards row -->
  <rect x="60" y="220" width="240" height="100" rx="12" fill="url(#card)" stroke="#30363d" stroke-width="1"/>
  <text x="180" y="268" text-anchor="middle" fill="#58a6ff" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700">${modelCount.toLocaleString()}</text>
  <text x="180" y="298" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="16">Models</text>

  <rect x="320" y="220" width="240" height="100" rx="12" fill="url(#card)" stroke="#30363d" stroke-width="1"/>
  <text x="440" y="268" text-anchor="middle" fill="#bc8cff" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700">${providerCount}</text>
  <text x="440" y="298" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="16">Providers</text>

  <rect x="580" y="220" width="240" height="100" rx="12" fill="url(#card)" stroke="#30363d" stroke-width="1"/>
  <text x="700" y="268" text-anchor="middle" fill="#f778ba" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700">2,350</text>
  <text x="700" y="298" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="16">Tool Calling</text>

  <rect x="840" y="220" width="240" height="100" rx="12" fill="url(#card)" stroke="#30363d" stroke-width="1"/>
  <text x="960" y="268" text-anchor="middle" fill="#7ee787" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700">1,306</text>
  <text x="960" y="298" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="16">Reasoning</text>

  <rect x="1100" y="220" width="120" height="100" rx="12" fill="url(#card)" stroke="#30363d" stroke-width="1"/>
  <text x="1160" y="268" text-anchor="middle" fill="#ffa657" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700">81</text>
  <text x="1160" y="298" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="14">Free</text>

  <!-- Capability pills -->
  <rect x="180" y="370" width="160" height="32" rx="16" fill="#1c2333" stroke="#58a6ff" stroke-width="1"/>
  <text x="260" y="392" text-anchor="middle" fill="#58a6ff" font-family="system-ui, -apple-system, sans-serif" font-size="14">Pricing</text>

  <rect x="360" y="370" width="180" height="32" rx="16" fill="#1c2333" stroke="#bc8cff" stroke-width="1"/>
  <text x="450" y="392" text-anchor="middle" fill="#bc8cff" font-family="system-ui, -apple-system, sans-serif" font-size="14">Context Windows</text>

  <rect x="560" y="370" width="160" height="32" rx="16" fill="#1c2333" stroke="#f778ba" stroke-width="1"/>
  <text x="640" y="392" text-anchor="middle" fill="#f778ba" font-family="system-ui, -apple-system, sans-serif" font-size="14">Modalities</text>

  <rect x="740" y="370" width="160" height="32" rx="16" fill="#1c2333" stroke="#7ee787" stroke-width="1"/>
  <text x="820" y="392" text-anchor="middle" fill="#7ee787" font-family="system-ui, -apple-system, sans-serif" font-size="14">Open Weights</text>

  <rect x="920" y="370" width="160" height="32" rx="16" fill="#1c2333" stroke="#ffa657" stroke-width="1"/>
  <text x="1000" y="392" text-anchor="middle" fill="#ffa657" font-family="system-ui, -apple-system, sans-serif" font-size="14">Cached Pricing</text>

  <!-- First-party data badge -->
  <rect x="440" y="430" width="400" height="36" rx="18" fill="#238636" stroke-opacity="0"/>
  <text x="640" y="454" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600">✓ First-Party Data Only · Zod Validation</text>

  <!-- Access methods -->
  <text x="640" y="520" text-anchor="middle" fill="#8b949e" font-family="system-ui, -apple-system, sans-serif" font-size="18">npm · CDN · CSV · GitHub Action · Hugging Face</text>

  <!-- Install command -->
  <rect x="390" y="545" width="500" height="40" rx="8" fill="#0d1117" stroke="#30363d" stroke-width="1"/>
  <text x="640" y="572" text-anchor="middle" fill="#58a6ff" font-family="monospace" font-size="16">$ npm install ai-models</text>

  <!-- Bottom accent bar -->
  <rect x="0" y="635" width="1280" height="5" fill="url(#accent)"/>
</svg>`;

process.stdout.write(svg);
