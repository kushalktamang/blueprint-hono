import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";

import logger from "./config/logger.js";
import { notFound, onError } from "./middlewares/errors/errors.js";
import type { AppBindings } from "./types/types.js";

const server = new OpenAPIHono<AppBindings>();

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

server.get("/", (c) => {
  c.var.logger.info("work");
  return c.text("working");
});

server.get("/error", (c) => {
  c.status(422);
  c.var.logger.error("its an error");
  throw new Error("its an error");
});

server.notFound(notFound);
server.onError(onError);

export default server;
