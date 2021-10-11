// node esprima repl
// remove "type" : "module" from package.json
// run node (REPL)
// let {def, inner, ast} = require('./astrepl.js');
const esprima = require('esprima');
const { readFileSync } = require('fs');

const ace = readFileSync('ace_test.js').toString();
const ast = esprima.parseScript(ace);
exports.def = ast.body[0].expression;
exports.inner = ast.body[0].expression.arguments[0];

exports.ast = ast;
