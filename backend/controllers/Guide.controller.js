const cloudinary = require("../config/Cloudinary.js");
const User = require("../models/User.js");
const fs = require("fs");
const streamifier = require("streamifier");

const Guides = async (req, res) => {
  try {
    const guides = await User.find({ role: "guide" });
    res.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateGuideProfile = async (req, res) => {
  try {
    const guide = await User.findById(req.user.userId);
    if (!guide)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    if (guide.role !== "guide")
      return res.status(403).json({ message: "Accès refusé" });

    const { name, email, Langues, experience, ville } = req.body;

    if (name) guide.name = name;
    if (email) guide.email = email;
    if (Langues) guide.Langues =Array.isArray(Langues)
          ? Langues
          : (() => {
              try {
                return JSON.parse(Langues);
              } catch {
                return Langues.split(",");
              }
            })();
    if (experience) guide.experience = experience;
    if (ville) guide.ville = ville;

    // Upload de l'image si présente
    if (req.file) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      const result = await streamUpload(req.file.buffer);
      guide.imgUrl = result.secure_url;
    }

    await guide.save();
    res.status(200).json({ message: "Profil mis à jour", guide });
  } catch (err) {
    console.error("Erreur mise à jour profil guide :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//get guide by id -the id is in the url

const getGuideById = async (req, res) => {
  try {
    const guide = await User.findOne({ _id: req.params.id, role: "guide" });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    res.status(200).json(guide);
  } catch (error) {
    console.error("Error fetching guide by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  Guides,
  updateGuideProfile,
  getGuideById,
};
