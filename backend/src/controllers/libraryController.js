const Library = require('../models/Library');

// @desc    Create new library
// @route   POST /api/libraries
// @access  Private
exports.createLibrary = async (req, res) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const library = await Library.create(req.body);

        // Add library to user's contributions
        req.user.contributions.libraries.push(library._id);
        await req.user.save();

        res.status(201).json({
            success: true,
            data: library
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all libraries
// @route   GET /api/libraries
// @access  Public
exports.getLibraries = async (req, res) => {
    try {
        const libraries = await Library.find();
        
        res.status(200).json({
            success: true,
            count: libraries.length,
            data: libraries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single library
// @route   GET /api/libraries/:id
// @access  Public
exports.getLibrary = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id);

        if (!library) {
            return res.status(404).json({
                success: false,
                message: 'Library not found'
            });
        }

        res.status(200).json({
            success: true,
            data: library
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update library
// @route   PUT /api/libraries/:id
// @access  Private
exports.updateLibrary = async (req, res) => {
    try {
        let library = await Library.findById(req.params.id);

        if (!library) {
            return res.status(404).json({
                success: false,
                message: 'Library not found'
            });
        }

        // Make sure user is the creator
        if (library.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this library'
            });
        }

        library = await Library.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: library
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete library
// @route   DELETE /api/libraries/:id
// @access  Private
exports.deleteLibrary = async (req, res) => {
    try {
        const library = await Library.findById(req.params.id);

        if (!library) {
            return res.status(404).json({
                success: false,
                message: 'Library not found'
            });
        }

        // Make sure user is the creator
        if (library.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this library'
            });
        }

        await library.deleteOne();

        // Remove from user's contributions
        const index = req.user.contributions.libraries.indexOf(req.params.id);
        if (index > -1) {
            req.user.contributions.libraries.splice(index, 1);
            await req.user.save();
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 