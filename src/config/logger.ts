import winston from "winston";

const log_level = "info";
const { combine, timestamp, errors, colorize, json, simple } = winston.format;

const log = winston.createLogger({
  level: log_level,
  format: combine(
    timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: { service: "blueprint-hono" },
  transports: [
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: "logs/exception.log" })],
  rejectionHandlers: [new winston.transports.File({ filename: "logs/rejections.log" })],
});

log.add(
  process.env.NODE_ENV === "production"
    ? new winston.transports.Console()
    : new winston.transports.Console({
        format: combine(colorize(), simple()),
      }),
);

export default log;
