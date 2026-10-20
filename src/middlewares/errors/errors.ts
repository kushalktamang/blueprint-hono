import type { ErrorHandler } from "hono";
import type { NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../assets/status-code/httpStatusCode.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../../assets/status-code/httpStatusPhrases.js";
import env from "../../config/envConfig.js";
import logger from "../../config/logger.js";

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND,
  );
};

const onError: ErrorHandler = (err, c) => {
  const status: ContentfulStatusCode =
    err instanceof HTTPException ? err.status : INTERNAL_SERVER_ERROR;
  const isServerError = status >= INTERNAL_SERVER_ERROR;
  const isProduction = env.NODE_ENV === "production";

  logger[isServerError ? "error" : "warn"](err.message, {
    status,
    method: c.req.method,
    path: c.req.path,
    stack: err.stack,
  });

  return c.json(
    {
      message: isServerError && isProduction ? "Internal Server Error" : err.message,
      stack: isProduction ? undefined : err.stack,
    },
    status,
  );
};

export { notFound, onError };
