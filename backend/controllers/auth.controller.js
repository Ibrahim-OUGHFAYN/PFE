const User = require("../models/User.js");
const hashPassword = require("../utiles/pwdutiles");
const generateToken = require("../utiles/generateToken");
const bcrypt=require("bcryptjs")

const signup = async (req, res) => {
  try {
    console.log("Received body:", req.body); 
    const { name, email, password, role, experience } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un utilisateur avec cet e-mail existe déjà." });
    }

    const hashedpwd = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedpwd,
      role,
      experience,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res); //aussi envoi token a la cookie

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        imgUrl: newUser.imgUrl,
        role:newUser.role,
      });
    } else {
      res.status(400).json({ msg: "invalid user data" });
    }
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "user not found!!!" });
    }

    const isPwdCorrecte = await bcrypt.compare(password, user.password);
    if (!isPwdCorrecte) {
      return res.status(400).json({ msg: "mot de passe incorrecte" });
    }

    generateToken(user._id, res);
   } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ msg: "server error" });
  }
};


module.exports = {
  signup,
  getUser,
  logout,
  login,
};
