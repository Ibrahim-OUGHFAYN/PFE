const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.CLE_JWT);
    req.user = decoded; // store user info
    console.log("user from medelware",decoded)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
module.exports = authMiddleware;