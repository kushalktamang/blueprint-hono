import { z } from "@hono/zod-openapi";

const idParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 26,
  }),
});

export default idParamsSchema;
