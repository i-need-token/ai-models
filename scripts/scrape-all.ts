/**
 * Run all provider scrape scripts and write updated model YAML files.
 *
 * Usage: npx tsx scripts/scrape-all.ts
 *
 * Each provider's scrape.ts exports a `scrape()` function that returns
 * a ScrapeResult. This script calls each one and writes the results
 * to providers/<id>/models/<model-id>.yaml.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { defineModel } from "./lib/utils";
import type { ScrapeResult } from "./lib/types";

const providersDir = "providers";

async function main() {
  const providerDirs = fs
    .readdirSync(providersDir)
    .filter((d) => fs.statSync(path.join(providersDir, d)).isDirectory());

  let totalUpdated = 0;
  let totalFailed = 0;

  for (const provider of providerDirs) {
    const scrapePath = path.join(providersDir, provider, "scrape.ts");
    if (!fs.existsSync(scrapePath)) continue;

    console.log(`Scraping ${provider}...`);
    try {
      const mod = await import(`../providers/${provider}/scrape.ts`);
      const result: ScrapeResult = await mod.scrape();

      const mDir = path.join(providersDir, provider, "models");
      fs.mkdirSync(mDir, { recursive: true });

      for (const model of result.models) {
        const validated = defineModel(model);
        const filePath = path.join(mDir, `${validated.id}.yaml`);
        fs.writeFileSync(filePath, YAML.stringify(validated));
        totalUpdated++;
      }

      console.log(`  ✓ ${provider}: ${result.models.length} models`);
    } catch (err) {
      console.error(`  ✗ ${provider}: ${err}`);
      totalFailed++;
    }
  }

  console.log(`\nDone: ${totalUpdated} models updated, ${totalFailed} providers failed`);
  if (totalFailed > 0) {
    process.exit(1);
  }
}

main();
