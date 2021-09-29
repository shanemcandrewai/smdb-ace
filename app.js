import { argv } from "process";
import * as fs from "fs";
import path from "path";

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}
async function main() {
  const regex1 = /^\s*define/i;
  const root_dir = "docs/scripts/ace/test/";
  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((result) => {
        const lines = result.toString().split("\n");
        lines.forEach((line, line_no, arr) => {
          if (line.match(regex1)) {
            console.log(file_path, line_no, lines[line_no]);
            arr.splice(line_no, 1);
          }
        });
        const out_text = lines.join("\n");
        fs.promises
          .writeFile(file_path, out_text)
          .then((result) => {
            console.log("file written:", file_path, result);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

if (argv[2] == "convert") {
  main();
}
