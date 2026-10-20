import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

import type logger from "../config/logger.js";

type ServerBindings = {
  Variables: { logger: typeof logger; requestId: string };
};

type ServerOpenAPI = OpenAPIHono<ServerBindings>;

type ServerRouteHandler<R extends RouteConfig> = RouteHandler<R, ServerBindings>;

export type { ServerBindings, ServerOpenAPI, ServerRouteHandler };
