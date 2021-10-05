import * as fs from "fs";
import path from "path";

function Rule(regex, subst_templ, precondition, description) {
  this.regex = regex;
  this.subst_templ = subst_templ;
  this.precondition = precondition;
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
    new Rule(/(^|\n)define\(.*\n/g, null, "", "delete define"),
    new Rule(/\n}\);?\s*$/g, "", true, "delete matching });"),
    new Rule(
      /\nrequire\("(?<req_path>.*\/)(?<req_name>.*)"\)/g,
      '\nimport * as $<req_name> from "$<req_path>$<req_name>.js"',
      "",
      "require('req_name')"
    ),
    new Rule(
      /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)\.(?<member_name>\w+)/g,
      '\nimport { $<member_name> as $<var_name> } from "$<module_name>.js"',
      null,
      "var var_name = require('module_name').member"
    ),
    new Rule(
      /\nvar\s+(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\)/,
      '\nimport * as $<var_name> from "$<module_name>.js"',
      null,
      "var var_name = require('module_name')"
    ),
    new Rule(
      /\nexports\.(?<var_name>\w+)\s*=\s*require\("(?<module_name>.*)"\);/,
      '\nexport { $<var_name> } from "$<module_name>.js"',
      null,
      "exports.var_nam = require('module_name')"
    ),
    new Rule(
      /\nmodule\.exports\.(?<var_name>\w+)/g,
      "\nexport { $<var_name> }",
      null,
      "module.exports = var_name"
    ),
    new Rule(
      /\nmodule\.exports\s*=\s*{/g,
      "\nexport {",
      null,
      "module.exports = {"
    ),
    new Rule(
      /\nexports\.(?<var_name>\w+)\s=\sfunction/g,
      "\nexport let $<var_name> = function",
      null,
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
          if (
            rule.precondition == null ||
            rule.precondition == file_in.changed
          ) {
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
