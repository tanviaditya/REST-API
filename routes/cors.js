const express = require("express");
const cors = require("cors");

const app = express();

//all the origins
const whitelist = [
  "http://localhost:3000",
  "https://localhost:3443",
  "http://localhost:3006/home",
  "http://localhost:3006"
];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: true };
  }
  callback(null, { origin: true });
};

exports.cors = cors();
exports.corswithOptions = cors(corsOptionsDelegate);
