const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.CLE_JWT, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, 
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
module.exports = generateToken;
