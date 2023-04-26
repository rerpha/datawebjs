const CA = require("node-epics-ca");

const zlib = require("zlib");
function dehex_and_decompress(value) {
  // decompress
  buffer = Buffer.from(value, "hex");
  var result = zlib.inflateSync(buffer);
  return result;
}

async function getPvValue(pv) {
  var PVVal;
  await CA.get(pv).then(function (value) {
    PVVal = value;
  });
  //console.log(PVVal);
  return PVVal;
}
async function get_inst_list() {
  return dehex_and_decompress(await getPvValue("CS:INSTLIST"));
}

const express = require("express");
var http = require("http");
// var https = require('https');
var app = express();

app.use("/", express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");

// index page
app.get("/", async function (req, res) {
  get_inst_list().then(function (value) {
    res.render("pages/index", { pvlist: value });
  });
});

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
// httpsServer.listen(8443);
