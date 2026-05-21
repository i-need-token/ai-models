import { z } from "zod";

// ==================== pricing.ts ====================

export const ContextTierPriceSchema = z.array(
  z.object({
    up_to: z.number().optional(),
    inclusive: z.boolean().optional(),
    price: z.number(),
  }),
);

export const ModalitySchema = z.enum(["text", "image", "video", "audio", "pdf"]);

export const ModalityPriceSchema = z.record(
  ModalitySchema,
  z.union([z.number(), ContextTierPriceSchema]),
);

export const TokenPriceSchema = z.union([z.number(), ContextTierPriceSchema, ModalityPriceSchema]);

export const ResolutionSchema = z.enum(["720p", "1024p", "1080p", "2k", "4k"]);

export const ResolutionPriceSchema = z.record(ResolutionSchema, z.number());

export const CurrencySchema = z.enum(["USD", "CNY", "EUR"]);

export const TokenPricingSchema = z.object({
  currency: CurrencySchema.optional(),
  unit: z.literal("per_mtok").optional(),
  input: TokenPriceSchema,
  output: TokenPriceSchema,
  cache_write: TokenPriceSchema.optional(),
  cache_read: TokenPriceSchema.optional(),
});

export const VideoPricingSchema = z.object({
  currency: CurrencySchema.optional(),
  unit: z.literal("per_second"),
  price: z.union([z.number(), ResolutionPriceSchema]),
});

export const UnitPricingSchema = z.object({
  currency: CurrencySchema.optional(),
  unit: z.enum(["per_image", "per_request"]),
  price: z.number(),
});

export const FreePricingSchema = z.object({
  unit: z.literal("free"),
});

export const PricingSchema = z.union([
  TokenPricingSchema,
  VideoPricingSchema,
  UnitPricingSchema,
  FreePricingSchema,
]);

// ==================== model.ts ====================

export const ModelModalitySchema = z.enum(["text", "image", "video", "audio", "pdf"]);

const LimitSchema = z.object({
  context: z.number(),
  output: z.number(),
});

const ModalitiesSchema = z.object({
  input: z.array(ModelModalitySchema),
  output: z.array(ModelModalitySchema),
});

export const SnapshotSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  family: z.string().optional(),
  reasoning: z.boolean().optional(),
  temperature: z.boolean().optional(),
  tool_call: z.boolean().optional(),
  attachment: z.boolean().optional(),
  structured_output: z.boolean().optional(),
  open_weights: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  pricing: PricingSchema.optional(),
  limit: LimitSchema.optional(),
  modalities: ModalitiesSchema.optional(),
  knowledge: z.string().optional(),
  release_date: z.string().optional(),
  last_updated: z.string().optional(),
});

export const ModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  family: z.string(),
  reasoning: z.boolean().optional(),
  temperature: z.boolean().optional(),
  tool_call: z.boolean().optional(),
  attachment: z.boolean().optional(),
  structured_output: z.boolean().optional(),
  open_weights: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  pricing: PricingSchema,
  limit: LimitSchema.optional(),
  modalities: ModalitiesSchema,
  knowledge: z.string().optional(),
  release_date: z.string().optional(),
  last_updated: z.string(),
  snapshots: z.array(SnapshotSchema).optional(),
});

// ==================== provider.ts ====================

export const ApiFormatSchema = z.enum(["openai", "anthropic", "google"]);

export const ApiEndpointsSchema = z.object({
  openai: z.string().optional(),
  anthropic: z.string().optional(),
  google: z.string().optional(),
});

export const ProviderGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  models: z.array(ModelSchema),
});

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  api_docs: z.string().optional(),
  apis: ApiEndpointsSchema,
  currency: CurrencySchema.optional(),
  models: z.array(ModelSchema).optional(),
  groups: z.array(ProviderGroupSchema).optional(),
});
