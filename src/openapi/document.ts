import { Scalar } from "@scalar/hono-api-reference";

import packageJson from "../../package.json" with { type: "json" };
import type { ServerOpenAPI } from "../types/types.js";

function OpenApiDocument(server: ServerOpenAPI) {
  server.doc("/docs", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Blueprint Hono",
    },
  });

  server.get(
    "/reference",
    Scalar({
      layout: "modern",
      url: "/docs",
      defaultHttpClient: { targetKey: "node", clientKey: "fetch" },
    }),
  );
}

export default OpenApiDocument;
