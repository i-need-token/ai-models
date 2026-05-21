import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { ModelSchema } from "../types/schemas";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

interface Stats {
  providers: number;
  modelFiles: number;
  uniqueModelIds: Set<string>;
  families: Set<string>;
  reasoning: number;
  toolCall: number;
  structuredOutput: number;
  openWeights: number;
  free: number;
  vision: number;
  imageOutput: number;
  audioInput: number;
  audioOutput: number;
  videoInput: number;
}

function computeStats(): Stats {
  const providersDir = path.join(PROJECT_ROOT, "providers");
  const providerDirs = fs
    .readdirSync(providersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(providersDir, name, "models")));

  const stats: Stats = {
    providers: providerDirs.length,
    modelFiles: 0,
    uniqueModelIds: new Set(),
    families: new Set(),
    reasoning: 0,
    toolCall: 0,
    structuredOutput: 0,
    openWeights: 0,
    free: 0,
    vision: 0,
    imageOutput: 0,
    audioInput: 0,
    audioOutput: 0,
    videoInput: 0,
  };

  for (const providerId of providerDirs) {
    const modelsDir = path.join(providersDir, providerId, "models");
    const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".yaml"));

    for (const file of files) {
      stats.modelFiles++;
      const raw = fs.readFileSync(path.join(modelsDir, file), "utf-8");
      const data = YAML.parse(raw);
      const result = ModelSchema.safeParse(data);
      if (!result.success) continue;

      const model = result.data;
      stats.uniqueModelIds.add(model.id);
      if (model.family) stats.families.add(model.family);
      if (model.reasoning) stats.reasoning++;
      if (model.tool_call) stats.toolCall++;
      if (model.structured_output) stats.structuredOutput++;
      if (model.open_weights) stats.openWeights++;

      // Check pricing for free models
      if (model.pricing) {
        const p = model.pricing as Record<string, unknown>;
        if (p["unit"] === "free") stats.free++;
      }

      // Check modalities
      if (model.modalities) {
        const input = model.modalities.input ?? [];
        const output = model.modalities.output ?? [];
        if (input.includes("image")) stats.vision++;
        if (output.includes("image")) stats.imageOutput++;
        if (input.includes("audio")) stats.audioInput++;
        if (output.includes("audio")) stats.audioOutput++;
        if (input.includes("video")) stats.videoInput++;
      }
    }
  }

  return stats;
}

function main(): void {
  const stats = computeStats();

  const format = process.argv[2] ?? "table";

  if (format === "json") {
    console.log(
      JSON.stringify(
        {
          providers: stats.providers,
          model_files: stats.modelFiles,
          unique_model_ids: stats.uniqueModelIds.size,
          families: stats.families.size,
          reasoning: stats.reasoning,
          tool_call: stats.toolCall,
          structured_output: stats.structuredOutput,
          open_weights: stats.openWeights,
          free: stats.free,
          vision: stats.vision,
          image_output: stats.imageOutput,
          audio_input: stats.audioInput,
          audio_output: stats.audioOutput,
          video_input: stats.videoInput,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("📊 AI Models Catalog Stats\n");
  console.log(`Providers:             ${stats.providers}`);
  console.log(`Model files:           ${stats.modelFiles}`);
  console.log(`Unique model IDs:      ${stats.uniqueModelIds.size}`);
  console.log(`Model families:        ${stats.families.size}`);
  console.log(`Reasoning models:      ${stats.reasoning}`);
  console.log(`Tool-calling models:   ${stats.toolCall}`);
  console.log(`Structured output:     ${stats.structuredOutput}`);
  console.log(`Open-weight models:    ${stats.openWeights}`);
  console.log(`Free models:           ${stats.free}`);
  console.log(`Vision (image input):  ${stats.vision}`);
  console.log(`Image output:          ${stats.imageOutput}`);
  console.log(`Audio input:           ${stats.audioInput}`);
  console.log(`Audio output:          ${stats.audioOutput}`);
  console.log(`Video input:           ${stats.videoInput}`);
}

main();
