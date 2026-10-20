import type { Hook } from "@hono/zod-openapi";
import type { Env } from "hono";

import { UNPROCESSABLE_ENTITY } from "../assets/status-code/httpStatusCode.js";

const defaultHook = <E extends Env>(
  ...[result, c]: Parameters<Hook<unknown, E, string, unknown>>
) => {
  if (result.success) {
    return undefined;
  }

  return c.json(
    {
      success: false as const,
      error: { issues: result.error.issues },
    },
    UNPROCESSABLE_ENTITY,
  );
};

export default defaultHook;
