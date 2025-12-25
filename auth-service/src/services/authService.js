const User = require("../models/User");
const RefreshToken = require("../models/refreshToken");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../utils/jwt");

exports.register = async (email, password) => {
  const passwordHash = await hashPassword(password);
  return User.create({ email, passwordHash });
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.passwordHash);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = signToken(
    { sub: user._id, roles: user.roles },
    process.env.JWT_EXPIRES_IN
  );

  return { accessToken, user };
};
