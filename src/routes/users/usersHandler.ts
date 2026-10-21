import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import * as HttpStatusPhrases from "../../assets/status-code/httpStatusPhrases.js";
import db from "../../database/database.js";
import { users } from "../../database/schema.js";
import type { ServerRouteHandler } from "../../types/types.js";
import type { UserRoute, CreateRoute, getUserRoute } from "./usersRoute.js";

export const getAllUsers: ServerRouteHandler<UserRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users, HttpStatusCode.OK);
};

export const createUsers: ServerRouteHandler<CreateRoute> = async (c) => {
  const user = c.req.valid("json");
  const [insert] = await db.insert(users).values(user).returning();
  return c.json(insert, HttpStatusCode.OK);
};

export const getUser: ServerRouteHandler<getUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const user = await db.query.users.findFirst({
    where: { id },
  });

  if (user === undefined) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCode.NOT_FOUND,
    );
  }

  return c.json(user, HttpStatusCode.OK);
};
