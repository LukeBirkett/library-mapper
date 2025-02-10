const express = require('express');
const router = express.Router();
const {
    createLibrary,
    getLibraries,
    getLibrary,
    updateLibrary,
    deleteLibrary
} = require('../controllers/libraryController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getLibraries);
router.get('/:id', getLibrary);

// Protected routes
router.post('/', protect, createLibrary);
router.put('/:id', protect, updateLibrary);
router.delete('/:id', protect, deleteLibrary);

module.exports = router; 