import { createRouter } from "../../lib/createServer.js";
import * as handlers from "./usersHandler.js";
import * as routes from "./usersRoute.js";

const router = createRouter()
  .openapi(routes.getAllUsers, handlers.getAllUsers)
  .openapi(routes.createUsers, handlers.createUsers);

export default router;
