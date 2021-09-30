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
  const regex_define_end = /}\);?\s*(?=if\s\(ty|$)/;
  const regex_var =
    /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<mode_name>.*)"/;
  // const regex_var = /\nvar\s+(?<var_name>\w+)/
  // const regex_var = /\nvar.*\n/;
  const root_dir = "docs/scripts/ace/test/";
  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((results) => {
        let file_changed = false;
        let file_contents = results.toString();
        if (regex_define.test(file_contents)) {
          // Delete define
          file_contents = file_contents.replace(regex_define, "");
          file_changed = true;
          console.log("regex_define found", file_path);
          // Delete last }) or });
          file_contents = file_contents.replace(regex_define_end, "");
          console.log("regex_define_end executed", file_path);
        } else {
          console.log("regex_define not found", file_path);
        }
        // var xxx = require
        let mat = file_contents.match(regex_var);
        if (mat) {
          // console.log('xxx', match.groups.var_name, match.groups.mode_name);
          console.log("yyy", mat.groups.var_name, mat.groups.mode_name);
        } else {
          console.log("yyy2", mat);
          console.log("xxx", file_path, "no match");
        }
        if (file_changed) {
          fs.promises
            .writeFile(file_path, file_contents)
            .then(() => {
              console.log("file written:", file_path);
            })
            .catch((error) => {
              console.log(error);
            });
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
