require.config({
  baseUrl: "ace-builds",
  // paths: {
  // foo: 'libs/foo-1.1.3'
  // }
});
requirejs(["ace"], function() {
    var editor = ace.edit("editor");
    editor.session.setMode("ace/mode/json");
});