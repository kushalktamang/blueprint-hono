import { integer, snakeCase, timestamp, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-orm/zod";
import { z } from "zod";

export const users = snakeCase.table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users, {
  name: (s) => s.trim().min(1),
  email: z.email().max(255).toLowerCase(),
}).omit({
  createdAt: true,
  updatedAt: true,
});
