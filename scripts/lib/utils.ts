import type { Model, Provider } from "../../types/index";
import { ModelSchema, ProviderSchema } from "../../types/schemas";

/**
 * Define a provider with runtime Zod validation.
 * Returns the original data (typed by TS), validates at runtime via Zod.
 */
export function defineProvider(data: Provider): Provider {
  ProviderSchema.parse(data);
  return data;
}

/**
 * Define a model with runtime Zod validation.
 * Returns the original data (typed by TS), validates at runtime via Zod.
 */
export function defineModel(data: Model): Model {
  ModelSchema.parse(data);
  return data;
}
