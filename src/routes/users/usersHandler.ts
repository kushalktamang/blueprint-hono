import { eq } from "drizzle-orm";

import * as HttpStatusCode from "../../assets/status-code/httpStatusCode.js";
import * as HttpStatusPhrases from "../../assets/status-code/httpStatusPhrases.js";
import db from "../../database/database.js";
import { users } from "../../database/schema.js";
import type { ServerRouteHandler } from "../../types/types.js";
import type { ListRoute, CreateRoute, GetOneRoute, PatchRoute, DeleteRoute } from "./usersRoute.js";

export const list: ServerRouteHandler<ListRoute> = async (c) => {
  const rows = await db.query.users.findMany();
  return c.json(rows);
};

export const create: ServerRouteHandler<CreateRoute> = async (c) => {
  const user = c.req.valid("json");
  const [insert] = await db.insert(users).values(user).returning();
  return c.json(insert, HttpStatusCode.OK);
};

export const getOne: ServerRouteHandler<GetOneRoute> = async (c) => {
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

export const patch: ServerRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const update = c.req.valid("json");
  const [user] = await db.update(users).set(update).where(eq(users.id, id)).returning();

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

export const remove: ServerRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });

  if (deleted === undefined) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCode.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCode.NO_CONTENT);
};
