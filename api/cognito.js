module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  var POOL_ID   = (process.env.POOL_ID   || "").trim();
  var CLIENT_ID = (process.env.CLIENT_ID || "").trim();

  // Always return debug info so we can see what's happening
  if (!CLIENT_ID || !POOL_ID) {
    res.status(500).json({
      error: "Missing environment variables",
      POOL_ID_length:   POOL_ID.length,
      CLIENT_ID_length: CLIENT_ID.length,
      POOL_ID_preview:   POOL_ID.length   > 0 ? POOL_ID.substring(0,8)   + "..." : "EMPTY",
      CLIENT_ID_preview: CLIENT_ID.length > 0 ? CLIENT_ID.substring(0,4) + "..." : "EMPTY"
    });
    return;
  }

  var region = POOL_ID.split("_")[0];

  var parsed = req.body;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch(e) {
      res.status(400).json({ error: "Invalid JSON: " + e.message });
      return;
    }
  }

  if (!parsed || !parsed.target) {
    res.status(400).json({ error: "Missing target in request body", received: JSON.stringify(parsed) });
    return;
  }

  var target  = parsed.target;
  var body    = parsed.body || {};
  body.ClientId = CLIENT_ID;

  try {
    var response = await fetch(
      "https://cognito-idp." + region + ".amazonaws.com/",
      {
        method: "POST",
        headers: {
          "Content-Type":  "application/x-amz-json-1.1",
          "X-Amz-Target":  target,
        },
        body: JSON.stringify(body),
      }
    );

    var data = await response.json();
    res.status(response.status).json(data);
  } catch(e) {
    res.status(500).json({ error: "Fetch failed: " + e.message });
  }
};
