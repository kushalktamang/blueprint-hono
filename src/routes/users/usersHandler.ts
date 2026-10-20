import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import db from "../../database/database.js";
import { users } from "../../database/schema.js";
import type { ServerRouteHandler } from "../../types/types.js";
import type { UserRoute, CreateRoute } from "./usersRoute.js";

export const getAllUsers: ServerRouteHandler<UserRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCode.OK);
};

export const createUsers: ServerRouteHandler<CreateRoute> = async (c) => {
  const user = c.req.valid("json");
  const [insert] = await db.insert(users).values(user).returning();
  return c.json(insert, HttpStatusCode.OK);
};
