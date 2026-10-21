import path from "path";

import { config } from "dotenv";
import type { ZodError } from "zod";
import { z } from "zod";

// load env files from only dev/test only
if (process.env.NODE_ENV !== "production") {
  const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  config({
    path: path.resolve(process.cwd(), envFile),
    quiet: true,
  });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8081),
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly", "silent"])
    .default("info"),
  DATABASE_URL: z.url(),
});

type env = z.infer<typeof envSchema>;

let env: env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  const err = error as ZodError;
  console.error("Invalid env:");
  console.error(z.flattenError(err).fieldErrors);
  process.exit(1);
}

export default env;
