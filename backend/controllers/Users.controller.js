const User = require("../models/User.js");

const users = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const SupUserParId = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};
const UpdateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    if (updates.password) {
      return res
        .status(400)
        .json({
          error: "La mise à jour du mot de passe n'est pas autorisée ici.",
        });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Upload profile image if provided
    if (req.files?.imgUrl) {
      const profileUpload = await cloudinary.uploader.upload(
        req.files.imgUrl[0].path,
        {
          folder: "users/profiles",
        }
      );
      updates.imgUrl = profileUpload.secure_url;
    }

    // Upload aventures images if provided and user is a guide
    if (user.role === "guide" && req.files?.aventures) {
      const aventureUrls = await Promise.all(
        req.files.aventures.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "users/aventures",
          });
          return result.secure_url;
        })
      );
      updates.aventures = aventureUrls;
    }

    if (user.role !== "guide") {
      delete updates.experience;
      delete updates.disponibilites;
      delete updates.aventures;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({
        message: "Utilisateur mis à jour avec succès",
        user: updatedUser,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};

module.exports = {
  users,
  SupUserParId,
  UpdateUserById,
};
