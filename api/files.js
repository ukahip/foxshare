const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://foxshare.vercel.app';

module.exports = async function (req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigin = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;

  res.setHeader("Access-Control-Allow-Origin",  allowedOrigin);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Block requests from unexpected origins
  if (origin && origin !== ALLOWED_ORIGIN) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }

  var API_URL = (process.env.API_URL || "").trim();
  if (!API_URL) {
    res.status(500).json({ error: "Missing env var: API_URL" });
    return;
  }

  var token     = req.headers["authorization"] || "";
  var path      = req.query.path || "/files";
  var qs        = req.query.qs   || "";
  var targetUrl = API_URL + path + (qs ? "?" + qs : "");

  var options = {
    method:  req.method,
    headers: {
      Authorization:  token,
      "Content-Type": "application/json",
    },
  };

  if (req.method === "POST") {
    options.body = JSON.stringify(req.body);
  }

  try {
    var response = await fetch(targetUrl, options);

    if (path === "/files/download") {
      var buffer = await response.arrayBuffer();
      var base64 = Buffer.from(buffer).toString("base64");
      res.setHeader("Content-Type", "application/octet-stream");
      res.status(response.status).send(base64);
      return;
    }

    var data = await response.text();
    res.status(response.status).send(data);
  } catch(e) {
    res.status(500).json({ error: "Fetch failed: " + e.message });
  }
};
