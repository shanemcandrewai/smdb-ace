# src-noconflict-editsetmode module loading
## Call sequence 
### setMode
    mode = "ace/mode/javascript";
	path = "ace/mode/javascript"
### loadModule
    moduleName[1] = "ace/mode/javascript";
### loadScript
    path = "http://localhost:3000/ace-builds/src-noconflict/mode-javascript.js";
### startWorker
    this.$modeId = "ace/mode/javascript";
### mode-json.js
### afterLoad
    moduleName = "ace/mode/javascript";
### startWorker
### createWorker
### worker-json
## config.loadModule
generates afterLoad()
### net.loadScript
#### config.moduleUrl
Resolves path
#### net.loadScript
##### head.appendChild(s)
Downloads script
## Possible import statements
    import {Mode} from './ace-builds/src-noconflict/json.exp.js';
    import {Mode} from 'http://localhost:3000/ace-builds/src-noconflict/json.exp.js';



