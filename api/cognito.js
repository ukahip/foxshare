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
  var region    = POOL_ID.split("_")[0];

  var parsed = req.body;
  if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch(e) {}
  }

  var target = parsed.target;
  var body   = parsed.body || {};
  body.ClientId = CLIENT_ID;

  // Return debug snapshot BEFORE sending to Cognito
  return res.status(200).json({
    debug: true,
    CLIENT_ID_length: CLIENT_ID.length,
    CLIENT_ID_first4: CLIENT_ID.substring(0, 4),
    CLIENT_ID_last4:  CLIENT_ID.substring(CLIENT_ID.length - 4),
    POOL_ID_length:   POOL_ID.length,
    target:           target,
    body_keys:        Object.keys(body),
    ClientId_in_body: body.ClientId,
  });
};
