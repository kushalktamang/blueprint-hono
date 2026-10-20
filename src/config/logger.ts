import winston from "winston";

import env from "./envConfig.js";

const { combine, timestamp, errors, colorize, json, simple } = winston.format;
const log_level = "info";
const isProduction = env.NODE_ENV === "production";

const fileOrConsole = (filename: string) =>
  isProduction ? new winston.transports.Console() : new winston.transports.File({ filename });

const logger = winston.createLogger({
  level: env.LOG_LEVEL ?? log_level,
  format: combine(
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: { service: "blueprint-hono" },
  transports: [
    new winston.transports.Console({
      format: isProduction ? undefined : combine(colorize(), errors({ stack: true }), simple()),
    }),
    ...(isProduction
      ? []
      : [
          new winston.transports.File({
            filename: "logs/combined.log",
            maxsize: 5_000_000,
            maxFiles: 3,
          }),
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            maxsize: 5_000_000,
            maxFiles: 3,
          }),
        ]),
  ],
  exceptionHandlers: [fileOrConsole("logs/exception.log")],
  rejectionHandlers: [fileOrConsole("logs/rejections.log")],
  exitOnError: true,
});

export default logger;
