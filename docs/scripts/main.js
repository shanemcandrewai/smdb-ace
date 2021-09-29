"use strict";
import * as ace from "./ace/ace.js";
const editor = ace.edit(null, {
  maxLines: 50,
  minLines: 10,
  value:
    '{\n  "array": [1, 2, 3],\n  "boolean":, true,\n  "color": "gold",\n  "null": null,\n  "number": 123,\n  "object": {\n    "a": "b",\n    "c": "d"\n  },\n  "string": "Hello World"\n}\n',
  mode: "ace/mode/json",
});
document.body.appendChild(editor.container);
