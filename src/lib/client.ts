// This can be used in the client side 
import { hc } from "hono/client";

import type { ServerType } from "../server.js";

const client = hc<ServerType>("http://localhost:5173");

export default client;
