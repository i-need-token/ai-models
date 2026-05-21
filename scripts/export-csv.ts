import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { ModelSchema } from "../types/schemas";

const providersDir = "providers";

interface FlatModel {
  id: string;
  name: string;
  provider: string;
  family: string;
  deprecated: boolean;
  reasoning: boolean;
  tool_call: boolean;
  structured_output: boolean;
  open_weights: boolean;
  context_window: number | undefined;
  max_output: number | undefined;
  input_modalities: string;
  output_modalities: string;
  pricing_type: string;
  input_price: number | undefined;
  output_price: number | undefined;
  image_input_price: number | undefined;
  image_output_price: number | undefined;
  cached_input_price: number | undefined;
}

const models: FlatModel[] = [];

for (const provider of fs.readdirSync(providersDir)) {
  const mDir = path.join(providersDir, provider, "models");
  if (!fs.existsSync(mDir)) continue;
  for (const f of fs.readdirSync(mDir).filter((f) => f.endsWith(".yaml"))) {
    const raw = fs.readFileSync(path.join(mDir, f), "utf-8");
    const data = YAML.parse(raw);
    const r = ModelSchema.safeParse(data);
    if (!r.success) continue;
    const m = r.data;

    const pr = m.pricing as Record<string, unknown> | undefined;
    let pricingType = "unknown";
    let inputPrice: number | undefined;
    let outputPrice: number | undefined;
    let imageInputPrice: number | undefined;
    let imageOutputPrice: number | undefined;
    let cachedInputPrice: number | undefined;

    if (pr) {
      pricingType = (pr["type"] as string) ?? "token";
      if (pricingType === "token") {
        inputPrice = pr["input"] as number | undefined;
        outputPrice = pr["output"] as number | undefined;
        imageInputPrice = pr["image_input"] as number | undefined;
        imageOutputPrice = pr["image_output"] as number | undefined;
        cachedInputPrice = pr["cached_input"] as number | undefined;
      }
    }

    models.push({
      id: m.id,
      name: m.name ?? m.id,
      provider,
      family: m.family ?? "",
      deprecated: m.deprecated ?? false,
      reasoning: m.reasoning ?? false,
      tool_call: m.tool_call ?? false,
      structured_output: m.structured_output ?? false,
      open_weights: m.open_weights ?? false,
      context_window: m.limit?.context,
      max_output: m.limit?.output,
      input_modalities: (m.modalities?.input ?? []).join(";"),
      output_modalities: (m.modalities?.output ?? []).join(";"),
      pricing_type: pricingType,
      input_price: inputPrice,
      output_price: outputPrice,
      image_input_price: imageInputPrice,
      image_output_price: imageOutputPrice,
      cached_input_price: cachedInputPrice,
    });
  }
}

function escapeCsv(val: unknown): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

const header = [
  "id",
  "name",
  "provider",
  "family",
  "deprecated",
  "reasoning",
  "tool_call",
  "structured_output",
  "open_weights",
  "context_window",
  "max_output",
  "input_modalities",
  "output_modalities",
  "pricing_type",
  "input_price",
  "output_price",
  "image_input_price",
  "image_output_price",
  "cached_input_price",
];

const rows = models.map((m) => header.map((k) => escapeCsv(m[k as keyof FlatModel])).join(","));

const csv = [header.join(","), ...rows].join("\n");

fs.writeFileSync("models.csv", csv);
console.log(`Wrote ${models.length} models to models.csv`);
