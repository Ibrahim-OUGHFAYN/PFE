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
const getDisponibilitesGuide = async (req, res) => {
  try {
    const { guideId } = req.params; // ID du guide depuis les paramètres de l'URL

    // Vérifier si le guide existe et a le rôle "guide"
    const guide = await User.findById(guideId);
    if (!guide) {
      return res.status(404).json({ message: "Guide non trouvé." });
    }

    if (guide.role !== "guide") {
      return res
        .status(400)
        .json({ message: "L'utilisateur spécifié n'est pas un guide." });
    }

    // Récupérer les disponibilités
    let disponibilites = guide.disponibilites || [];

    // Tri des disponibilités par date (croissant)
    disponibilites.sort((a, b) => new Date(a) - new Date(b));

    // Éliminer les doublons (comme dans votre exemple où "2025-05-16" apparaît deux fois)
    const disponibilitesUniques = disponibilites.filter(
      (date, index, self) =>
        index ===
        self.findIndex(
          (d) => new Date(d).getTime() === new Date(date).getTime()
        )
    );
    console.log("=>", disponibilitesUniques);
    res.status(200).json({
      message: "Disponibilités récupérées avec succès.",
      disponibilites: disponibilitesUniques,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  updateDisponibilitesGuide,
  getDisponibilitesGuide,
};
