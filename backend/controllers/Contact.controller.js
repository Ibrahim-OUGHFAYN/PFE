const Contact = require('../models/Contact');

// Voyageur contacte un guide (ID guide dans les paramètres, ID voyageur dans auth middleware)
const voyageurContacteGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const voyageurId = req.user.userId; // Vient du middleware d'authentification
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas être vide'
      });
    }

    const nouveauContact = new Contact({
      voyageur: voyageurId,
      guide: guideId,
      text: text.trim()
    });

    const contactSauvegarde = await nouveauContact.save();

    await contactSauvegarde.populate([
      { path: 'voyageur', select: 'name email' },
      { path: 'guide', select: 'name email ville' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Contact créé avec succès',
      data: contactSauvegarde
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contact',
      error: error.message
    });
  }
};

// Guide contacte un voyageur (ID voyageur dans les paramètres, ID guide dans auth middleware)
const guideContacteVoyageur = async (req, res) => {
  try {
    const { voyageurId } = req.params;
    const guideId = req.user.userId;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas être vide'
      });
    }

    const nouveauContact = new Contact({
      voyageur: voyageurId,
      guide: guideId,
      text: text.trim()
    });

    const contactSauvegarde = await nouveauContact.save();

    await contactSauvegarde.populate([
      { path: 'voyageur', select: 'name email' },
      { path: 'guide', select: 'name email ville' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Contact créé avec succès',
      data: contactSauvegarde
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du contact',
      error: error.message
    });
  }
};

// Obtenir tous les contacts qui contiennent l'utilisateur authentifié
const obtenirMesContacts = async (req, res) => {
  try {
    const utilisateurConnecteId = req.user.userId;

    const contacts = await Contact.find({
      $or: [
        { voyageur: utilisateurConnecteId },
        { guide: utilisateurConnecteId }
      ]
    })
    .populate('voyageur', 'name email imgUrl')
    .populate('guide', 'name email imgUrl ville')
    .sort({ dateEnvoi: -1 });

    const contactsFormated = contacts.map(contact => ({
      _id: contact._id,
      text: contact.text,
      dateEnvoi: contact.dateEnvoi,
      voyageur: {
        _id: contact.voyageur._id,
        name: contact.voyageur.name,
        email: contact.voyageur.email,
        imgUrl: contact.voyageur.imgUrl
      },
      guide: {
        _id: contact.guide._id,
        name: contact.guide.name,
        email: contact.guide.email,
        imgUrl: contact.guide.imgUrl,
        ville: contact.guide.ville
      }
    }));

    res.status(200).json({
      success: true,
      message: 'Tous vos contacts récupérés avec succès',
      data: contactsFormated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contacts',
      error: error.message
    });
  }
};

const getVoyageursOfGuide = async (req, res) => {
  try {
    const guideId = req.user.userId;

    const voyageurs = await Contact.find({ guide: guideId })
      .populate('voyageur', 'name imgUrl')
      .distinct('voyageur');

    const voyageursDetails = await Promise.all(
      voyageurs.map(async (voyageurId) => {
        const contact = await Contact.findOne({ voyageur: voyageurId, guide: guideId })
          .populate('voyageur', 'name imgUrl');
        return contact?.voyageur;
      })
    );

    res.status(200).json({
      success: true,
      message: 'Voyageurs récupérés avec succès',
      data: voyageursDetails.filter(Boolean)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des voyageurs',
      error: error.message
    });
  }
};
const getGuidesOfVoyageur = async (req, res) => {
  try {
    const voyageurId = req.user.userId;

    const guides = await Contact.find({ voyageur: voyageurId })
      .populate('guide', 'name imgUrl ville')
      .distinct('guide');

    const guidesDetails = await Promise.all(
      guides.map(async (guideId) => {
        const contact = await Contact.findOne({ guide: guideId, voyageur: voyageurId })
          .populate('guide', 'name imgUrl ville');
        return contact?.guide;
      })
    );

    res.status(200).json({
      success: true,
      message: 'Guides récupérés avec succès',
      data: guidesDetails.filter(Boolean)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des guides',
      error: error.message
    });
  }
};


module.exports = {
  voyageurContacteGuide,
  guideContacteVoyageur,
  obtenirMesContacts,
  getVoyageursOfGuide,
  getGuidesOfVoyageur
};
