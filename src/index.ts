import { serve } from "@hono/node-server";

import env from "./config/envConfig.js";
import logger from "./config/logger.js";
import server from "./server.js";

const { PORT: port } = env;

serve(
  {
    fetch: server.fetch,
    port,
  },
  (info) => {
    logger.info(`Server is running on http://localhost:${info.port}`);
  },
);
