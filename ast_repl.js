// node esprima repl
// remove "type" : "module" from package.json
// run node (REPL)
// let {def, inner, ast, wast} = require('./ast_repl.js');
const esprima = require('esprima');
const { readFileSync, writeFileSync } = require('fs');
const { createLogger, format, transports } = require('winston');

const fileIn = 'ace_test.js';

const logger = createLogger({
  transports:
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
});

let rest;

logger.info(`process file contents: ${fileIn}`);
const ace = readFileSync(fileIn).toString();

const dele = function delegate(node, meta) {
  logger.info('=====================');
  for (const prop in node) logger.info(`${prop}: ${node[prop]}`);
  if (node.callee) logger.info(`xxxx node.callee.name: ${node.callee.name}`);
  // if (node.name) logger.info(`delegate node.name: ${node.name}`);
  // if (node.type) logger.info(`delegate node.type: ${node.type}`);
  // if (node.value) logger.info(`delegate node.value: ${node.value}`);
  if (meta.start.offset) logger.info(`delegate start: ${meta.start.offset}`);
  if (meta.end.offset) logger.info(`delegate end: ${meta.end.offset}`);
};

// const ast = esprima.parseScript(ace, { range: true, tokens: true }, dele);
const ast = esprima.parseScript(ace, { tokens: true }, dele);
exports.wast = function writeAst() { writeFileSync('ace_ast.js', JSON.stringify(ast, null, 2)); };
exports.def = ast.body[0].expression;
[exports.inner, ...rest] = ast.body[0].expression.arguments;

exports.ast = ast;
exports.rest = rest;
