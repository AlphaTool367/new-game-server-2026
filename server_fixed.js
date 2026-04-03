const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Helper function to decode hex strings
function DeH(hexString) {
  let result = "";
  const cleanHex = hexString.trim().replace(/\s/g, "");
  for (let i = 0; i < cleanHex.length; i += 2) {
    result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
  }
  return result;
}

// 1. Home Page (Root URL) - Resolves the "Not Found" error
app.get("/", (req, res) => {
  res.status(200).send("<h1>Server is Running Successfully!</h1><p>Available endpoints: /ver, /MajorLogin, /fileinfo, /assetindexer</p>");
});

// 2. Handle Version Config Request (The fix for "Failed to retrieve version config: 2")
app.get("/ver", (req, res) => {
  res.status(200).send("2");
});

// 3. Handle Login Request
app.get("/MajorLogin", async (req, res) => {
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  const E_C = "https://discord.gg/HyM9B4SXGq";
  try {
    const loginRes = await fetch(BA_RES_U + "lo.txtt");
    const body = await loginRes.text();
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(body);
  } catch (e) {
    console.error("Error fetching MajorLogin content:", e.message);
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(E_C);
  }
});

// 4. Handle Resource Files (FileInfo, AssetIndexer)
app.get("/fileinfo", async (req, res) => {
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  try {
    const resourceRes = await fetch(BA_RES_U + "inac.txt");
    const hexData = await resourceRes.text();
    const decodedBody = DeH(hexData);
    res.status(200).set("Content-Type", "application/octet-stream").send(decodedBody);
  } catch (e) {
    res.status(403).send("Error fetching fileinfo");
  }
});

app.get("/assetindexer", async (req, res) => {
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/";
  try {
    const resourceRes = await fetch(BA_RES_U + "3ac.txt");
    const hexData = await resourceRes.text();
    const decodedBody = DeH(hexData);
    res.status(200).set("Content-Type", "application/octet-stream").send(decodedBody);
  } catch (e) {
    res.status(403).send("Error fetching assetindexer");
  }
});

// Export the app for Vercel
module.exports = app;

// Listen only if not running as a serverless function
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}