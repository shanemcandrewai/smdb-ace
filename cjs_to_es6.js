import { readFile, writeFile, opendir } from "fs/promises";
import { argv } from "process";
import { join, path } from "path";
import { createLogger, format, transports } from "winston";

const rootDir = "docs/scripts/ace/";

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

// async function* walk(dirpath) {
// const dir = await opendir(dirpath);
// dir.foreach((dirent) => {
// logger.log('file path :', dirent);
// const entry = path.join(dirpath, dirent.name);
// if (dirent.isDirectory()) yield* walk(entry);
// else if (dirent.isFile()) yield entry;
// });
// }

async function* walk(dirpath) {
  const dir = await opendir(dirpath);
  dir.foreach((d) => {
  // for await (const d of await opendir(dir)) {
    const entry = join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  });
}

function processContents(fileIn) {
  logger.log("process file contests", fileIn.filepath);
}

async function processFile(filepath) {
  logger.log("file path :", filepath);

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

function main() {
  initLogger();

  if (argv.length === 3) {
    // Input file passed as command-line argument
    processFile(argv[2]).catch((e) => {
      logger.log(`processFile failed: ${e.message}`);
    });
  } else {
    // assume ace directory
  }
}

main();
