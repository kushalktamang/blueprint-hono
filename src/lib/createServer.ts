import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";

import logger from "../config/logger.js";
import { notFound, onError } from "../middlewares/errors/errors.js";
import defaultHook from "../openapi/defaultHook.js";
import type { ServerBindings } from "../types/types.js";

export function createRouter() {
  return new OpenAPIHono<ServerBindings>({
    strict: false,
    defaultHook,
  });
}

function createServer() {
  const server = createRouter();

  server.use("*", requestId());
  server.use("*", async (c, next) => {
    const log = logger.child({ requestId: c.get("requestId") });
    c.set("logger", log);

    const start = performance.now();
    await next();

    const status = c.res.status;
    log[status >= 500 ? "error" : status >= 400 ? "warn" : "info"]("Request completed", {
      method: c.req.method,
      path: c.req.path,
      status,
      latencyMs: Math.round(performance.now() - start),
    });
  });

  server.notFound(notFound);
  server.onError(onError);

  return server;
}
export default createServer;
