import { opendir } from "fs/promises";
import { join } from "path";
import winston from "winston";

const { createLogger, format, transports } = winston;

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [new transports.File({ filename: "output.log" })],
});

function initLogger() {
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      })
    );
  }
}

async function* walk(dir) {
  for await (const dirFile of await opendir(dir)) {
    // eslint-disable-line no-restricted-syntax
    const entry = join(dir, dirFile.name);
    if (dirFile.isDirectory()) yield* walk(entry);
    else if (dirFile.isFile()) yield entry;
  }
}

async function main() {
  initLogger();
  logger.info("start logger");
  for await (const filePath of walk("docs/scripts/ace/test")) {
    // eslint-disable-line no-restricted-syntax
    logger.info(filePath);
  }
}
main().catch((error) => {
  logger.error(error);
});
