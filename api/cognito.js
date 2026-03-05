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

  if (!POOL_ID || !CLIENT_ID) {
    res.status(500).json({ error: "Missing env vars", POOL_ID_set: !!POOL_ID, CLIENT_ID_set: !!CLIENT_ID });
    return;
  }

  var region = POOL_ID.split("_")[0];

  var parsed = req.body;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch(e) {}
  }

  var target    = parsed.target;
  var body      = parsed.body || {};
  body.ClientId = CLIENT_ID;

  try {
    var response = await fetch(
      "https://cognito-idp." + region + ".amazonaws.com/",
      {
        method:  "POST",
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
