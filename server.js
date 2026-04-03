const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

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
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  try {
    const loginRes = await fetch(BA_RES_U + "lo.txtt");
    const body = await loginRes.text();
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(body);
  } catch (e) {
    res.status(200).send("https://discord.gg/HyM9B4SXGq");
  }
});

// FileInfo Endpoint
app.get("/fileinfo", async (req, res) => {
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  try {
    const resourceRes = await fetch(BA_RES_U + "inac.txt");
    const hexData = await resourceRes.text();
    res.status(200).set("Content-Type", "application/octet-stream").send(DeH(hexData));
  } catch (e) {
    res.status(403).send("Error");
  }
});

// AssetIndexer Endpoint
app.get("/assetindexer", async (req, res) => {
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  try {
    const resourceRes = await fetch(BA_RES_U + "3ac.txt");
    const hexData = await resourceRes.text();
    res.status(200).set("Content-Type", "application/octet-stream").send(DeH(hexData));
  } catch (e) {
    res.status(403).send("Error");
  }
});

// Export for Vercel
module.exports = app;