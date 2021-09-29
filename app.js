"use strict";
import { argv } from "process";
import fs from "fs";
import path from "path";

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

if (argv[2] == "convert") {
  (async function () {
    for await (const p of walk("docs/scripts/ace/test")) console.log(p);
  })();
}
