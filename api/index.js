
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

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
          const body = fs.readFileSync(path.join(__dirname, "../public/lo.txt"), "utf8");
          res.status(400).set("Content-Type", "text/html; charset=utf-8").send(body);
    } catch (e) {
          console.error("Error fetching MajorLogin content:", e.message);
          res.status(400).set("Content-Type", "text/html; charset=utf-8").send("https://discord.gg/HyM9B4SXGq");
    }
});

// FileInfo Endpoint
app.get("/fileinfo", async (req, res) => {
    try {
          const hexData = fs.readFileSync(path.join(__dirname, "../public/inac.txt"), "utf8");
          const decodedBody = DeH(hexData);
          res.status(200).set("Content-Type", "application/octet-stream").send(decodedBody);
    } catch (e) {
          console.error("Error fetching fileinfo:", e.message);
          res.status(403).send("https://discord.gg/HyM9B4SXGq");
    }
});

// AssetIndexer Endpoint
app.get("/assetindexer", async (req, res) => {
    try {
          const hexData = fs.readFileSync(path.join(__dirname, "../public/3ac.txt"), "utf8");
          const decodedBody = DeH(hexData);
          res.status(200).set("Content-Type", "application/octet-stream").send(decodedBody);
    } catch (e) {
          console.error("Error fetching assetindexer:", e.message);
          res.status(403).send("https://discord.gg/HyM9B4SXGq");
    }
});

// Catch all other routes
app.all("/*", (req, res) => {
    res.status(404).send("Not Found");
});

module.exports = app;
