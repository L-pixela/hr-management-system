import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const key = process.env.JWT_SECRET || process.env.JWT_PUBLIC_KEY;
    const decoded = jwt.verify(token, key);
    req.user = decoded; // { sub, roles, email }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
