"use strict";
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("docs"));
//app.use("/ace", express.static("docs/scripts/ace-builds/src-min-noconflict")); //works
//app.use("/ace", express.static("../ace-builds/src-min-noconflict")); //works
//app.use("/ace", express.static("../ace/lib/ace")); //Error: Loading failed for the <script> with source “http://localhost:3000/ace/ace/requirejs/text.js”.
app.use("/ace", express.static("../ace-builds/src-min"));  //works sometimes, other times fails with Error : Uncaught (in promise) ReferenceError: ace is not defined

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
