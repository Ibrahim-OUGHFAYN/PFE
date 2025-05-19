const User = require("../models/User");

// Controller function to get avis by guide ID
const updateDisponibilitesGuide = async (req, res) => {
  try {
    const userId = req.user.userId; // injecté par ton middleware JWT
    const { disponibilites } = req.body;

    // Vérifier si c’est un guide
    const user = await User.findById(userId);
    if (!user || user.role !== "guide") {
      return res.status(403).json({ message: "Accès interdit. Non autorisé." });
    }

    // Mettre à jour les disponibilités
    user.disponibilites = disponibilites;
    await user.save();

    res.status(200).json({
      message: "Disponibilités mises à jour avec succès.",
      disponibilites: user.disponibilites,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des disponibilités :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  updateDisponibilitesGuide,
};