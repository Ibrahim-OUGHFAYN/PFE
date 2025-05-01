const cloudinary = require("../config/Cloudinary.js"); // Ensure Cloudinary is required
const Lieu = require("../models/Place.js");

const Places = async (req, res) => {
  try {
    const places = await Lieu.find({});
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



const SupLieuParId = async (req, res) => {
  try {
    // Find the place by its ID
    const place = await Lieu.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Debugging: Log the place and images
    console.log("Deleting place:", place);
    console.log("Images to delete:", place.images);

    // Check if the place has images and proceed to delete them from Cloudinary
    if (place.images && place.images.length > 0) {
      for (const imageUrl of place.images) {
        // Extract the public ID from the image URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        console.log("Deleting image from Cloudinary:", publicId);

        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary delete result:", result);
      }
    }

    // Finally, delete the place from the database
    await Lieu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Lieux et images supprimés avec succès" });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({ error: "Erreur lors de la suppression de lieu" });
  }
}
const AddPlace = async (req, res) => {
  try {
    const { nom, latitude, longitude, description, existingImages } = req.body;

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "lieu-touristique",
        });
        imageUrls.push(uploadResult.secure_url);

        const fs = require("fs");
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    const allImages = [...imageUrls, ...JSON.parse(existingImages || "[]")];

    const newPlace = new Lieu({
      nom,
      description,
      latitude,
      longitude,
      images: allImages,
    });

    const savedPlace = await newPlace.save();

    return res.status(201).json({
      success: true,
      message: "Place added successfully",
      data: savedPlace,
    });
  } catch (error) {
    console.error("Error adding place:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add place",
    });
  }
};

module.exports = {
  Places,
  SupLieuParId,
  AddPlace,
};
