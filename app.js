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
  const regex_define = /\n*\s*define.*\n/i;
  const regex_define_end = /\n\s*}\)\s*\n/g;
  const root_dir = "docs/scripts/ace/test/";
  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((results) => {
        let file_contents = results.toString();
        let define_deleted = false;
        // Delete define
        const ret_define = file_contents.match(regex_define);
        if (ret_define) {
          console.log("regex_define", file_path, ret_define[0]);
          define_deleted = true;
        } else {
          console.log("regex_define not found", file_path);
        }
        // });
        if (define_deleted) {
          const ret_define_end = file_contents.matchAll(regex_define_end);
          for (const match of ret_define_end) {
            console.log(
              `Found ${match[0]} start=${match.index} end=${
                match.index + match[0].length
              }.`
            );
          }
          if (ret_define) {
            console.log("regex_define_end", file_path, ret_define[0]);
          }
        }
        fs.promises
          .writeFile(file_path, file_contents)
          .then(() => {
            console.log("file written:", file_path);
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
