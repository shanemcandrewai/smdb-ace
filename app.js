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
  const regex_define = /(^|\s)define.*\n/;
  const regex_define_end = /}\);?\s*$/;
  const root_dir = "docs/scripts/ace/test/";
  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((results) => {
        let file_contents = results.toString();
        if (regex_define.test(file_contents)) {
          // Delete define
          file_contents = file_contents.replace(regex_define, "");
          console.log("regex_define found", file_path);
          // Delete last });
          file_contents = file_contents.replace(regex_define_end, "");
          console.log("regex_define_end executed", file_path);
          fs.promises
            .writeFile(file_path, file_contents)
            .then(() => {
              console.log("file written:", file_path);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("regex_define not found", file_path);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

if (argv[2] == "convert") {
  main();
}
