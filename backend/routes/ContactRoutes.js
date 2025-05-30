const express = require('express');
const router = express.Router();
const { 
  voyageurContacteGuide, 
  guideContacteVoyageur, 
  obtenirMesContacts,
  getVoyageursOfGuide,
  getGuidesOfVoyageur
} = require('../controllers/Contact.controller');
const authMiddleware = require('../middlware/authMiddleware'); 

// Voyageur contacte un guide
router.post('/cguide/:guideId', authMiddleware, voyageurContacteGuide);

// Guide contacte un voyageur
router.post('/cvoyageur/:voyageurId', authMiddleware, guideContacteVoyageur);

// Obtenir tous les contacts de l'utilisateur connecté
router.get('/contacts', authMiddleware, obtenirMesContacts);

// Obtenir les voyageurs qui ont contacté le guide (auth)
router.get('/allvoyageurs', authMiddleware, getVoyageursOfGuide);

// Obtenir les guides que le voyageur a contactés (auth)
router.get('/allguides', authMiddleware, getGuidesOfVoyageur);

module.exports = router;
