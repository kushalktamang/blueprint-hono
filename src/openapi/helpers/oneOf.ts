import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import type { ZodSchema } from "./types.ts";

const oneOf = (schemas: ZodSchema[]) => {
  const registry = new OpenAPIRegistry();

  schemas.forEach((schema, index) => {
    registry.register(index.toString(), schema);
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const components = generator.generateComponents();

  const componentsSchemas = components.components?.schemas;

  return componentsSchemas === undefined ? [] : Object.values(componentsSchemas);
};

export default oneOf;
