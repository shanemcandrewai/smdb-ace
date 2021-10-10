import { readFile, writeFile, opendir } from 'fs/promises';
import { argv } from 'process';
import { join } from 'path';
import winston from 'winston';

const createLogger = winston.createLogger; // eslint-disable-line prefer-destructuring
const format = winston.format; // eslint-disable-line prefer-destructuring
const transports = winston.transports; // eslint-disable-line prefer-destructuring

const rootDir = 'docs/scripts/ace';

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

async function* walk(dirpath) {
  // const dir = await opendir(dirpath);
  logger.info(`walk ${dirpath}`);
  for (const d of await opendir(dirpath)) { // eslint-disable-line no-restricted-syntax
    logger.info(`walk inner ${d.name}`);
    const entry = join(dirpath, d.name);
    if (d.isDirectory()) yield* walk(entry);
    if (d.isFile()) yield entry;
  }
}

function processContents(fileIn) {
  logger.log('process file contests', fileIn.filepath);
}

async function processFile(filepath) {
  logger.log('file path :', filepath);

  const results = await readFile(filepath);

  let fileIn = {
    filepath,
    changed: false,
    contents: results.toString(),
    change: 0,
  };

  fileIn = processContents(fileIn);

  if (fileIn.changed) {
    await writeFile(filepath, fileIn.contents);
  }
}

async function main() {
  initLogger();
  logger.info('start logger');

  if (argv.length === 3) {
    // Input file passed as command-line argument
    processFile(argv[2])
      .catch((e) => {
        logger.error(`processFile failed: ${e.message}`);
      });
  } else {
    logger.info('argv.length !== 3');
    try {
      for await (const filePath of walk(rootDir)) { // eslint-disable-line no-restricted-syntax
        logger.error(`walk : ${filePath}`);
      }
    } catch (e) {
      logger.error(`walk failed: ${e.message}`);
    }
    // logger.info('walk ', filePath);
    // }
    // assume ace directory
    // walk(rootDir);
    // .catch((e) => {
    // logger.error(`walk failed: ${e.message}`);
    // });
  }
}

main();
