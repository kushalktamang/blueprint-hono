import { z } from "@hono/zod-openapi";

import type { ZodSchema } from "../helpers/types.js";

const issueSchema = z.object({
  code: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
});

const createErrorSchema = (schema: ZodSchema) => {
  const { error } = schema.safeParse(schema instanceof z.ZodArray ? ["invalid"] : {});

  const issues =
    error === undefined
      ? [{ code: "invalid_type", path: ["fieldName"], message: "Invalid input" }]
      : error.issues.map(({ code, path, message }) => ({
          code,
          path: path.filter((p): p is string | number => typeof p !== "symbol"),
          message,
        }));

  return z
    .object({
      success: z.literal(false),
      error: z.object({ issues: z.array(issueSchema) }),
    })
    .openapi({
      example: { success: false, error: { issues } },
    });
};

export default createErrorSchema;
