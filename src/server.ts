import { HTTPException } from "hono/http-exception";

import env from "./config/env-config.js";
import createServer from "./lib/create-server.js";

const server = createServer();

server.get("/", (c) => {
  c.var.logger.info("buleprint hono is working fine");
  return c.text("Blueprint Hono");
});

if (env.NODE_ENV !== "production") {
  server.get("/error", (c) => {
    c.var.logger.debug("only show error when debug level is enabled");
    throw new HTTPException(422, { message: "its an error" });
  });
}

export default server;
