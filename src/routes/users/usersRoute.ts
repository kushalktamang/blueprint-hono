import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import { insertUserSchema, patchUserSchema, selectUserSchema } from "../../database/schema.js";
import { notFoundSchema } from "../../lib/constants.js";
import jsonContent from "../../openapi/helpers/jsonContent.js";
import jsonContentOneOf from "../../openapi/helpers/jsonContentOneOf.js";
import jsonContentRequired from "../../openapi/helpers/jsonContentRequired.js";
import createErrorSchema from "../../openapi/schemas/createErrorSchema.js";
import idParamsSchema from "../../openapi/schemas/idParams.js";

export const list = createRoute({
  tags: ["Users"],
  method: "get",
  path: "/users",
  summary: "Get All Users",
  responses: {
    [HttpStatusCode.OK]: jsonContent(z.array(selectUserSchema), "Get All Users data"),
  },
});

export const create = createRoute({
  tags: ["Users"],
  method: "post",
  path: "/users",
  summary: "Create a User",
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

export const getOne = createRoute({
  tags: ["Users"],
  method: "get",
  path: "/users/{id}",
  summary: "Get One User",
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

export const patch = createRoute({
  tags: ["Users"],
  method: "patch",
  path: "/users/{id}",
  summary: "Update User Data",
  request: {
    params: idParamsSchema,
    body: jsonContentRequired(patchUserSchema, "User Updated"),
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(selectUserSchema, "Update User"),
    [HttpStatusCode.NOT_FOUND]: jsonContent(notFoundSchema, "User not Found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(patchUserSchema), createErrorSchema(idParamsSchema)],
      "Invalid Id Error",
    ),
  },
});

export const remove = createRoute({
  tags: ["Users"],
  method: "delete",
  path: "/users/{id}",
  summary: "Remove User",
  request: {
    params: idParamsSchema,
  },
  responses: {
    [HttpStatusCode.NO_CONTENT]: { description: "User Deleted" },
    [HttpStatusCode.NOT_FOUND]: jsonContent(notFoundSchema, "User not Found"),
    [HttpStatusCode.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(idParamsSchema),
      "Invalid Id Error",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type DeleteRoute = typeof remove;
