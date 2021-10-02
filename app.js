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

function replace_es6(file_in, regex, import_statement) {
  for (const found of [...file_in.contents.matchAll(regex)]) {
    console.log("found", found[0]);
    console.log("import", eval("`" + import_statement + "`"));
    file_in.contents = file_in.contents.replace(
      found[0],
      eval("`" + import_statement + "`")
    );
    file_in.changed = true;
  }
  return file_in;
}

async function main() {
  const root_dir = "docs/scripts/ace/test";

  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((results) => {
        console.log("xxx file_path", file_path);
        let file_in = { changed: false, contents: results.toString() };
        // delete define
        const regex_define = /(^|\n)define\(.*\n/g;
        file_in = replace_es6(file_in, regex_define, "");
        if (file_in.changed) {
          // delete matching }/;
          const regex_define_end = /}\);?\s*(?=if\s\(ty|$)/;
          file_in.contents = file_in.contents.replace(
            file_in,
            regex_define_end,
            ""
          );
        }
        // require("req_name")
        const regex_require = /\nrequire\("(?<req_name>.*)"\)"*.\n/g;
        let import_statement =
          '\nimport * from "${found.groups.req_name}.js";\n';
        file_in = replace_es6(file_in, regex_require, import_statement);

        // var var_name = require("module_name")
        const regex_var =
          /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)*.\n/g;
        import_statement =
          '\nimport * as ${found.groups.var_name} from "${found.groups.module_name}.js";\n';
        file_in = replace_es6(file_in, regex_var, import_statement);

        // var var_name = require("module_name').member
        const regex_var_member =
          /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)\.(?<member_name>\w+);\s*\n/g;
        import_statement =
          '\nimport { ${found.groups.member_name} } as ${found.groups.var_name} from "${found.groups.module_name}.js";\n';
        file_in = replace_es6(file_in, regex_var_member, import_statement);

        // module.exports = var_name
        const regex_mod_exports =
          /\nmodule\.exports\s*=\s*(?<var_name>\w+);\s*\n/g;
        import_statement = "\nexport { ${found.groups.var_name} };\n";
        file_in = replace_es6(file_in, regex_mod_exports, import_statement);

        // module.exports = {
        const regex_mod_exports_br = /\nmodule\.exports\s*=\s*{\n/g;
        import_statement = "\nexport {";
        file_in = replace_es6(file_in, regex_mod_exports_br, import_statement);

        //exports.var_nam =
        const regex_exports_var = /\nexports\.(?<var_name>\w+)\s*/g;
        import_statement = "\nexport ${found.groups.var_name} ";
        file_in = replace_es6(file_in, regex_exports_var, import_statement);

        if (file_in.changed) {
          fs.promises
            .writeFile(file_path, file_in.contents)
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
