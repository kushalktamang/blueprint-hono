import { serve } from "@hono/node-server";

import env from "./config/env-config.js";
import server from "./server.js";

const port = Math.trunc(Number(env.PORT));

serve(
  {
    fetch: server.fetch,
    port,
  },
  (info) => {
    // oxlint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
