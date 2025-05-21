const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dates: {
    type: [Date],
    required: true,
    validate: {
      validator: function(dates) {
        return dates && dates.length > 0;
      },
      message: "Veuillez sélectionner au moins une date pour votre réservation"
    }
  },
  status: {
    type: String,
    enum: ["en_attente", "confirmé", "annulé"],
    default: "en_attente"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances des requêtes
ReservationSchema.index({ guideId: 1, dates: 1 });

module.exports = mongoose.model("Reservation", ReservationSchema);