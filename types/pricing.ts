/**
 * Model pricing data structures
 * Only records Standard model invocation pricing
 */

/** Tiered pricing by context length, ordered by up_to ascending */
export type ContextTierPrice = Array<{
  /** Upper bound (tokens). Omit for no upper bound (final tier) */
  up_to?: number;
  /** Whether the upper bound is inclusive. Default true (≤ up_to); false means < up_to */
  inclusive?: boolean;
  /** Price for this tier */
  price: number;
}>;

/** Modality types */
export type Modality = "text" | "image" | "video" | "audio" | "pdf";

/** Resolution types */
export type Resolution = "720p" | "1024p" | "1080p" | "2k" | "4k";

/** Per-modality price mapping */
export type ModalityPrice = Record<Modality, number | ContextTierPrice>;

/** Token price: fixed | tiered by context length | split by modality */
export type TokenPrice = number | ContextTierPrice | ModalityPrice;

/** Per-resolution price mapping */
export type ResolutionPrice = Record<Resolution, number>;

/** Currency */
export type Currency = "USD" | "CNY" | "EUR";

/** Token-based pricing (per million tokens) */
export type TokenPricing = {
  /** Currency, defaults to "USD" */
  currency?: Currency;
  /** Pricing unit, defaults to "per_mtok" */
  unit?: "per_mtok";
  /** Input price */
  input: TokenPrice;
  /** Output price */
  output: TokenPrice;
  /** Cache write price */
  cache_write?: TokenPrice;
  /** Cache read (hit) price */
  cache_read?: TokenPrice;
};

/** Video pricing (per second), optionally tiered by resolution */
export type VideoPricing = {
  /** Currency, defaults to "USD" */
  currency?: Currency;
  /** Pricing unit */
  unit: "per_second";
  /** Price (fixed or per-resolution) */
  price: number | ResolutionPrice;
};

/** Unit-based pricing (per image or per request) */
export type UnitPricing = {
  /** Currency, defaults to "USD" */
  currency?: Currency;
  /** Pricing unit */
  unit: "per_image" | "per_request";
  /** Price */
  price: number;
};

/** Free models (no cost) */
export type FreePricing = {
  unit: "free";
};

/** Model pricing union */
export type Pricing = TokenPricing | VideoPricing | UnitPricing | FreePricing;
