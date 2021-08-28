"use strict";

// import ace
import ace from '../docs/scripts/ace/lib/ace/ace'
// import Range from ace (it is also available as ace.Range)
import {Range, EditSession} from '../docs/scripts/ace/lib/ace/ace'

// import modes that you want to include into your main bundle
import "../docs/scripts/ace/lib/ace/mode/json";

// import webpack resolver to dynamically load modes, you need to install file-loader for this to work!
import "../docs/scripts/ace-builds/webpack-resolver";
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
    bug: 1
})

editor.selection.setRange(new Range(0,0,0,3))

document.body.appendChild(editor.container)

/*
import {Mode as JSMode} from "../../build/src-noconflict/mode-javascript"
editor.setMode( new JSMode())
*/
