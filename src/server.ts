import health from "../src/routes/healthz/healthz.js";
import createServer from "./lib/createServer.js";
import OpenApiDocument from "./openapi/document.js";
import index from "./routes/index.js";
import users from "./routes/users/index.js";

const server = createServer();

const routes = [index, health, users];

OpenApiDocument(server);

routes.forEach((r) => {
  server.route("/", r);
});

export default server;
