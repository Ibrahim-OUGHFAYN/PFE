const mongoose = require('mongoose');

const LieuTouristiqueSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  }
});

const LieuTouristique = mongoose.model('LieuTouristique', LieuTouristiqueSchema);

module.exports = LieuTouristique;
