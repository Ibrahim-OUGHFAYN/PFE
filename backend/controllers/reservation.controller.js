const Reservation = require("../models/reservation");
const User = require("../models/User");

// Fonction de création de réservation
// POST /api/reservations
const createReservation = async (req, res) => {
  try {
    const { guideId, dates } = req.body;
    // Vérifier si guideId et dates sont fournis
    if (!guideId || !dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un guide et au moins une date",
      });
    }

    // Vérifier que le guide existe
    const guide = await User.findById(guideId);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: `Aucun guide trouvé avec l'ID: ${guideId}`,
      });
    }

    // Vérifier que l'ID est bien celui d'un guide et non d'un voyageur ou admin
    if (guide.role !== "guide") {
      return res.status(400).json({
        success: false,
        message: `L'utilisateur avec l'ID: ${guideId} n'est pas un guide`,
      });
    }

    // Vérifier que les dates sont disponibles
    const availableDates = guide.disponibilites || [];
    const formattedAvailableDates = availableDates.map(
      (date) => date.toISOString().split("T")[0]
    );

    // Formatter les dates de la requête pour la comparaison
    const requestDates = dates.map(
      (date) => new Date(date).toISOString().split("T")[0]
    );

    // Vérifier si toutes les dates demandées sont disponibles
    const allDatesAvailable = requestDates.every((date) =>
      formattedAvailableDates.includes(date)
    );

    if (!allDatesAvailable) {
      return res.status(400).json({
        success: false,
        message: "Certaines dates sélectionnées ne sont plus disponibles",
      });
    }

    // ID du voyageur (utilisateur connecté)
    const userId = req.user.userId;

    // Créer la réservation
    const reservationData = {
      guideId,
      userId,
      dates: dates.map((date) => new Date(date)),
    };

    // Sauvegarder la réservation
    const reservation = await Reservation.create(reservationData);

    // Mettre à jour les disponibilités du guide
    // Retirer les dates réservées des disponibilités
    // Format dates from request to compare with disponibilites
    const dateStringsToRemove = dates.map(
      (date) => new Date(date).toISOString().split("T")[0]
    );

    // Now filter disponibilites
    guide.disponibilites = guide.disponibilites.filter(
      (date) => !dateStringsToRemove.includes(date.toISOString().split("T")[0])
    );
    await guide.save();

    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.error("Erreur lors de la création de la réservation:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de la réservation",
    });
  }
};
const getResbyGuide = async (req, res) => {
  try {
    const guideId = req.user.userId; // Assuming the middleware sets userId

    // Query the database to find reservations where the guide ID matches
    const reservations = await Reservation.find({ guideId: guideId })
      .populate("userId", "name email") // Optional: populate voyageur details
      .sort({ dateReservation: -1 }); // Optional: sort by reservation date, newest first

    // Check if reservations exist
    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this guide" });
    }

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching guide reservations:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
const getResbyVoyageurs = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the middleware sets userId

    // Query the database to find reservations where the voyageur ID matches
    const reservations = await Reservation.find({ userId: userId })
      .populate("guideId", "name email profileImage") // Optional: populate guide details
      .sort({ dateReservation: -1 }); // Optional: sort by reservation date, newest first

    // Check if reservations exist
    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this traveler" });
    }

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching traveler reservations:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status value
    if (!status || !["en_attente", "confirmé", "annulé", "rejeter"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide. Les valeurs acceptées sont: en_attente, confirmé, annulé, rejeter",
      });
    }
    
    // Find the reservation
    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `Aucune réservation trouvée avec l'ID: ${id}`,
      });
    }
    
    // Security check only if user info is available in the request
    if (req.user && req.user.userId) {
      const currentUserId = req.user.userId;
      const userRole = req.user.role;
      
      // Skip this check if req.user isn't properly set
      if (
        userRole !== "admin" &&
        reservation.guideId.toString() !== currentUserId
      ) {
        return res.status(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à modifier cette réservation",
        });
      }
    }
    
    // If status changes to 'annulé' or 'rejeter', restore guide's availability
    if ((status === "annulé" || status === "rejeter") && 
        (reservation.status !== "annulé" && reservation.status !== "rejeter")) {
      // Find the guide
      const guide = await User.findById(reservation.guideId);
      
      if (guide) {
        // Restore the dates to the guide's availability
        // Make a copy of current disponibilites to avoid direct manipulation
        const currentDisponibilites = [...(guide.disponibilites || [])];
        
        // Add back the reservation dates to the guide's availability
        reservation.dates.forEach((date) => {
          // Avoid duplicates by checking if date already exists
          const dateExists = currentDisponibilites.some(
            (d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0]
          );
          
          if (!dateExists) {
            currentDisponibilites.push(date);
          }
        });
        
        // Update guide's disponibilites
        guide.disponibilites = currentDisponibilites;
        await guide.save();
      }
    }
    
    // Update reservation status
    reservation.status = status;
    await reservation.save();
    
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (err) {
    console.error(
      "Erreur lors de la mise à jour du statut de la réservation:",
      err
    );
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du statut de la réservation",
    });
  }
};

module.exports = {
  getResbyVoyageurs,
  getResbyGuide,
  createReservation,
  updateReservationStatus,
};
