"use strict";
//requirejs(["ace-builds/src-min-noconflict/ace"], function() {  //works
//requirejs(["ace-builds/src-min/ace"], function() {  //works sometimes, otherwise Error : Uncaught (in promise) ReferenceError: ace is not defined
requirejs(["ace/lib/ace/ace"], function() {  //Error : Uncaught (in promise) ReferenceError: ace is not defined
  fetch("test.json")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("editor").innerHTML = data;
      const editor = ace.edit("editor");
      editor.session.setMode("ace/mode/json");
    });
});
