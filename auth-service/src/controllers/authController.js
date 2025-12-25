const authService = require("../services/authService");

const { verifyToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const user = await authService.register(
    req.body.email,
    req.body.password
  );
  res.status(201).json(user);
};

exports.login = async (req, res) => {
  const result = await authService.login(
    req.body.email,
    req.body.password
  );
  res.json(result);
};

exports.me = async (req, res) => {
  // req.user populated by auth middleware
  if (!req.user) return res.sendStatus(401);

  // Try to return user summary
  const user = req.user;
  res.json({ id: user.sub, email: user.email, roles: user.roles, iat: user.iat, exp: user.exp });
};

exports.introspect = async (req, res) => {
  const token = req.body.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ error: 'token required' });

  try {
    const decoded = verifyToken(token);
    res.json({ active: true, ...decoded });
  } catch (e) {
    res.json({ active: false });
  }
};
