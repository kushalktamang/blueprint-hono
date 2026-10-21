import { createRouter } from "../../lib/createServer.js";
import * as handlers from "./usersHandler.js";
import * as routes from "./usersRoute.js";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
