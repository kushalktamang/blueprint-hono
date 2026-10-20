import health from "../src/routes/healthz/healthz.js";
import index from "../src/routes/indexRoute.js";
import createServer from "./lib/createServer.js";
import OpenApiDocument from "./openapi/document.js";

const server = createServer();

const routes = [index, health];

OpenApiDocument(server);

routes.forEach((r) => {
  server.route("/", r);
});

export default server;
