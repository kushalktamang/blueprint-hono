import type { OpenAPIHono } from "@hono/zod-openapi";

import type logger from "../config/logger.js";

type ServerBindings = {
  Variables: { logger: typeof logger; requestId: string };
};

type ServerOpenAPI = OpenAPIHono<ServerBindings>;

export type { ServerBindings, ServerOpenAPI };
