const validateLibrary = (req, res, next) => {
    const { name, address, location, openingHours } = req.body;
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

    // Opening Hours validation (only if provided)
    if (openingHours !== undefined) {  // Only validate if hours are included
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // HH:MM format

        days.forEach(day => {
            if (openingHours[day]) {
                const { open, close } = openingHours[day];

                // Validate time format
                if (open && !timeFormat.test(open)) {
                    errors.push(`Invalid opening time format for ${day} (use HH:MM)`);
                }
                if (close && !timeFormat.test(close)) {
                    errors.push(`Invalid closing time format for ${day} (use HH:MM)`);
                }

                // Both open and close must be provided if either is
                if ((open && !close) || (!open && close)) {
                    errors.push(`${day}: Both opening and closing times must be provided`);
                }

                // Validate open before close
                if (open && close) {
                    const openTime = new Date(`1970-01-01T${open}`);
                    const closeTime = new Date(`1970-01-01T${close}`);
                    
                    if (openTime >= closeTime) {
                        errors.push(`${day}: Opening time must be before closing time`);
                    }
                }
            }
        });
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