const validateLibrary = (req, res, next) => {
    const { name, address, location } = req.body;
    const errors = [];
    const isUpdate = req.method === 'PUT' || req.method === 'PATCH';

    // Name validation (if provided or if creating new)
    if (name !== undefined || !isUpdate) {
        if (!name) {
            errors.push('Name is required');
        } else if (name.length < 3 || name.length > 100) {
            errors.push('Name must be between 3 and 100 characters');
        }
    }

    // Address validation (if provided or if creating new)
    if (address !== undefined || !isUpdate) {
        if (!address) {
            errors.push('Address is required');
        } else {
            if (address.street === '') errors.push('Street address is required');
            if (address.city === '') errors.push('City is required');
            if (address.postcode !== undefined) {
                if (!address.postcode) {
                    errors.push('Postcode is required');
                } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(address.postcode)) {
                    errors.push('Invalid UK postcode format');
                }
            }
            if (address.borough === '') errors.push('Borough is required');
        }
    }

    // Location validation (if provided or if creating new)
    if (location !== undefined || !isUpdate) {
        if (!location || !location.coordinates) {
            errors.push('Location coordinates are required');
        } else {
            const [longitude, latitude] = location.coordinates;
            if (!latitude || !longitude) {
                errors.push('Both latitude and longitude are required');
            } else if (longitude < -180 || longitude > 180) {
                errors.push('Invalid longitude (must be between -180 and 180)');
            } else if (latitude < -90 || latitude > 90) {
                errors.push('Invalid latitude (must be between -90 and 90)');
            }
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    next();
};

module.exports = {
    validateLibrary
}; 