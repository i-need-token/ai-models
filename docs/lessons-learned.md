**English** | [中文](./zh/lessons-learned.md)

# Design Principles & Pitfalls

Lessons learned from building and maintaining AI model catalogs. Each pitfall describes a general pattern that can recur, not a one-time bug.

## Architecture

### Scrape Functions Must Be Pure Data Functions

**Pitfall**: Mixing data fetching, transformation, and file I/O in a single function.

**Problems**: No clear return type, hard to test, hard to compose, file writing logic duplicated across providers.

**Principle**: Scrape functions return structured data (`{ provider, models }`). A single orchestration script handles all file I/O. This separates "getting data" from "persisting data" and makes scrapers testable without touching the filesystem.

### Model Discovery Must Be Dynamic

**Pitfall**: Hardcoding model ID lists in scrape functions.

**Problems**: New models don't appear until a human updates the list. Removed models linger until manually deleted. Defeats the purpose of automated data acquisition.

**Principle**: Every scrape function must include a **discovery step** that fetches the model list from the provider's data source. Only filtering rules (prefixes, exclude patterns) may be hardcoded — never model IDs themselves.

### Data Must Come from First-Party Sources

**Pitfall**: Copying data from third-party aggregators (e.g., models.dev, OpenRouter model cards for other providers).

**Problems**: Third-party data can be outdated, inaccurate, or incomplete. No direct accountability — errors can't be traced to the provider's own documentation.

**Principle**: All data must come from the provider's own API, website, or official documentation. No copying from third-party aggregators.

## Data Integrity

### Never Fabricate Missing Data

**Pitfall**: Using fallback values when model data is missing (e.g., `detail?.context || 200_000`).

**Problems**: Models with missing data appear in the catalog with fake values. No way to detect which models have incomplete data. Undermines data integrity — consumers trust the values.

**Principle**: When required data is missing, skip the model entirely and log a warning. It's better to have fewer models with accurate data than more models with guessed data.

### Include Deprecated Models, Exclude Retired Models

**Pitfall**: Excluding deprecated models entirely from the catalog.

**Problems**: Users still using deprecated models can't find them. No way to distinguish "not in catalog" from "deprecated but accessible via API".

**Principle**: Deprecated models (still accessible, not recommended) are included with `deprecated: true`. Retired models (no longer accessible) are excluded. This keeps the catalog complete while signaling status.

### Extract Feature Flags from Data Sources When Possible

**Pitfall**: Hardcoding capability flags (e.g., `reasoning: true`) for all models.

**Problems**: If a future model doesn't support a feature, it would be incorrectly flagged. Violates the first-party data principle.

**Principle**: Extract feature flags from the data source where available. When the source doesn't expose per-model features, hardcode with a documented known limitation.

## HTML Parsing

### Scope Searches to Card Boundaries

**Pitfall**: Searching for attributes (like "Deprecated") within a fixed character window around a model link.

**Problems**: Adjacent cards' attributes leak into the search window, causing false positives. The window size is arbitrary and fragile.

**Principle**: Always scope searches to the current card element. Find the card boundary (e.g., the `<a>` tag that starts the card, up to its closing `</a>`) and only search within that boundary.

### Use Specific 404 Detection

**Pitfall**: Searching for "404" anywhere in the HTML to detect missing pages.

**Problems**: "404" appears in unrelated content (e.g., rate limit docs mentioning "404 errors"). Valid pages incorrectly treated as missing.

**Principle**: Check the `<title>` tag for "Page not found" or similar, not search the entire HTML for "404".

### Scope Deprecated Detection to Model Header

**Pitfall**: Checking for "Deprecated" anywhere on a model's detail page.

**Problems**: Individual snapshots can be deprecated while the model itself is still active. The scraper can't distinguish "model is deprecated" from "model has deprecated snapshots".

**Principle**: Only check the model header section (before the "Snapshots" section) for deprecated badges. Snapshot-level deprecation is tracked separately in each snapshot entry.

### Use Feature Sections, Not Generic String Matching

**Pitfall**: Detecting capabilities by checking `html.includes("reasoning.effort")` or similar generic strings.

**Problems**: Navigation links, search text, and unrelated content match the string. Non-reasoning models incorrectly flagged.

**Principle**: Use the structured feature section of the page. Check for specific feature names in the feature list pattern.

### Extract All Matches, Not Just the First

**Pitfall**: Using `html.match(pattern)` which only returns the first match.

**Problems**: When extracting repeated structures (e.g., snapshots, pricing tiers), only the first one is captured. The rest are silently dropped.

**Principle**: Use `matchAll` or a global regex loop to extract all occurrences.

## Schema Design

### Keep Modality Types Synchronized

**Pitfall**: Adding a modality to `ModelModality` but forgetting to update `Modality` in `pricing.ts` and `ModalitySchema` in `schemas.ts`.

**Problems**: Type system inconsistency. Per-modality pricing can't be expressed for the new modality.

**Principle**: When adding new modalities to `ModelModality`, always check if `Modality` in `pricing.ts` and `ModalitySchema` in `schemas.ts` need updating too.

### Make Fields Optional When Not All Model Types Have Them

**Pitfall**: Making `limit`, `knowledge`, or capability fields required in the schema.

**Problems**: Image, embedding, and moderation models don't have context windows or knowledge cutoffs. The schema can't represent these model types.

**Principle**: Make fields optional when they don't apply to all model types. The `Pricing` union type should have variants for all pricing structures (token, per-image, per-second, free).

### Family Is a Broad Grouping, Not a Versioned Name

**Pitfall**: Including version numbers in family names (e.g., `gpt-5-codex` instead of `gpt-codex`).

**Problems**: Family becomes too granular — different generations of the same variant end up in separate families. The grouping loses its purpose as a broad category.

**Principle**: Family represents a broad lineage, not a specific generation. Strip version numbers when deriving family (e.g., `gpt-5-codex` → `gpt-codex`, `claude-opus-4` → `claude-opus`). Display names should match the provider's official capitalization.

## Data Format

### YAML Over JSON for Human-Editable Data

**Pitfall**: Using JSON for model data files.

**Problems**: JSON is less human-readable, doesn't support comments, and is more verbose.

**Principle**: Use YAML as the source format — more readable, supports comments, and is equally machine-parseable.

### Snapshots with Inheritance, Not Duplication

**Pitfall**: Each dated model ID as a separate file with full duplicated data.

**Problems**: Massive data duplication. No way to know which snapshot is current. Updating shared fields requires editing every snapshot file.

**Principle**: Model ID is the stable name. Snapshots are nested within the model file with inheritance — only differing fields need to be specified.
