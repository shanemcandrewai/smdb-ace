import { opendir } from 'fs/promises';
import { join } from 'path';
import winston from 'winston';

const createLogger = winston.createLogger; // eslint-disable-line prefer-destructuring
const format = winston.format; // eslint-disable-line prefer-destructuring
const transports = winston.transports; // eslint-disable-line prefer-destructuring

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [new transports.File({ filename: 'output.log' })],
});

function initLogger() {
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    );
  }
}

async function* walk(dir) {
  for await (const d of await opendir(dir)) { // eslint-disable-line no-restricted-syntax
    const entry = join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

async function main() {
  initLogger();
  logger.info('start logger');
  for await (const p of walk('docs/scripts/ace/test')) { // eslint-disable-line no-restricted-syntax
    logger.info(p);
  }
}
main().catch((error) => {
  logger.error(error);
});
