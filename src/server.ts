import index from "../src/routes/indexRoute.js";
import createServer from "./lib/createServer.js";
import OpenApiDocument from "./openapi/document.js";

const server = createServer();

const routes = [index];

OpenApiDocument(server);

routes.forEach((r) => {
  server.route("/", r);
});

export default server;
