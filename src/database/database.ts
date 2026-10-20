import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import env from "../config/envConfig.js";
import { relations } from "./relations.js";

const client = neon(env.DATABASE_URL);
const db = drizzle({ client, relations });

export default db;
