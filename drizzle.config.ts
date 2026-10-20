import { defineConfig } from "drizzle-kit";

import env from "./src/config/envConfig.js";

export default defineConfig({
  out: "./src/database/migrations",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
