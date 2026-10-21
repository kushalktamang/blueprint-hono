import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import { insertUserSchema, selectUserSchema } from "../../database/schema.js";
import { notFoundSchema } from "../../lib/constants.js";
import jsonContent from "../../openapi/helpers/jsonContent.js";
import jsonContentRequired from "../../openapi/helpers/jsonContentRequired.js";
import createErrorSchema from "../../openapi/schemas/createErrorSchema.js";
import idParamsSchema from "../../openapi/schemas/idParams.js";

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

export const getUser = createRoute({
  tags: ["Users"],
  method: "get",
  path: "/users/{id}",
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(selectUserSchema, "Get A User"),
    [HttpStatusCode.NOT_FOUND]: jsonContent(notFoundSchema, "User not Found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idParamsSchema),
      "Invalid Id Error",
    ),
  },
});

export type UserRoute = typeof getAllUsers;
export type CreateRoute = typeof createUsers;
export type getUserRoute = typeof getUser;
