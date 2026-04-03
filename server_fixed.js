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

// Main handler for all routes
app.all("/*", async (req, res) => {
  const A_U = "https://x-wave-server-ff.netlify.app/max/free/xac.txt"; // Original activation URL
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/"; // Original base resource URL
  const V_K = "X-WAVE-FREE-ONLINE-AC";
  const E_C = "https://discord.gg/HyM9B4SXGq"; // Discord invite for errors/fallback

  const cuU = req.url;
  let iAC = false;

  try {
    // Check activation key from original source
    const ache = await fetch(A_U);
    const ate = await ache.text();
    if (ate.includes(V_K)) {
      iAC = true;
    }
  } catch (error) {
    console.error("Activation check failed:", error.message);
    // Force activation to true for your custom server to prevent failure
    iAC = true; 
  }

  // 1. Handle Version Config Request (The fix for "Failed to retrieve version config: 2")
  if (cuU.includes("/ver")) {
    // You can customize the version string here if needed
    const versionData = "2"; 
    return res.status(200).send(versionData);
  }

  // 2. Handle Login Request
  if (cuU.includes("/MajorLogin")) {
    const fileN = iAC ? "lo.txtt" : "locn.txt";
    try {
      const loginRes = await fetch(BA_RES_U + fileN);
      const body = await loginRes.text();
      // Using 200 instead of 400 for better client compatibility
      return res.status(200).set("Content-Type", "text/html; charset=utf-8").send(body);
    } catch (e) {
      console.error("Error fetching MajorLogin content:", e.message);
      return res.status(200).set("Content-Type", "text/html; charset=utf-8").send(E_C);
    }
  }

  // 3. Handle Resource Files (FileInfo, AssetIndexer)
  let targetFile = "";
  let contentType = "application/octet-stream";

  if (cuU.includes("/fileinfo")) {
    targetFile = "inac.txt";
  } else if (cuU.includes("/assetindexer")) {
    targetFile = "3ac.txt";
  } else {
    // Default response if no endpoint matches
    return res.status(404).send("Endpoint Not Found");
  }

  try {
    const resourceRes = await fetch(BA_RES_U + targetFile);
    const hexData = await resourceRes.text();
    const decodedBody = DeH(hexData);
    return res.status(200).set("Content-Type", contentType).send(decodedBody);
  } catch (e) {
    console.error("Error fetching resource:", e.message);
    return res.status(403).send(E_C);
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
