"use strict";
fetch("test.json")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("editor").innerHTML = data;
    let editor = ace.edit("editor");
    editor.session.setMode("ace/mode/json");
  });
