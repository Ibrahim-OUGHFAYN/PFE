const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlware/authMiddleware'); // Ajustez le chemin
const {
  addAventures,
  getMyAventures,
  getAventuresByGuideId,
  deleteAventure,
  updateAventures,
  deleteAllAventures,
} = require('../controllers/Aventure.controller'); // Ajustez le chemin

const router = express.Router();

// Configuration de multer pour gérer les fichiers en mémoire (pas de stockage local)
const storage = multer.memoryStorage(); // Stockage en mémoire pour upload direct vers Cloudinary

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB par fichier
    files: 10 // Maximum 10 fichiers
  },
  fileFilter: fileFilter
});

// Middleware de gestion d'erreurs pour multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux. Taille maximale: 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Trop de fichiers. Maximum: 10 fichiers'
      });
    }
  }
  if (err.message === 'Seules les images sont autorisées') {
    return res.status(400).json({
      success: false,
      error: 'Seules les images sont autorisées'
    });
  }
  next(err);
};

// =====================================
// ROUTES PROTÉGÉES (nécessitent l'authentification)
// =====================================

// Ajouter des aventures - POST /api/aventures
router.post('/aventures', 
  authMiddleware, 
  upload.array('aventures', 10), 
  handleMulterError,
  addAventures
);

// Récupérer mes aventures - GET /api/my-aventures
router.get('/my-aventures', 
  authMiddleware, 
  getMyAventures
);

// Mettre à jour mes aventures - PUT /api/aventures
router.put('/aventures', 
  authMiddleware, 
  upload.array('aventures', 10), 
  handleMulterError,
  updateAventures
);

// Supprimer une aventure spécifique - DELETE /api/aventure
router.delete('/aventure', 
  authMiddleware, 
  deleteAventure
);

// Supprimer toutes mes aventures - DELETE /api/aventures
router.delete('/aventures', 
  authMiddleware, 
  deleteAllAventures
);

// =====================================
// ROUTES PUBLIQUES (pas d'authentification requise)
// =====================================

// Récupérer les aventures d'un guide par son ID - GET /api/guide/:guideId/aventures
router.get('/guide/:guideId/aventures', 
  getAventuresByGuideId
);

// =====================================
// ROUTE DE TEST (optionnelle)
// =====================================

// Test route pour vérifier l'authentification
router.get('/test-auth', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Authentification réussie',
    user: {
      userId: req.user.userId,
      iat: req.user.iat,
      exp: req.user.exp
    }
  });
});

module.exports = router;