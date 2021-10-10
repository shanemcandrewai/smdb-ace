import { readFile, writeFile, opendir } from 'fs/promises';
import { argv } from 'process';
import { join } from 'path';
import winston from 'winston';

const { createLogger, format, transports } = winston;

const rootDir = 'docs/scripts/ace/test';

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
  logger.info(`walk ${dir}`);
  for await (const dirFile of await opendir(dir)) { // eslint-disable-line no-restricted-syntax
    logger.info(`walk inner ${dirFile}`);
    const entry = join(dir, dirFile.name);
    if (dirFile.isDirectory()) yield* walk(entry);
    else if (dirFile.isFile()) yield (entry);
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
    for await (const filePath of walk(rootDir)) { // eslint-disable-line no-restricted-syntax
      logger.info(filePath);
    }
  }
}

main().catch((error) => {
  logger.error(error);
});
