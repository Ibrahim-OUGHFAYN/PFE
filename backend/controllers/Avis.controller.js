const Avis = require("../models/Avis");

// Controller function to get avis by guide ID
const getAvisByGuideId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received guide id:", id);

    const avisList = await Avis.find({ guide: id })
      .populate("voyageur", "name imgUrl")
      .select("voyageur text date");

    console.log("Raw avisList:", avisList); // 🔍 log the full objects

    const formattedAvis = avisList.map((avis) => {
      console.log("Populated voyageur:", avis.voyageur); // 🔍 each one

      return {
        voyageurName: avis.voyageur?.name || "Inconnu",
        voyageurimg: avis.voyageur?.imgUrl,
        text: avis.text,
        date: avis.date,
      };
    });

    console.log("Formatted to send:", formattedAvis);

    res.status(200).json(formattedAvis);
  } catch (error) {
    console.error("Error fetching avis:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const createAvis = async (req, res) => {
  try {
    const { idvoyageur, idguide, text } = req.body;

    // Basic validation
    if (!idvoyageur || !idguide || !text) {
      return res.status(400).json({
        message: "All fields are required: idvoyageur, idguide, text",
      });
    }

    // Create and save the avis
    const newAvis = new Avis({
      voyageur: idvoyageur,
      guide: idguide,
      text,
    });

    await newAvis.save();

    res
      .status(201)
      .json({ message: "Avis created successfully", avis: newAvis });
  } catch (error) {
    // Handle validation errors or other database errors
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create avis", error: error.message });
  }
};

// Function to get avis by the guide ID from the authenticated user
const getAvisByAuthenticatedGuide = async (req, res) => {
  try {
    // Get the guide ID from the authenticated user in middleware
    const guideId = req.user.userId;
    console.log("Getting avis for authenticated guide:", guideId);
    
    const avisList = await Avis.find({ guide: guideId })
      .populate("voyageur", "name imgUrl")
      .select("voyageur text date");
    
    console.log("Raw avisList for authenticated guide:", avisList);
    
    const formattedAvis = avisList.map((avis) => {
      console.log("Populated voyageur:", avis.voyageur);
      
      return {
        voyageurName: avis.voyageur?.name || "Inconnu",
        voyageurimg: avis.voyageur?.imgUrl,
        text: avis.text,
        date: avis.date,
      };
    });
    
    console.log("Formatted to send:", formattedAvis);
    
    res.status(200).json(formattedAvis);
  } catch (error) {
    console.error("Error fetching avis for authenticated guide:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to delete an avis by ID
const deleteAvis = async (req, res) => {
  try {
    const { avisId } = req.params;
    const userId = req.user.userId; // Get the authenticated user ID from middleware
    
    console.log(`Attempting to delete avis ${avisId} by user ${userId}`);
    
    // First check if the avis exists
    const avis = await Avis.findById(avisId);
    
    if (!avis) {
      return res.status(404).json({ message: "Avis not found" });
    }
    
    // Check if the authenticated user is the guide associated with this avis
    // This ensures guides can only delete avis related to them
    if (avis.guide.toString() !== userId) {
      console.log(`Unauthorized deletion attempt: User ${userId} attempting to delete avis for guide ${avis.guide}`);
      return res.status(403).json({ 
        message: "Unauthorized: You can only delete avis related to your account" 
      });
    }
    
    // Delete the avis
    const deletedAvis = await Avis.findByIdAndDelete(avisId);
    
    console.log(`Successfully deleted avis: ${avisId}`);
    
    res.status(200).json({ 
      message: "Avis deleted successfully", 
      deletedAvis 
    });
    
  } catch (error) {
    console.error("Error deleting avis:", error);
    res.status(500).json({ 
      message: "Server error while deleting avis", 
      error: error.message 
    });
  }
};
module.exports = { getAvisByGuideId, createAvis, getAvisByAuthenticatedGuide,deleteAvis};
