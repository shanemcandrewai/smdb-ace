"use strict";

// import ace
import ace from "./ace-builds/src-noconflict/ace";
// import Range from ace (it is also available as ace.Range)
//import { Range, EditSession } from "./ace-builds/src-noconflict/ace";

// import modes that you want to include into your main bundle
import "./ace-builds/src-noconflict/mode-json";

// import webpack resolver to dynamically load modes, you need to install file-loader for this to work!
//import "./ace-builds/webpack-resolver";
// if you want to allow dynamic loading of only a few modules use setModuleUrl for each of them manually
/*
import jsWorkerUrl from "file-loader!../../build/src-noconflict/worker-javascript";
ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl)
*/

var editor = ace.edit(null, {
  maxLines: 50,
  minLines: 10,
  value: "var hello = 'world'" + "\n",
  mode: "ace/mode/json",
});

editor.selection.setRange(new ace.Range(0, 0, 0, 3));

document.body.appendChild(editor.container);


//import "./ace-builds/src-noconflict/mode-javascript"
//editor.session.setMode("ace/mode/javascript")

