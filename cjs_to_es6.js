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
  for await (const dirNode of await opendir(dir)) { // eslint-disable-line no-restricted-syntax
    logger.info(`walk node: ${dirNode.name}`);
    const entry = join(dir, dirNode.name);
    if (dirNode.isDirectory()) yield* walk(entry);
    else if (dirNode.isFile()) yield (entry);
  }
}

function processContents(fileIn) {
  logger.info(`process file contents: ${fileIn.filepath}`);
  const fileOut = fileIn;
  fileOut.changed = true;
  return fileOut;
}

async function processFile(filepath) {
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
    logger.info(`write file: ${fileIn.filepath}`);
  }
}

async function main() {
  if (argv.length === 3) {
    // Input file passed as command-line argument
    await processFile(argv[2]);
  } else {
    logger.info('argv.length !== 3');
    for await (const filePath of walk(rootDir)) { // eslint-disable-line no-restricted-syntax
      await processFile(filePath);
    }
  }
}

main().catch((error) => {
  logger.error(error);
});
