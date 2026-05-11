import { parseHTML } from "linkedom";
import { defineModel, defineProvider } from "../../scripts/lib/index";
import type { ScrapeResult } from "../../scripts/lib/types";
import type { Model, ModelModality } from "../../types/index";

const provider = defineProvider({
  id: "anthropic",
  name: "Anthropic",
  url: "https://www.anthropic.com",
  api_docs: "https://docs.anthropic.com",
  apis: {
    anthropic: "https://api.anthropic.com",
  },
});

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

const MODELS_URL = "https://platform.claude.com/docs/en/about-claude/models/overview";
const PRICING_URL = "https://platform.claude.com/docs/en/about-claude/pricing";
const DEPRECATIONS_URL = "https://platform.claude.com/docs/en/about-claude/model-deprecations";

// ---------------------------------------------------------------------------
// Scrape function
// ---------------------------------------------------------------------------

export async function scrape(): Promise<ScrapeResult> {
  const [modelsHtml, pricingHtml, deprecationsHtml] = await Promise.all([
    fetchPage(MODELS_URL),
    fetchPage(PRICING_URL),
    fetchPage(DEPRECATIONS_URL),
  ]);

  // 1. Parse pricing page → model display names + pricing
  const pricingByName = parsePricingPage(pricingHtml);

  // 2. Parse deprecations page → model IDs + status + snapshots
  const deprecationInfo = parseDeprecationsPage(deprecationsHtml);

  // 3. Parse models page → current + legacy model details
  const modelDetails = parseModelsPage(modelsHtml);

  // 4. Build model name → stable ID mapping
  const nameToStableId = buildNameToIdMap(pricingByName, deprecationInfo);

  // 5. Assemble models
  const models = assembleModels(pricingByName, deprecationInfo, modelDetails, nameToStableId);

  return {
    provider,
    models: models.map((m) => defineModel(m)),
  };
}

// ---------------------------------------------------------------------------
// Page fetching
// ---------------------------------------------------------------------------

async function fetchPage(url: string): Promise<string> {
  const resp = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  }
  return resp.text();
}

// ---------------------------------------------------------------------------
// Pricing page parser
// ---------------------------------------------------------------------------

interface PricingInfo {
  input: number;
  output: number;
  cache_write: number;
  cache_read: number;
}

function parsePricingPage(html: string): Map<string, PricingInfo> {
  const result = new Map<string, PricingInfo>();
  const { document } = parseHTML(html);

  const tables = document.querySelectorAll("table");
  if (tables.length === 0) return result;

  const firstTable = tables[0];
  if (!firstTable) return result;

  const rows = firstTable.querySelectorAll("tr");
  // Header: Model | Base Input | 5m Cache | 1h Cache | Cache Read | Output
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) continue;

    const cell0 = cells[0];
    const cell1 = cells[1];
    const cell2 = cells[2];
    const cell4 = cells[4];
    const cell5 = cells[5];
    if (!cell0 || !cell1 || !cell2 || !cell4 || !cell5) continue;

    const modelName = cell0.textContent.trim();
    const input = parsePrice(cell1.textContent);
    const cacheWrite = parsePrice(cell2.textContent);
    const cacheRead = parsePrice(cell4.textContent);
    const output = parsePrice(cell5.textContent);

    if (input == null || output == null) continue;

    result.set(modelName, {
      input,
      output,
      cache_write: cacheWrite ?? input * 1.25,
      cache_read: cacheRead ?? input * 0.1,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Deprecations page parser
// ---------------------------------------------------------------------------

interface DeprecationInfo {
  id: string;
  stableId: string;
  status: "Active" | "Deprecated" | "Retired";
  releaseDate: string;
  isSnapshot: boolean;
}

function parseDeprecationsPage(html: string): DeprecationInfo[] {
  const result: DeprecationInfo[] = [];
  const { document } = parseHTML(html);

  const tables = document.querySelectorAll("table");
  if (tables.length === 0) return result;

  const activeTable = tables[0];
  if (!activeTable) return result;

  // Table 0: Active models
  // Header: API Model Name | Current State | Deprecated | Tentative Retirement Date
  const activeRows = activeTable.querySelectorAll("tr");
  for (let i = 1; i < activeRows.length; i++) {
    const row = activeRows[i];
    if (!row) continue;
    const cells = row.querySelectorAll("td");
    if (cells.length < 4) continue;

    const cell0 = cells[0];
    const cell1 = cells[1];
    const cell3 = cells[3];
    if (!cell0 || !cell1 || !cell3) continue;

    const apiId = cell0.textContent.trim();
    const status = cell1.textContent.trim() as DeprecationInfo["status"];
    const retirementText = cell3.textContent.trim();

    const stableId = toStableId(apiId);
    if (!stableId) continue;

    const isSnapshot = apiId !== stableId;
    const releaseDate = isSnapshot
      ? snapshotIdToDate(apiId)
      : deriveReleaseDateFromRetirement(retirementText);

    result.push({ id: apiId, stableId, status, releaseDate, isSnapshot });
  }

  // Table 1: Deprecated (not yet retired) models
  // Header: Retirement Date | Deprecated Model | Recommended Replacement
  if (tables.length > 1) {
    const deprecatedTable = tables[1];
    if (deprecatedTable) {
      const deprecatedRows = deprecatedTable.querySelectorAll("tr");
      for (let i = 1; i < deprecatedRows.length; i++) {
        const row = deprecatedRows[i];
        if (!row) continue;
        const cells = row.querySelectorAll("td");
        if (cells.length < 2) continue;

        const cell1 = cells[1];
        if (!cell1) continue;

        const apiId = cell1.textContent.trim();
        const stableId = toStableId(apiId);
        if (!stableId) continue;

        const isSnapshot = apiId !== stableId;
        const releaseDate = isSnapshot ? snapshotIdToDate(apiId) : "unknown";

        result.push({ id: apiId, stableId, status: "Deprecated", releaseDate, isSnapshot });
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Models page parser
// ---------------------------------------------------------------------------

interface ModelDetail {
  name: string;
  stableId: string;
  context: number;
  output: number;
  knowledge: string;
  trainingDataCutoff: string;
  reasoning: boolean;
}

function parseModelsPage(html: string): ModelDetail[] {
  const details: ModelDetail[] = [];

  // Parse the SSR HTML table for current models
  const currentModels = parseCurrentModelsTable(html);
  details.push(...currentModels);

  // Parse the RSC payload for legacy models
  const legacyModels = parseLegacyModelsRSC(html);
  details.push(...legacyModels);

  return details;
}

/**
 * Parse the SSR HTML table for current models.
 * Columns: Feature | Model1 | Model2 | ...
 */
function parseCurrentModelsTable(html: string): ModelDetail[] {
  const { document } = parseHTML(html);
  const tables = document.querySelectorAll("table");
  if (tables.length === 0) return [];

  const firstTable = tables[0];
  if (!firstTable) return [];

  const rows = firstTable.querySelectorAll("tr");
  if (rows.length === 0) return [];

  // Header: ["Feature", "Claude Opus 4.7", "Claude Sonnet 4.6", ...]
  const headerRow = rows[0];
  if (!headerRow) return [];
  const headerCells = headerRow.querySelectorAll("th, td");
  const modelNames = Array.from(headerCells)
    .slice(1)
    .map((c) => c.textContent.trim());

  // Build feature map
  const features = new Map<string, string[]>();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const cells = row.querySelectorAll("td");
    if (cells.length < 2) continue;
    const firstCell = cells[0];
    if (!firstCell) continue;
    const featureName = firstCell.textContent.trim();
    const values = Array.from(cells)
      .slice(1)
      .map((c) => c.textContent.trim());
    features.set(featureName, values);
  }

  const result: ModelDetail[] = [];

  for (let col = 0; col < modelNames.length; col++) {
    const name = modelNames[col];
    if (!name) continue;
    const apiAlias = getFeatureValue(features, "Claude API alias", col);
    const contextStr = getFeatureValue(features, "Context window", col);
    const outputStr = getFeatureValue(features, "Max output", col);
    const knowledgeStr = getFeatureValue(features, "Reliable knowledge cutoff", col);
    const trainingStr = getFeatureValue(features, "Training data cutoff", col);

    const stableId = toStableId(apiAlias);
    if (!stableId) continue;

    const context = parseTokenCount(contextStr);
    const output = parseTokenCount(outputStr);
    const knowledge = parseKnowledgeDate(knowledgeStr);
    const trainingDataCutoff = parseKnowledgeDate(trainingStr);

    // reasoning = Extended thinking OR Adaptive thinking is "Yes"
    const extendedThinking = getFeatureValue(features, "Extended thinking", col);
    const adaptiveThinking = getFeatureValue(features, "Adaptive thinking", col);
    const reasoning = extendedThinking === "Yes" || adaptiveThinking === "Yes";

    if (!context || !output) continue;

    result.push({
      name,
      stableId,
      context,
      output,
      knowledge: knowledge || trainingDataCutoff || "unknown",
      trainingDataCutoff: trainingDataCutoff || knowledge || "unknown",
      reasoning,
    });
  }

  return result;
}

/**
 * Parse the Next.js RSC payload for legacy models.
 * The legacy table is client-side rendered from RSC data in <script> tags.
 */
function parseLegacyModelsRSC(html: string): ModelDetail[] {
  const { document } = parseHTML(html);

  const scripts = Array.from(document.querySelectorAll("script"));
  const rscScripts = scripts.filter((s) => s.textContent.includes("self.__next_f.push"));

  // 1. Find legacy model names from the header script
  const headerScript = rscScripts.find(
    (s) => s.textContent.includes("Legacy models") && s.textContent.includes("Claude"),
  );
  if (!headerScript) return [];

  const modelNames = extractRSCModelNames(headerScript.textContent);
  if (modelNames.length === 0) return [];

  // 2. Find API aliases from RSC scripts
  const apiAliases = extractRSCApiAliases(rscScripts, modelNames.length);

  // 3. Extract feature rows from RSC scripts
  // We need to find the scripts that belong to the LEGACY table, not the current table.
  // The current table has 3 columns, the legacy table has 6 columns.
  // Strategy: find the script with the most matching values for each feature.

  const contextValues = extractRSCFeatureTokens(rscScripts, "Context window", modelNames.length);
  const outputValues = extractRSCFeatureTokens(rscScripts, "Max output", modelNames.length);
  const knowledgeValues = extractRSCFeatureDates(
    rscScripts,
    "Reliable knowledge cutoff",
    modelNames.length,
  );
  const trainingValues = extractRSCFeatureDates(
    rscScripts,
    "Training data cutoff",
    modelNames.length,
  );

  // Extract reasoning support from Extended thinking + Adaptive thinking
  const extendedThinkingValues = extractRSCFeatureYesNo(
    rscScripts,
    "Extended thinking",
    modelNames.length,
  );
  const adaptiveThinkingValues = extractRSCFeatureYesNo(
    rscScripts,
    "Adaptive thinking",
    modelNames.length,
  );

  const result: ModelDetail[] = [];

  for (let col = 0; col < modelNames.length; col++) {
    const name = modelNames[col];
    if (!name) continue;
    const apiAlias = apiAliases[col] || "";
    const stableId = toStableId(apiAlias);
    if (!stableId) continue;

    const context = parseTokenCount(contextValues[col] || "");
    const output = parseTokenCount(outputValues[col] || "");
    const knowledge = parseKnowledgeDate(knowledgeValues[col] || "");
    const trainingDataCutoff = parseKnowledgeDate(trainingValues[col] || "");

    const reasoning =
      extendedThinkingValues[col] === "Yes" || adaptiveThinkingValues[col] === "Yes";

    if (!context || !output) continue;

    result.push({
      name,
      stableId,
      context,
      output,
      knowledge: knowledge || trainingDataCutoff || "unknown",
      trainingDataCutoff: trainingDataCutoff || knowledge || "unknown",
      reasoning,
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// RSC payload extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract model names from the legacy table header in RSC payload.
 * Looks for "Claude Xxx N.N" patterns in <th> elements.
 */
function extractRSCModelNames(rscContent: string): string[] {
  const names: string[] = [];
  // Pattern: \"children\":\"Claude Xxx N.N\"
  // In linkedom textContent: \\\"children\\\":\\\"Claude Xxx N.N\\\"
  const pattern = /\\"children\\":\\"(Claude\s+\w+\s+\d+(?:\.\d+)?(?:\s*\(deprecated\))?)\\"/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(rscContent)) !== null) {
    const name = match[1];
    if (name) names.push(name);
  }
  return names;
}

/**
 * Extract API aliases from RSC scripts.
 * API aliases are the stable model IDs (without date suffix).
 */
function extractRSCApiAliases(
  rscScripts: { textContent: string }[],
  expectedCount: number,
): string[] {
  // The API alias table has two rows in the RSC payload:
  //   Row 1: snapshot/alias IDs (some with date suffixes)
  //   Row 2: stable IDs (no date suffixes)
  // We need Row 2. Both rows are in the same script.
  // Strategy: extract ALL ids, then take the LAST group of `expectedCount` stable IDs.
  for (const script of rscScripts) {
    const content = script.textContent;
    if (!content.includes("Claude API alias")) continue;

    // Extract all {"id":"claude-xxx"} patterns
    const ids: string[] = [];
    const pattern = /\\"id\\":\\"(claude-[^\\]+?)\\"/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const id = match[1];
      if (id) ids.push(id);
    }

    // Filter to stable IDs (no date suffix, no @)
    const stableIds = ids.filter((id) => !/\d{8}$/.test(id) && !id.includes("@"));

    if (stableIds.length >= expectedCount) {
      // Take the LAST group (Row 2 = stable IDs in correct column order)
      return stableIds.slice(-expectedCount);
    }
  }
  return [];
}

/**
 * Extract token values (like "1M tokens", "200k tokens") from a feature row
 * in the RSC payload for the LEGACY models table.
 * Uses a loose pattern to handle varying escape levels in RSC payload.
 * Identifies legacy scripts by value count (legacy=6, current=3).
 */
function extractRSCFeatureTokens(
  rscScripts: { textContent: string }[],
  featureName: string,
  expectedCount: number,
): string[] {
  const candidates: string[][] = [];

  for (const script of rscScripts) {
    const content = script.textContent;
    if (!content.includes(featureName)) continue;

    const tokens: string[] = [];
    // Loose pattern: find "children" followed by token values
    const pattern = /children[^a-z]*?(\d+[MK]\s*tokens?)/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const token = match[1];
      if (token) tokens.push(token);
    }

    if (tokens.length >= expectedCount) {
      candidates.push(tokens);
    }
  }

  // Return the first candidate with enough values
  const first = candidates[0];
  return first ? first.slice(0, expectedCount) : [];
}

/**
 * Extract date values (like "Aug 2025", "Jan 2026") from a feature row
 * in the RSC payload for the LEGACY models table.
 * Uses a loose pattern to handle varying escape levels in RSC payload.
 * Identifies legacy scripts by excluding the current model table script
 * (which combines Max output + knowledge cutoff + training cutoff in one script).
 */
function extractRSCFeatureDates(
  rscScripts: { textContent: string }[],
  featureName: string,
  expectedCount: number,
): string[] {
  const candidates: string[][] = [];

  for (const script of rscScripts) {
    const content = script.textContent;
    if (!content.includes(featureName)) continue;

    // Skip the current model table script (combines Max output + knowledge + training)
    if (content.includes("Max output")) continue;

    const dates: string[] = [];
    const pattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      dates.push(match[0]);
    }

    if (dates.length >= expectedCount) {
      candidates.push(dates);
    }
  }

  // Return the first candidate with enough values
  const first = candidates[0];
  return first ? first.slice(0, expectedCount) : [];
}

/**
 * Extract Yes/No values from a feature row in the RSC payload
 * (e.g., "Extended thinking" → ["Yes", "No", "Yes", ...]).
 * Uses a loose pattern to handle varying escape levels in RSC payload.
 */
function extractRSCFeatureYesNo(
  rscScripts: { textContent: string }[],
  featureName: string,
  expectedCount: number,
): string[] {
  const candidates: string[][] = [];

  for (const script of rscScripts) {
    const content = script.textContent;
    if (!content.includes(featureName)) continue;

    // Skip the current model table script (combines Max output + knowledge + training)
    if (content.includes("Max output")) continue;

    const values: string[] = [];
    // Find Yes/No after "children" near the feature name
    const featureIdx = content.indexOf(featureName);
    const chunk = content.slice(featureIdx, featureIdx + 3000);
    const pattern = /children[^a-z]*?(Yes|No)/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(chunk)) !== null) {
      const value = match[1];
      if (value) values.push(value);
    }

    if (values.length >= expectedCount) {
      candidates.push(values);
    }
  }

  const first = candidates[0];
  return first ? first.slice(0, expectedCount) : [];
}

function assembleModels(
  pricingByName: Map<string, PricingInfo>,
  deprecationInfo: DeprecationInfo[],
  modelDetails: ModelDetail[],
  nameToStableId: Map<string, string>,
): Model[] {
  // Group deprecation info by stable ID
  const deprecationByStableId = new Map<string, DeprecationInfo[]>();
  for (const dep of deprecationInfo) {
    if (!deprecationByStableId.has(dep.stableId)) {
      deprecationByStableId.set(dep.stableId, []);
    }
    deprecationByStableId.get(dep.stableId)?.push(dep);
  }

  // Build model detail lookup by stable ID
  const detailByStableId = new Map<string, ModelDetail>();
  for (const detail of modelDetails) {
    detailByStableId.set(detail.stableId, detail);
  }

  // Collect all stable IDs from the deprecations page (excludes retired models)
  const stableIds = new Set<string>();
  const deprecatedIds = new Set<string>();
  for (const dep of deprecationInfo) {
    stableIds.add(dep.stableId);
    if (dep.status === "Deprecated") {
      deprecatedIds.add(dep.stableId);
    }
  }

  const models: Model[] = [];

  for (const stableId of stableIds) {
    const detail = detailByStableId.get(stableId);
    const deps = deprecationByStableId.get(stableId) || [];

    const name = (detail?.name || stableIdToName(stableId)).replace(/\s*\(deprecated\)\s*$/, "");

    const pricing = findPricing(stableId, name, pricingByName, nameToStableId);
    if (!pricing) {
      console.warn(`  Skipping ${stableId}: no pricing found`);
      continue;
    }

    const context = detail?.context;
    const output = detail?.output;
    if (!context || !output) {
      console.warn(`  Skipping ${stableId}: missing context or output`);
      continue;
    }
    const knowledge = detail?.knowledge || "unknown";

    const releaseDate = deriveReleaseDate(stableId, deps);

    const snapshots = deps
      .filter((d) => d.isSnapshot)
      .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
      .map((d) => ({ id: d.id }));

    const family = deriveFamily(stableId);

    // These flags are not per-model on Anthropic's models page.
    // All active Anthropic models support these features.
    models.push({
      id: stableId,
      name,
      family,
      reasoning: detail?.reasoning ?? true,
      temperature: stableId === "claude-opus-4-7" ? false : true,
      tool_call: true,
      attachment: true,
      structured_output: true,
      open_weights: false,
      ...(deprecatedIds.has(stableId) ? { deprecated: true } : {}),
      limit: { context, output },
      modalities: {
        input: ["text", "image", "pdf"] as ModelModality[],
        output: ["text"] as ModelModality[],
      },
      pricing,
      knowledge,
      release_date: releaseDate,
      last_updated: releaseDate,
      ...(snapshots.length > 0 ? { snapshots } : {}),
    });
  }

  return models;
}

// ---------------------------------------------------------------------------
// Name ↔ ID mapping
// ---------------------------------------------------------------------------

function buildNameToIdMap(
  pricingByName: Map<string, PricingInfo>,
  deprecationInfo: DeprecationInfo[],
): Map<string, string> {
  const result = new Map<string, string>();

  const stableIds = new Set<string>();
  for (const dep of deprecationInfo) {
    stableIds.add(dep.stableId);
  }

  for (const name of pricingByName.keys()) {
    const stableId = modelNameToStableId(name, stableIds);
    if (stableId) {
      result.set(name, stableId);
    }
  }

  return result;
}

/**
 * Convert a display name like "Claude Opus 4.7" or "Claude Sonnet 3.7 (deprecated)"
 * to a stable ID like "claude-opus-4-7".
 */
function modelNameToStableId(name: string, knownStableIds: Set<string>): string | null {
  const clean = name.replace(/\s*\(deprecated\)\s*$/, "").trim();

  // Parse "Claude Xxx N.N" or "Claude Xxx N"
  const match = clean.match(/^Claude\s+(\w+)\s+(\d+)(?:\.(\d+))?$/);
  if (!match) return null;

  const tier = match[1]?.toLowerCase();
  const major = match[2];
  const minor = match[3] || "0";
  if (!tier || !major) return null;

  const stableId = `claude-${tier}-${major}-${minor}`;

  // Validate against known IDs or accept for 3.x models (may be retired)
  if (knownStableIds.has(stableId) || major === "3") return stableId;

  return stableId;
}

/**
 * Derive display name from stable ID.
 * "claude-opus-4-7" → "Claude Opus 4.7"
 * "claude-opus-4-0" → "Claude Opus 4"
 */
function stableIdToName(stableId: string): string {
  const match = stableId.match(/^claude-(\w+)-(\d+)-(\d+)$/);
  if (!match) return stableId;

  const tierRaw = match[1];
  const major = match[2];
  const minor = match[3];
  if (!tierRaw || !major || !minor) return stableId;

  const tier = tierRaw.charAt(0).toUpperCase() + tierRaw.slice(1);

  if (minor === "0") return `Claude ${tier} ${major}`;
  return `Claude ${tier} ${major}.${minor}`;
}

/**
 * Derive family from stable ID.
 * "claude-opus-4-7" → "claude-opus"
 */
function deriveFamily(stableId: string): string {
  const match = stableId.match(/^(claude-\w+)/);
  return match?.[1] ?? stableId;
}

// ---------------------------------------------------------------------------
// Pricing lookup
// ---------------------------------------------------------------------------

function findPricing(
  stableId: string,
  name: string,
  pricingByName: Map<string, PricingInfo>,
  nameToStableId: Map<string, string>,
): PricingInfo | null {
  // Try direct name match
  let pricing = pricingByName.get(name);
  if (pricing) return pricing;

  // Try matching by stable ID through the name map
  for (const [pricingName, pricingStableId] of nameToStableId) {
    if (pricingStableId === stableId) {
      pricing = pricingByName.get(pricingName);
      if (pricing) return pricing;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Release date derivation
// ---------------------------------------------------------------------------

function deriveReleaseDate(_stableId: string, deps: DeprecationInfo[]): string {
  const snapshotDep = deps.find((d) => d.isSnapshot);
  if (snapshotDep) return snapshotDep.releaseDate;

  const stableDep = deps.find((d) => !d.isSnapshot);
  if (stableDep) return stableDep.releaseDate;

  return "unknown";
}

function snapshotIdToDate(snapshotId: string): string {
  const match = snapshotId.match(/-(\d{4})(\d{2})(\d{2})$/);
  if (!match) return "unknown";
  const y = match[1];
  const m = match[2];
  const d = match[3];
  if (!y || !m || !d) return "unknown";
  return `${y}-${m}-${d}`;
}

function deriveReleaseDateFromRetirement(text: string): string {
  const match = text.match(/Not sooner than\s+(\w+)\s+(\d+),?\s+(\d{4})/);
  if (!match) return "unknown";

  const months: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthName = match[1];
  const dayStr = match[2];
  const yearStr = match[3];
  if (!monthName || !dayStr || !yearStr) return "unknown";

  const month = months[monthName];
  const day = parseInt(dayStr, 10);
  const year = parseInt(yearStr, 10) - 1;

  if (!month) return "unknown";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Value parsers
// ---------------------------------------------------------------------------

function parsePrice(text: string): number | null {
  const match = text.match(/\$?([\d.]+)/);
  const val = match?.[1];
  return val ? parseFloat(val) : null;
}

function parseTokenCount(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*([MK]?)\s*tokens?/i);
  if (!match) return null;
  const valStr = match[1];
  const unitStr = match[2];
  if (!valStr) return null;
  const value = parseFloat(valStr);
  const unit = (unitStr ?? "").toUpperCase();
  if (unit === "M") return value * 1_000_000;
  if (unit === "K") return value * 1_000;
  return value;
}

function parseKnowledgeDate(text: string): string | null {
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const match = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/);
  if (!match) return null;
  const year = match[2];
  const monthName = match[1];
  if (!year || !monthName) return null;
  const month = months[monthName];
  if (!month) return null;
  return `${year}-${month}`;
}

function toStableId(apiId: string): string | null {
  // Pattern 1: claude-opus-4-5-20251101 → claude-opus-4-5
  const match1 = apiId.match(/^(claude-\w+-\d+-\d+)-\d{8}$/);
  if (match1) return match1[1] ?? null;

  // Pattern 2: claude-opus-4-20250514 → claude-opus-4-0
  // (models with implicit minor version 0)
  const match2 = apiId.match(/^(claude-\w+)-(\d+)-\d{8}$/);
  if (match2) {
    const prefix = match2[1];
    const major = match2[2];
    if (prefix && major) return `${prefix}-${major}-0`;
  }

  // Pattern 3: claude-opus-4-7 → claude-opus-4-7 (already stable)
  if (/^claude-\w+-\d+-\d+$/.test(apiId)) return apiId;

  // Pattern 4: claude-opus-4 → claude-opus-4-0 (stable ID without minor)
  if (/^claude-\w+-\d+$/.test(apiId)) return `${apiId}-0`;

  return null;
}

function getFeatureValue(
  features: Map<string, string[]>,
  featureName: string,
  col: number,
): string {
  const values = features.get(featureName);
  return values?.[col]?.trim() || "";
}
