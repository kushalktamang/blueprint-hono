import { OpenAPIHono } from "@hono/zod-openapi";

import log from "./config/logger.js";
import { notFound, onError } from "./middlewares/errors/errors.js";

const server = new OpenAPIHono();

server.get("/", (c) => {
  log.info("server is running");
  return c.text("working");
});

server.notFound(notFound);
server.onError(onError);

export default server;
