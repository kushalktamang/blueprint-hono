import { z } from "@hono/zod-openapi";

const validators = {
  uuid: { schema: () => z.uuid(), example: "4651e634-a530-4484-9b09-9616a28f35e3" },
  nanoid: { schema: () => z.nanoid(), example: "V1StGXR8_Z5jdHi6B-myT" },
  cuid2: { schema: () => z.cuid2(), example: "tz4a98xxat96iws9zmbrgj3a" },
  ulid: { schema: () => z.ulid(), example: "01ARZ3NDEKTSV4RRFFQ69G5FAV" },
} as const;

type Validator = keyof typeof validators;

interface ParamsSchemaOptions<N extends string> {
  name?: N;
  validator?: Validator;
}

const getParamsSchema = <N extends string = "id">({
  name,
  validator = "uuid",
}: ParamsSchemaOptions<N> = {}) => {
  const key = name ?? "id";
  const { schema, example } = validators[validator];
  const field = schema().openapi({
    param: { name: key, in: "path", required: true },
    example,
  });

  return z.object({ [key]: field } as Record<N, typeof field>);
};

export default getParamsSchema;
