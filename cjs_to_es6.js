import * as fs from "fs";
import path from "path";

function Rule(regex, subst_templ, prev_changed, description) {
  this.regex = regex;
  this.subst_templ = subst_templ;
  this.prev_changed = prev_changed;
  this.description = description;
}

function get_rules() {
  return [
    // lookbehind assertion with variable width works but is too slow
    // new Rule(
    // new RegExp(/(?<=(^|\n)define\(.*\n([\s\S]*))\n}\);?\s*$/, "g"),
    // "",
    // "delete matching }) for define;"
    // ),
    new Rule(new RegExp(/(^|\n)define\(.*\n/, "g"), "", "", "delete define"),
    new Rule(new RegExp(/\n}\);?\s*$/, "g"), "", true, "delete matching });"),
    new Rule(
      new RegExp(/\nrequire\("(?<req_path>.*\/)(?<req_name>.*)"\)/, "g"),
      '\nimport * as ${found.groups.req_name} from "${found.groups.req_path}${found.groups.req_name}.js"',
      "",
      "require('req_name')"
    ),
    new Rule(
      new RegExp(
        /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)\.(?<member_name>\w+)/,
        "g"
      ),
      '\nimport { ${found.groups.member_name} as ${found.groups.var_name} } from "${found.groups.module_name}.js"',
      "",
      "var var_name = require('module_name').member"
    ),
    new Rule(
      new RegExp(
        /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)/,
        "g"
      ),
      '\nimport * as ${found.groups.var_name} from "${found.groups.module_name}.js"',
      "",
      "var var_name = require('module_name')"
    ),
    new Rule(
      new RegExp(
        /\nexports\.(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\);/,
        "g"
      ),
      '\nexport { ${found.groups.var_name} } from "${found.groups.module_name}.js"',
      "",
      "exports.var_nam = require('module_name')"
    ),
    new Rule(
      new RegExp(/\nmodule\.exports\.(?<var_name>\w+)/, "g"),
      "\nexport { ${found.groups.var_name} }",
      "",
      "module.exports = var_name"
    ),
    new Rule(
      new RegExp(/\nmodule\.exports\s*=\s*{\n/, "g"),
      "\nexport {",
      "",
      "module.exports = {"
    ),
    new Rule(
      new RegExp(/\nexports\.(?<var_name>\w+)\s=\sfunction/, "g"),
      "\nexport let ${found.groups.var_name} = function",
      "",
      "exports = var_name"
    ),
  ];
}

async function* walk(dir) {
  for await (const d of await fs.promises.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}

function process(file_in, rule) {
  for (const found of [...file_in.contents.matchAll(rule.regex)]) {
    console.log("\nchange    :", file_in.change);
    console.log("rule      :", rule.description);
    console.log("found     :", JSON.stringify(found[0]));
    console.log(
      "replaced  :",
      JSON.stringify(eval("`" + rule.subst_templ + "`"))
    );
    file_in.contents = file_in.contents.replace(
      found[0],
      eval("`" + rule.subst_templ + "`")
    );
    file_in.change++;
    file_in.changed = true;
  }

  return file_in;
}

async function main() {
  const root_dir = "docs/scripts/ace/";

  for await (const file_path of walk(root_dir)) {
    fs.promises
      .readFile(file_path)
      .then((results) => {
        console.log("\nfile path :", file_path);
        let file_in = {
          changed: false,
          contents: results.toString(),
          change: 0,
        };

        for (const rule of get_rules()) {
          if (rule.prev_change == null || rule.prev_change == file_in.changed) {
            file_in = process(file_in, rule);
          }
        }

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

main();
