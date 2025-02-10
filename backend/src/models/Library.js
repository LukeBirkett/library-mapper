const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Library name is required'],
        trim: true
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            default: 'London'
        },
        postcode: {
            type: String,
            required: [true, 'Postcode is required']
        },
        borough: {
            type: String,
            required: [true, 'Borough is required']
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: [true, 'Coordinates are required']
        }
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    photos: [{
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    }
});

// Index for geospatial queries
librarySchema.index({ location: '2dsphere' });

// Index for text search
librarySchema.index({ name: 'text', 'address.postcode': 'text' });

const Library = mongoose.model('Library', librarySchema);

module.exports = Library; 