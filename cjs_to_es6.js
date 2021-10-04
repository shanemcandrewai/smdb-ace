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
    // "",    // "delete matching }) for define;"
    // ),
    new Rule(new RegExp(/(^|\n)define\(.*\n/, "g"), "", "", "delete define"),
    new Rule(new RegExp(/\n}\);?\s*$/, "g"), "", true, "delete matching });"),
    new Rule(
      new RegExp(
        /\nrequire\("(?<req_path>.*\/)(?<req_name>.*)"\)\.(?<call_name>.*)/,
        "g"
      ),
      '\nimport * as $<req_name> from "$<req_path>$<req_name>.js"\n$<req_name>.$<call_name>',
      "",
      "require('req_path/req_name').call_name"
    ),
    new Rule(
      new RegExp(/\nrequire\("(?<req_path>.*\/)(?<req_name>.*)"\)/, "g"),
      '\nimport * as $<req_name> from "$<req_path>$<req_name>.js"',
      "",
      "require('req_path/req_name')"
    ),
    new Rule(
      new RegExp(
        /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)\.(?<member_name>\w+)/,
        "g"
      ),
      '\nimport { $<member_name> as $<var_name> } from "$<module_name>.js"',
      "",
      "var var_name = require('module_name').member_name"
    ),
    new Rule(
      new RegExp(
        /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)/,
        "g"
      ),
      '\nimport * as $<var_name> from "$<module_name>.js"',
      "",
      "var var_name = require('module_name')"
    ),
    new Rule(
      new RegExp(
        /\nexports\.(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\);/,
        "g"
      ),
      '\nexport { $<var_name> } from "$<module_name>.js"',
      "",
      "exports.var_nam = require('module_name')"
    ),
    new Rule(
      new RegExp(/\nexports\.(?<var_name>\w+)\s=\sfunction/, "g"),
      "\nexport let $<var_name> = function",
      "",
      "exports.var_name = function"
    ),
    new Rule(
      new RegExp(/\nexports\.(?<var_name>\w+)\s=\sfalse/, "g"),
      "\nexport let $<var_name> = false",
      "",
      "exports.var_name = false"
    ),
    new Rule(
      new RegExp(/\nexports\.(?<var_name>\w+)\s=\s(?<number>\d+)/, "g"),
      "\nexport let $<var_name> = $<number>",
      "",
      "exports.var_name = number"
    ),
    new Rule(
      new RegExp(/\nexports\.(?<var_name>\w+)\s=\s(?<local_name>.*);/, "g"),
      "\nexport { $<local_name> as $<var_name> };",
      "",
      "exports.var_name = local_name"
    ),
    new Rule(
      new RegExp(/\nmodule\.exports\.(?<var_name>\w+)/, "g"),
      "\nexport { $<var_name> }",
      "",
      "module.exports.var_name"
    ),

    new Rule(
      new RegExp(/\nmodule\.exports\s*=\s*/, "g"),
      "\nexport default ",
      "",
      "module.exports = "
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
  // for (const found of [...file_in.contents.matchAll(rule.regex)]) {
  let found = rule.regex.test(file_in.contents);
  console.log("\nchange    :", file_in.change);
  console.log("rule      :", rule.description);
  console.log("regex     :", rule.regex);
  console.log("found     :", found);

  if (found) {
    console.log("replaced  :", JSON.stringify(rule.subst_templ));
    file_in.contents = file_in.contents.replace(rule.regex, rule.subst_templ);
    file_in.changed = true;
    file_in.change++;
  }
  // }

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
