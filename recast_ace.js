import { parse, print } from "recast";
// const { parse, print } = require("recast");
import { readFileSync } from "fs";
// const { readFileSync } = require("fs");

const acefile = "docs/ace-builds/src-noconflict/ace.js";
let ast = parse(readFileSync(acefile).toString());
console.log(ast.program.body[1]);
