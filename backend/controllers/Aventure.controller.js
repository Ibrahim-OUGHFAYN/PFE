const cloudinary = require("../config/Cloudinary.js");
const User = require("../models/User.js");

// Fonction utilitaire pour uploader un buffer vers Cloudinary
const uploadBufferToCloudinary = (buffer, folder = "aventures") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Ajouter des aventures (images) à un guide
const addAventures = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré du middleware d'authentification

    // Vérifier si l'utilisateur existe et est un guide
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }
    
    if (user.role !== 'guide') {
      return res.status(403).json({ 
        success: false,
        error: "Seuls les guides peuvent ajouter des aventures" 
      });
    }

    // Vérifier si des images ont été uploadées
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Aucune image fournie"
      });
    }

    let imageUrls = [];
    
    // Upload chaque image vers Cloudinary
    for (const file of req.files) {
      try {
        const uploadResult = await uploadBufferToCloudinary(file.buffer, "aventures");
        imageUrls.push(uploadResult.secure_url);
      } catch (error) {
        console.error("Erreur lors de l'upload vers Cloudinary:", error);
        // Continuer avec les autres images même si une échoue
      }
    }

    if (imageUrls.length === 0) {
      return res.status(500).json({
        success: false,
        error: "Échec de l'upload des images"
      });
    }

    // Ajouter les URLs à la liste des aventures existantes
    user.aventures.push(...imageUrls);
    await user.save();

    return res.status(201).json({
      success: true,
      message: `${imageUrls.length} aventures ajoutées avec succès`,
      data: {
        imageUrls: imageUrls,
        totalAventures: user.aventures.length
      }
    });

  } catch (error) {
    console.error("Erreur lors de l'ajout des aventures:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

// Récupérer toutes les aventures du guide connecté
const getMyAventures = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré du middleware d'authentification

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aventures: user.aventures,
        total: user.aventures.length,
        guide: {
          name: user.name,
          ville: user.ville
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des aventures:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Récupérer les aventures d'un guide par son ID (pour les autres utilisateurs)
const getAventuresByGuideId = async (req, res) => {
  try {
    const { guideId } = req.params;

    const user = await User.findById(guideId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Guide non trouvé" 
      });
    }

    if (user.role !== 'guide') {
      return res.status(400).json({ 
        success: false,
        error: "Cet utilisateur n'est pas un guide" 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        aventures: user.aventures,
        total: user.aventures.length,
        guide: {
          name: user.name,
          ville: user.ville,
          experience: user.experience,
          langues: user.Langues
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des aventures:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Supprimer une aventure spécifique
const deleteAventure = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré du middleware d'authentification
    const { imageUrl } = req.body;

    // Vérifier si l'utilisateur existe et est un guide
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }
    
    if (user.role !== 'guide') {
      return res.status(403).json({ 
        success: false,
        error: "Seuls les guides peuvent supprimer des aventures" 
      });
    }

    // Validation de l'URL
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false,
        error: "URL de l'image requise" 
      });
    }

    const aventureIndex = user.aventures.indexOf(imageUrl);
    if (aventureIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: "Aventure non trouvée" 
      });
    }

    // Supprimer l'image de Cloudinary
    try {
      const fileName = imageUrl.split("/").pop().split(".")[0];
      const publicId = `aventures/${fileName}`;

      console.log("Suppression de l'image de Cloudinary:", publicId);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Résultat de la suppression Cloudinary:", result);
    } catch (error) {
      console.error("Erreur lors de la suppression de Cloudinary:", error);
      // Continuer même si la suppression de Cloudinary échoue
    }

    // Supprimer de la base de données
    user.aventures.splice(aventureIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Aventure supprimée avec succès",
      data: {
        totalAventures: user.aventures.length
      }
    });

  } catch (error) {
    console.error("Erreur lors de la suppression de l'aventure:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

// Mettre à jour les aventures d'un guide (remplacer toutes les aventures)
const updateAventures = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré du middleware d'authentification
    const { oldImages } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    if (user.role !== 'guide') {
      return res.status(403).json({ 
        success: false,
        error: "Seuls les guides peuvent modifier des aventures" 
      });
    }

    // Parser les anciennes images conservées
    let retainedImages = [];
    try {
      retainedImages = JSON.parse(oldImages || "[]");
    } catch (err) {
      console.error("Échec du parsing des oldImages:", err);
      return res.status(400).json({ 
        success: false,
        error: "Format oldImages invalide" 
      });
    }

    // Trouver les images supprimées et les supprimer de Cloudinary
    const imagesToDelete = user.aventures.filter(img => !retainedImages.includes(img));
    for (const imageUrl of imagesToDelete) {
      const fileName = imageUrl.split("/").pop().split(".")[0];
      const publicId = `aventures/${fileName}`;
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Supprimé de Cloudinary:", result);
      } catch (err) {
        console.error("Erreur lors de la suppression de Cloudinary:", err);
      }
    }

    // Upload des nouveaux fichiers
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await uploadBufferToCloudinary(file.buffer, "aventures");
          newImageUrls.push(uploadResult.secure_url);
        } catch (err) {
          console.error("Erreur lors de l'upload de la nouvelle image:", err);
        }
      }
    }

    const updatedAventures = [...retainedImages, ...newImageUrls];

    // Mettre à jour les aventures
    user.aventures = updatedAventures;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Aventures mises à jour avec succès",
      data: {
        aventures: user.aventures,
        totalAventures: user.aventures.length
      }
    });
  } catch (err) {
    console.error("Erreur lors de la mise à jour des aventures:", err);
    return res.status(500).json({ 
      success: false,
      error: "Échec de la mise à jour des aventures" 
    });
  }
};

// Supprimer toutes les aventures d'un guide
const deleteAllAventures = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupéré du middleware d'authentification

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "Utilisateur non trouvé" 
      });
    }

    if (user.role !== 'guide') {
      return res.status(403).json({ 
        success: false,
        error: "Seuls les guides peuvent supprimer des aventures" 
      });
    }

    const totalAventures = user.aventures.length;

    // Supprimer toutes les images de Cloudinary
    if (user.aventures && user.aventures.length > 0) {
      for (const imageUrl of user.aventures) {
        try {
          const fileName = imageUrl.split("/").pop().split(".")[0];
          const publicId = `aventures/${fileName}`;

          console.log("Suppression de l'image de Cloudinary:", publicId);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Résultat de la suppression Cloudinary:", result);
        } catch (error) {
          console.error("Erreur lors de la suppression de Cloudinary:", error);
          // Continuer avec les autres images même si une échoue
        }
      }
    }

    // Vider le tableau des aventures
    user.aventures = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: `${totalAventures} aventures supprimées avec succès`,
      data: {
        totalAventures: 0
      }
    });

  } catch (error) {
    console.error("Erreur lors de la suppression des aventures:", error);
    res.status(500).json({ 
      success: false,
      error: "Erreur serveur" 
    });
  }
};

module.exports = {
  addAventures,
  getMyAventures,
  getAventuresByGuideId,
  deleteAventure,
  updateAventures,
  deleteAllAventures,
};