"use strict";
const express = require("express");
const app = express();
const port = 3000;

app.use("/ace-builds/src", express.static("../ace-builds/src/"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
