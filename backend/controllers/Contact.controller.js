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
      sender: voyageurId,    // voyageur sends
      receiver: guideId,     // guide receives
      text: text.trim()
    });

    const contactSauvegarde = await nouveauContact.save();

    await contactSauvegarde.populate([
      { path: 'sender', select: 'name email imgUrl' },
      { path: 'receiver', select: 'name email ville imgUrl' }
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
      sender: guideId,       // guide sends
      receiver: voyageurId,  // voyageur receives
      text: text.trim()
    });

    const contactSauvegarde = await nouveauContact.save();

    await contactSauvegarde.populate([
      { path: 'sender', select: 'name email ville imgUrl' },
      { path: 'receiver', select: 'name email imgUrl' }
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
        { sender: utilisateurConnecteId },
        { receiver: utilisateurConnecteId }
      ]
    })
    .populate('sender', 'name email imgUrl ville')
    .populate('receiver', 'name email imgUrl ville')
    .sort({ dateEnvoi: -1 });

    const contactsFormated = contacts.map(contact => ({
      _id: contact._id,
      text: contact.text,
      dateEnvoi: contact.dateEnvoi,
      sender: {
        _id: contact.sender._id,
        name: contact.sender.name,
        email: contact.sender.email,
        imgUrl: contact.sender.imgUrl,
        ville: contact.sender.ville
      },
      receiver: {
        _id: contact.receiver._id,
        name: contact.receiver.name,
        email: contact.receiver.email,
        imgUrl: contact.receiver.imgUrl,
        ville: contact.receiver.ville
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

    // Find all contacts where guide is either sender or receiver
    const contacts = await Contact.find({
      $or: [
        { sender: guideId },
        { receiver: guideId }
      ]
    })
    .populate('sender', 'name imgUrl')
    .populate('receiver', 'name imgUrl');

    // Get unique voyageurs (users who are not the guide)
    const voyageursMap = new Map();
    
    contacts.forEach(contact => {
      if (contact.sender._id.toString() !== guideId) {
        voyageursMap.set(contact.sender._id.toString(), contact.sender);
      }
      if (contact.receiver._id.toString() !== guideId) {
        voyageursMap.set(contact.receiver._id.toString(), contact.receiver);
      }
    });

    const voyageursDetails = Array.from(voyageursMap.values());

    res.status(200).json({
      success: true,
      message: 'Voyageurs récupérés avec succès',
      data: voyageursDetails
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

    // Find all contacts where voyageur is either sender or receiver
    const contacts = await Contact.find({
      $or: [
        { sender: voyageurId },
        { receiver: voyageurId }
      ]
    })
    .populate('sender', 'name imgUrl ville')
    .populate('receiver', 'name imgUrl ville');

    // Get unique guides (users who are not the voyageur)
    const guidesMap = new Map();
    
    contacts.forEach(contact => {
      if (contact.sender._id.toString() !== voyageurId) {
        guidesMap.set(contact.sender._id.toString(), contact.sender);
      }
      if (contact.receiver._id.toString() !== voyageurId) {
        guidesMap.set(contact.receiver._id.toString(), contact.receiver);
      }
    });

    const guidesDetails = Array.from(guidesMap.values());

    res.status(200).json({
      success: true,
      message: 'Guides récupérés avec succès',
      data: guidesDetails
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