import type { ErrorHandler } from "hono";
import type { NotFoundHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } from "../../assets/status-code/http-status-code.js";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../../assets/status-code/http-status-phrases.js";
import env from "../../config/env-config.js";

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND,
  );
};

const getErrorStatus = (err: Error) => {
  if ("status" in err && typeof err.status === "number") {
    return err.status;
  }
  return INTERNAL_SERVER_ERROR;
};

const onError: ErrorHandler = (err, c) => {
  const currentStatus = getErrorStatus(err);
  let statusCode: ContentfulStatusCode;
  if (currentStatus === OK) {
    statusCode = INTERNAL_SERVER_ERROR;
  } else {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- Hono's status type is a closed literal union; runtime value is a valid HTTP code
    statusCode = currentStatus as ContentfulStatusCode;
  }
  return c.json(
    {
      message: err.message,
      stack: env.NODE_ENV === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

export { notFound, onError };
