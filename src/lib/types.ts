import type logger from "../config/logger.js";

export type AppBindings = {
  Variables: { logger: typeof logger; requestId: string };
};
