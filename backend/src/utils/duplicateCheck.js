const Library = require('../models/Library');

const checkForDuplicates = async (library) => {
    const duplicateChecks = [];

    // Check for exact address match
    const addressMatch = await Library.findOne({
        'address.postcode': library.address.postcode,
        'address.street': library.address.street,
        _id: { $ne: library._id }  // Exclude current library (for updates)
    });

    if (addressMatch) {
        duplicateChecks.push({
            type: 'exact_address',
            message: 'A library already exists at this address',
            match: addressMatch
        });
    }

    // Check for nearby libraries with similar names
    const nearbyLibraries = await Library.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: library.location.coordinates
                },
                $maxDistance: 500  // Within 500 meters
            }
        },
        _id: { $ne: library._id }
    });

    // Simple name similarity check (can be improved)
    const similarNames = nearbyLibraries.filter(lib => {
        const name1 = lib.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const name2 = library.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return name1 === name2;
    });

    if (similarNames.length > 0) {
        duplicateChecks.push({
            type: 'similar_nearby',
            message: 'Similar libraries found nearby',
            matches: similarNames
        });
    }

    return duplicateChecks;
};

module.exports = {
    checkForDuplicates
}; 