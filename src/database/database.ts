import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import env from "../config/envConfig.js";

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql });

export default db;
