import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import { insertUserSchema, selectUserSchema } from "../../database/schema.js";
import jsonContent from "../../openapi/helpers/jsonContent.js";
import jsonContentRequired from "../../openapi/helpers/jsonContentRequired.js";
import createErrorSchema from "../../openapi/schemas/createErrorSchema.js";

export const getAllUsers = createRoute({
  tags: ["Users"],
  method: "get",
  path: "/users",
  responses: {
    [HttpStatusCode.OK]: jsonContent(z.array(selectUserSchema), "Get All Users data"),
  },
});

export const createUsers = createRoute({
  tags: ["Users"],
  method: "post",
  path: "/users",
  request: {
    body: jsonContentRequired(insertUserSchema, "User created"),
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(selectUserSchema, "Create A User"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "Validation Error",
    ),
  },
});

export type UserRoute = typeof getAllUsers;
export type CreateRoute = typeof createUsers;
