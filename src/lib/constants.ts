import * as HttpStatusPhrases from "../assets/status-code/httpStatusPhrases.js";
import createMessageObjectSchema from "../openapi/schemas/createMessageObject.js";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
