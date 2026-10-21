import oneOf from "./oneOf.js";
import type { ZodSchema } from "./types.ts";

const jsonContentOneOf = (schemas: ZodSchema[], description: string) => {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(schemas),
        },
      },
    },
    description,
  };
};

export default jsonContentOneOf;
