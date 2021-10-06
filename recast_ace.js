import { parse, print } from "recast";
import { readFileSync } from "fs";

const acefile = "docs/ace-builds/src-noconflict/ace.js";
let ast = parse(readFileSync(acefile).toString());
console.log(ast.program.body[1]);
