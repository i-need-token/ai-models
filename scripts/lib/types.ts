import type { Model, Provider } from "../../types/index";

export interface ScrapeResult {
  provider: Provider;
  models: Model[];
}
