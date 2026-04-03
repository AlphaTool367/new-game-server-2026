const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
const fs = require("fs");
const path = require("path");
const __current_dir = __dirname;

app.use(cors());

// Helper function to decode hex strings
function DeH(hexString) {
  let result = "";
  const cleanHex = hexString.trim().replace(/\s/g, "");
  for (let i = 0; i < cleanHex.length; i += 2) {
    result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return result;
}

// Home Page
app.get("/", (req, res) => {
  res.status(200).send("Server is Active!");
});

// Version Endpoint
app.get("/ver", (req, res) => {
  res.status(200).send("2");
});

// MajorLogin Endpoint
app.get("/MajorLogin", async (req, res) => {
  
  try {
    const body = fs.readFileSync(path.join(__current_dir, "lo.txtt"), "utf8");
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(body);
  } catch (e) {
    res.status(200).send("https://discord.gg/HyM9B4SXGq");
  }
});

// FileInfo Endpoint
app.get("/fileinfo", async (req, res) => {
  
  try {
    const hexData = fs.readFileSync(path.join(__current_dir, "inac.txt"), "utf8");
    res.status(200).set("Content-Type", "application/octet-stream").send(DeH(hexData));
  } catch (e) {
    res.status(403).send("Error");
  }
});

// AssetIndexer Endpoint
app.get("/assetindexer", async (req, res) => {
  
  try {
    const hexData = fs.readFileSync(path.join(__current_dir, "3ac.txt"), "utf8");
    res.status(200).set("Content-Type", "application/octet-stream").send(DeH(hexData));
  } catch (e) {
    res.status(403).send("Error");
  }
});

// Export for Vercel
module.exports = app;
