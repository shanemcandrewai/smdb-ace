import { readFile, writeFile, opendir } from 'fs/promises';
import { argv } from 'process';
import { join } from 'path';
import winston from 'winston';

const { createLogger, format, transports } = winston;

const rootDir = 'docs/scripts/ace/test';

const logger = createLogger({
  transports:
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
});

async function* walk(dir) {
  for await (const dirFile of await opendir(dir)) { // eslint-disable-line no-restricted-syntax
    logger.info(`walk inner: ${dirFile.name}`);
    const entry = join(dir, dirFile.name);
    if (dirFile.isDirectory()) yield* walk(entry);
    else if (dirFile.isFile()) yield (entry);
  }
}

function processContents(fileIn) {
  logger.info(`process file contents: ${fileIn.filepath}`);
  const fileOut = fileIn;
  fileOut.changed = true;
  return fileOut;
}

async function processFile(filepath) {
  const results = await readFile(filepath).catch((error) => {
    logger.error(`readFile: ${error}`);
  });

  logger.error(`xxx ${filepath}`);
  let fileIn = {
    filepath,
    changed: false,
    contents: results.toString(),
    change: 0,
  };

  fileIn = processContents(fileIn);

  if (fileIn.changed) {
    await writeFile(filepath, fileIn.contents).catch((error) => {
      logger.error(error);
    });
    logger.info(`write file: ${fileIn.filepath}`);
  }
}

async function main() {
  logger.info('start logger');

  if (argv.length === 3) {
    logger.info(`file name passed: ${argv[2]}`);
    // Input file passed as command-line argument
    processFile(argv[2]);
  } else {
    logger.info('argv.length !== 3');
    for await (const filePath of walk(rootDir)) { // eslint-disable-line no-restricted-syntax
      processFile(filePath);
    }
  }
}

main().catch((error) => {
  logger.error(error);
});
