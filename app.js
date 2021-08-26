"use strict";
const express = require("express");
const app = express();
const port = 3000;

//app.use("/ace-builds", express.static("scripts/src-min-noconflict"));
app.use(express.static("public"));
app.use("/scripts", express.static("scripts"));

// app.get("/", (req, res) => {
//  res.sendFile("index.html");
//  res.sendFile("public/require.js");
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
