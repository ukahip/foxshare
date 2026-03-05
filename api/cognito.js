module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  var POOL_ID   = process.env.POOL_ID   || null;
  var CLIENT_ID = process.env.CLIENT_ID || null;

  // Debug — shows exactly what env vars are visible
  if (!CLIENT_ID || !POOL_ID) {
    res.status(500).json({
      error: "Missing environment variables",
      POOL_ID_set:   !!POOL_ID,
      CLIENT_ID_set: !!CLIENT_ID,
      POOL_ID_value:   POOL_ID   ? POOL_ID.substring(0,8)+'...' : 'NULL',
      CLIENT_ID_value: CLIENT_ID ? CLIENT_ID.substring(0,4)+'...' : 'NULL'
    });
    return;
  }

  var region = POOL_ID.split("_")[0];

  var parsed = req.body;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch(e) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }

  var target  = parsed.target;
  var body    = parsed.body || {};
  body.ClientId = CLIENT_ID;

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
};
