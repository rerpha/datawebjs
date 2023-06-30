const CA = require("node-epics-ca");
const { spawn } = require("node:child_process");
const zlib = require("zlib");
const express = require("express");
// function dehex_and_decompress(value) {
//   // decompress
//   buffer = Buffer.from(value, "hex");
//   var result = zlib.inflateSync(buffer);
//   return result;
// }

async function getPvValue(pv) {
  var PVVal;
  try {
    await CA.get(pv).then(function (value) {
      PVVal = value;
    });
  } catch (error) {
    console.error(`put failed due to ${error}`);
  }
  return PVVal;
}

async function get_inst_list() {
  //return dehex_and_decompress(await getPvValue("CS:INSTLIST"));
 await getPvValue("CS:INSTLIST").then(function (value) {
    console.log(value);
    const pyProg = spawn("/instrument/apps/python3/python.exe", [
      "./main.py",
      value,
    ]);
    console.log("calling python");
    pyProg.stdout.on("data", function (data) {
      console.log("got here");
      console.log(data.toString());
      return data.toString();
    });
  });
}

var http = require("http");
// var https = require('https');
var app = express();

app.use("/", express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");

// index page
app.get("/", async function (req, res) {
  await getPvValue("CS:INSTLIST").then(function (value) {
    console.log(value);
    const pyProg = spawn("/instrument/apps/python3/python.exe", [
      "./main.py",
      value,
    ]);
    console.log("calling python");
    pyProg.stdout.on("data", function (data) {

      const obj = JSON.parse(data.toString());

      var arr = [];

      obj.forEach(element => {
        console.log(element.name);
        arr.push(element.name)
      });

      res.render("pages/index", { pvlist: arr });
    });
  }); 
});

var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
// httpsServer.listen(8443);
