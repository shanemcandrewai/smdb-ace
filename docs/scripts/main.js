"use strict";
requirejs(["../ace/ace"], function() {
  fetch("test.json")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("editor").innerHTML = data;
      const editor = ace.edit("editor");
      editor.session.setMode("ace/mode/json");
    });
});
