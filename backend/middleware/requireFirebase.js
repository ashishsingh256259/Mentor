const axios = require("axios");
// Firebase Identity Toolkit validates the ID token against the configured project.
module.exports = async function requireFirebase(req, res, next) {
  const token = /^Bearer (\S+)$/.exec(req.get("authorization") || "")?.[1];
  if (!token) return res.status(401).json({ error: "Authentication required" });
  if (!process.env.FIREBASE_WEB_API_KEY) return res.status(503).json({ error: "Authentication unavailable" });
  try {
    const { data } = await axios.post("https://identitytoolkit.googleapis.com/v1/accounts:lookup", { idToken: token }, { params: { key: process.env.FIREBASE_WEB_API_KEY }, timeout: 10000 });
    const user = data.users?.[0];
    if (!user?.localId || !user.email || user.emailVerified !== true || user.disabled) return res.status(403).json({ error: "Verified email required" });
    req.identity = { uid: user.localId, email: user.email };
    return next();
  } catch (err) {
    return res.status(err.response?.status === 400 || err.response?.status === 401 ? 401 : 503).json({ error: "Unable to verify identity" });
  }
};
