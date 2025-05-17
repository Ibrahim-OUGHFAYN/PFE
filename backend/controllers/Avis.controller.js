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

module.exports = { getAvisByGuideId, createAvis };
