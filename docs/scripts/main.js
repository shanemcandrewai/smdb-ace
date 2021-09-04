"use strict";
requirejs(["ace/lib/ace/ace"], function (ace) {
  const editor = ace.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "var hello = 'world'" + "\n",
    mode: "ace/lib/ace/mode/json",
  });

  document.body.appendChild(editor.container);
});
