const User = require("../models/User.js");
const hashPassword = require("../utiles/pwdutiles");
const generateToken = require("../utiles/generateToken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/Cloudinary.js"); // Ensure Cloudinary is required

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
        role: newUser.role,
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

    const isPwdCorrecte = await bcrypt.compare(password, user.password);
    if (!isPwdCorrecte) {
      return res.status(400).json({ msg: "mot de passe incorrecte" });
    }

    generateToken(user._id, res);

    //rayazn l'objet n l'user
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imgUrl: user.imgUrl,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ msg: "server error" });
  }
};
const completeGuideProfile = async (req, res) => {
  console.log("received form", req.body);
  try {
    const { name, email, password, role, ville, experience, Langues } =
      req.body;

    let imageUrl = null;

    // Handle Cloudinary upload
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "guides" },
            (error, result) => {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(error);
              }
            }
          );
          stream.end(fileBuffer);
        });
      };

      imageUrl = await streamUpload(req.file.buffer);
    }

    // Hash password if it's provided
    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Save or update user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        ...(password && { password: hashedPassword }),
        role,
        ville,
        experience,
        Langues: Array.isArray(Langues)
          ? Langues
          : (() => {
              try {
                return JSON.parse(Langues);
              } catch {
                return Langues.split(",");
              }
            })(),
        imgUrl: imageUrl,
      },
      { new: true, upsert: true }
    );

    // Generate token and set it in cookie
    generateToken(updatedUser._id, res);

    // Respond with updated user info
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      imgUrl: updatedUser.imgUrl,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Erreur lors de la complétion du profil guide:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la complétion du profil guide",
    });
  }
};

module.exports = {
  signup,
  logout,
  login,
  getUser,
  completeGuideProfile,
};
