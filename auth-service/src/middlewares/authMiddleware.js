const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.sendStatus(403);
  }
};
