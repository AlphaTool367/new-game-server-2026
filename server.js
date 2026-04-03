
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

app.all("/*", async (req, res) => {
  const A_U = "https://x-wave-server-ff.netlify.app/max/free/xac.txt"; // Original activation URL
  const BA_RES_U = "https://x-wave-server-ff.netlify.app/max/free/"; // Original base resource URL
  const V_K = "X-WAVE-FREE-ONLINE-AC";
  const E_C = "https://discord.gg/HyM9B4SXGq"; // Discord invite for errors/fallback

  const cuU = req.url;
  let iAC = false;

  try {
    // Simulate activation check based on the original script's logic
    // For a new server, you might want to control this directly or use a local file
    const ache = await fetch(A_U);
    const ate = await ache.text();
    if (ate.includes(V_K)) {
      iAC = true;
    }
  } catch (error) {
    console.error("Activation check failed:", error.message);
    iAC = false;
  }

  if (cuU.includes("/MajorLogin")) {
    const fileN = iAC ? "lo.txtt" : "locn.txt";
    try {
      // Fetch from original BA_RES_U or serve local files
      const loginRes = await fetch(BA_RES_U + fileN);
      const body = await loginRes.text();
      res.status(400).set("Content-Type", "text/html; charset=utf-8").send(body);
    } catch (e) {
      console.error("Error fetching MajorLogin content:", e.message);
      res.status(400).set("Content-Type", "text/html; charset=utf-8").send(E_C);
    }
    return;
  }

  if (!iAC) {
    res.status(403).send(E_C);
    return;
  }

  let targetFile = "";
  let contentType = "application/octet-stream";

  if (cuU.includes("/fileinfo")) {
    targetFile = "inac.txt";
  } else if (cuU.includes("/assetindexer")) {
    targetFile = "3ac.txt";
  } else {
    // If no specific endpoint matched, return 404 or default content
    res.status(404).send("Not Found");
    return;
  }

  try {
    // Fetch from original BA_RES_U or serve local files
    const resourceRes = await fetch(BA_RES_U + targetFile);
    const hexData = await resourceRes.text();
    const decodedBody = DeH(hexData);
    res.status(200).set("Content-Type", contentType).send(decodedBody);
  } catch (e) {
    console.error("Error fetching resource:", e.message);
    res.status(403).send(E_C);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
