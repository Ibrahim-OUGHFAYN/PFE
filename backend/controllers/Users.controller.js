const User = require("../models/User.js");

const users = async (req, res) => {
  try {
    const voyageurs = await User.find({});
    res.json(voyageurs);
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

module.exports = {
  users,
  SupUserParId,
};
