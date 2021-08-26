"use strict";
require.config({
  baseUrl: "scripts/src-min-noconflict",
  // paths: {
  // foo: 'libs/foo-1.1.3'
  // }
});
requirejs(["ace"], function () {
  fetch("test.json")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("editor").innerHTML = data;
      const editor = ace.edit("editor");
      editor.session.setMode("ace/mode/json");
    });
});
