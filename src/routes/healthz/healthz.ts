import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import { createRouter } from "../../lib/createServer.js";
import jsonContent from "../../openapi/helpers/jsonContent.js";
import createMessageObjectSchema from "../../openapi/schemas/createMessageObject.js";

const router = createRouter().openapi(
  createRoute({
    tags: ["Health"],
    method: "get",
    path: "/healthz",
    summary: "Health Check",
    responses: {
      [HttpStatusCode.OK]: jsonContent(createMessageObjectSchema("OK"), "Health Check"),
    },
  }),
  (c) => {
    return c.json({ message: "OK" }, HttpStatusCode.OK);
  },
);

export default router;
