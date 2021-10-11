import { readFile, writeFile, opendir } from 'fs/promises';
import { argv } from 'process';
import { join } from 'path';
import winston from 'winston';
import esprima from 'esprima';

const { createLogger, format, transports } = winston;

const defaultNode = 'docs/scripts/ace/ace.js';

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
  fileOut.contents = JSON.stringify(esprima.parseScript(fileIn.contents), null, 4);
  logger.info(`esprima: ${fileOut.contents}`);
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
  try {
    // eslint-disable-next-line no-restricted-syntax
    for await (const filePath of walk(argv[2] || defaultNode)) {
      await processFile(filePath);
    }
  } catch {
    await processFile(argv[2] || defaultNode);
  }
}

main();
// main().catch((error) => {
// logger.error(error);
// });
