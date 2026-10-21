import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCode from "../assets/status-code/httpStatusCode.js";
import { createRouter } from "../lib/createServer.js";
import jsonContent from "../openapi/helpers/jsonContent.js";
import createMessageObjectSchema from "../openapi/schemas/createMessageObject.js";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    summary: "Index",
    responses: {
      [HttpStatusCode.OK]: jsonContent(
        createMessageObjectSchema("Hono Api"),
        "Blueprint Hono Index",
      ),
    },
  }),
  (c) => {
    return c.json({ message: "Blueprint Hono Server" }, HttpStatusCode.OK);
  },
);

export default router;
