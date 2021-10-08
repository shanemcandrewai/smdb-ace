# Node REPL with esprima

const { parseScript } = require('esprima');
const { readFileSync } = require('fs');
let acefile = "docs/scripts/ace/ace.js";

let ast = parseScript(readFileSync(acefile).toString());

acefile = "docs/scripts/main.js";
