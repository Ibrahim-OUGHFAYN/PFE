const cloudinary = require("../config/Cloudinary.js");
const User = require("../models/User.js");
const fs = require("fs");

const Guides = async (req, res) => {
  try {
    const guides = await User.find({role:"guide"});
    res.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const SupLieuParId = async (req, res) => {
  try {
    // place par id
    const place = await Lieu.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // ra adimsh les images g coudeinry
    if (place.images && place.images.length > 0) {
      for (const imageUrl of place.images) {
        try {
          const fileName = imageUrl.split("/").pop().split(".")[0];
          const publicId = `lieu-touristique/${fileName}`;

          console.log("Deleting image from Cloudinary:", publicId);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Cloudinary delete result:", result);
        } catch (error) {
          console.error("Error deleting image from Cloudinary:", error);
          // Continue with other images even if one fails
        }
      }
    }

    // ks adghar g bd
    await Lieu.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Place and images deleted successfully" });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({ error: "Error deleting place" });
  }
};

const AddPlace = async (req, res) => {
  try {
    const { nom, latitude, longitude, description, existingImages } = req.body;

    // Input validation
    if (!nom || !latitude || !longitude || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: nom, latitude, longitude, description"
      });
    }

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates"
      });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "lieu-touristique",
          });
          imageUrls.push(uploadResult.secure_url);

          // Safely delete the temporary file
          if (fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (error) {
              console.error("Error deleting temporary file:", error);
            }
          }
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          // Continue with other images even if one fails
        }
      }
    }

    // Safely parse existingImages
    let parsedExistingImages = [];
    try {
      parsedExistingImages = JSON.parse(existingImages || "[]");
    } catch (error) {
      console.error("Error parsing existingImages:", error);
      parsedExistingImages = [];
    }

    const allImages = [...imageUrls, ...parsedExistingImages];

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
      message: "Failed to add place"
    });
  }
};
const updatePlace = async (req, res) => {
  try {
    const { nom, latitude, longitude, description, oldImages } = req.body;
    const placeId = req.params.id;

    const place = await Lieu.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Parse oldImages safely
    let retainedImages = [];
    try {
      retainedImages = JSON.parse(oldImages || "[]");
    } catch (err) {
      console.error("Failed to parse oldImages:", err);
      return res.status(400).json({ error: "Invalid oldImages format" });
    }

    // Find removed images and delete them from Cloudinary
    const imagesToDelete = place.images.filter(img => !retainedImages.includes(img));
    for (const imageUrl of imagesToDelete) {
      const fileName = imageUrl.split("/").pop().split(".")[0];
      const publicId = `lieu-touristique/${fileName}`;
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", result);
      } catch (err) {
        console.error("Error deleting from Cloudinary:", err);
      }
    }

    // Upload new files
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "lieu-touristique",
          });
          newImageUrls.push(uploadResult.secure_url);

          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error("Error uploading new image:", err);
        }
      }
    }

    const updatedImages = [...retainedImages, ...newImageUrls];

    // Update place
    place.nom = nom;
    place.latitude = latitude;
    place.longitude = longitude;
    place.description = description;
    place.images = updatedImages;

    await place.save();

    return res.status(200).json({
      success: true,
      message: "Place updated successfully",
      data: place,
    });
  } catch (err) {
    console.error("Error updating place:", err);
    return res.status(500).json({ error: "Failed to update place" });
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
  SupLieuParId,
  AddPlace,
  updatePlace,
  getGuideById
};
