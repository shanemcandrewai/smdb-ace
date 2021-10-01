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
  const regex_require = /\nrequire\("(?<req_name>.*)"\)"*.\n/g;
  // const regex_var =
  // /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)"*.\n/g;
  const regex_var =
    /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)*.\n/g;
  const regex_var_member =
    /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)\.(?<member_name>\w+);\s*\n/g;
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
        // require("req_name")
        for (const found of [...file_contents.matchAll(regex_require)]) {
          const import_statement = `\nimport * from "${found.groups.req_name}.js";\n`;
          file_contents = file_contents.replace(found[0], import_statement);
          file_changed = true;
        }
        // var var_name = require("module_name")
        for (const found of [...file_contents.matchAll(regex_var)]) {
          const import_statement = `\nimport * as ${found.groups.var_name} from "${found.groups.module_name}.js";\n`;
          file_contents = file_contents.replace(found[0], import_statement);
          file_changed = true;
        }
        // var var_name = require("module_name').member
        for (const found of [...file_contents.matchAll(regex_var_member)]) {
          const import_statement = `\nimport { ${found.groups.member_name} } as ${found.groups.var_name} from "${found.groups.module_name}.js";\n`;
          file_contents = file_contents.replace(found[0], import_statement);
          file_changed = true;
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
