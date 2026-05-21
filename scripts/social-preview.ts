#!/usr/bin/env node
/**
 * Generate a social preview image (1280×640) for GitHub repo.
 * Outputs an SVG that can be converted to PNG via any browser or tool.
 *
 * Usage:
 *   node scripts/social-preview.js > social-preview.svg
 *   # Or open in browser and screenshot
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
      <stop offset="0%" style="stop-color:#0f0c29"/>
      <stop offset="50%" style="stop-color:#302b63"/>
      <stop offset="100%" style="stop-color:#24243e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="640" fill="url(#bg)"/>

  <!-- Accent bar -->
  <rect x="0" y="0" width="1280" height="6" fill="url(#accent)"/>

  <!-- Title -->
  <text x="640" y="180" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700">AI Models Catalog</text>

  <!-- Subtitle -->
  <text x="640" y="240" text-anchor="middle" fill="#a0a0c0" font-family="system-ui, -apple-system, sans-serif" font-size="28">Structured YAML · First-Party Data · TypeScript Types</text>

  <!-- Stats -->
  <text x="320" y="360" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700">${modelCount.toLocaleString()}</text>
  <text x="320" y="400" text-anchor="middle" fill="#a0a0c0" font-family="system-ui, -apple-system, sans-serif" font-size="22">Models</text>

  <text x="640" y="360" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700">${providerCount}</text>
  <text x="640" y="400" text-anchor="middle" fill="#a0a0c0" font-family="system-ui, -apple-system, sans-serif" font-size="22">Providers</text>

  <text x="960" y="360" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="700">1,306</text>
  <text x="960" y="400" text-anchor="middle" fill="#a0a0c0" font-family="system-ui, -apple-system, sans-serif" font-size="22">Reasoning</text>

  <!-- Divider -->
  <line x1="440" y1="440" x2="840" y2="440" stroke="#667eea" stroke-width="2" opacity="0.5"/>

  <!-- Capabilities -->
  <text x="640" y="490" text-anchor="middle" fill="#a0a0c0" font-family="system-ui, -apple-system, sans-serif" font-size="20">Pricing · Context Windows · Modalities · Tool Calling · Open Weights</text>

  <!-- Install -->
  <rect x="440" y="520" width="400" height="44" rx="8" fill="#1a1a3e" stroke="#667eea" stroke-width="1"/>
  <text x="640" y="548" text-anchor="middle" fill="#667eea" font-family="monospace" font-size="18">npm install ai-models</text>

  <!-- Bottom accent -->
  <rect x="0" y="634" width="1280" height="6" fill="url(#accent)"/>
</svg>`;

process.stdout.write(svg);
