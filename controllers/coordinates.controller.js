const { User, Coordinate } = require('../db/index');
const { findNearbyCoordinates } = require('../utils/geoUtils');

const locateMe = async (req, res) => {
    const { latitude, longitude } = req.body;
    const user = await User.findById(req.user.id);
    if (!latitude || !longitude) {
        return res
            .status(400)
            .json({ message: 'latitude and longitude are required' });
    }

    const nearbyCoordinate = await findNearbyCoordinates(latitude, longitude);
    if (nearbyCoordinate) {
        return res.status(200).json({
            message: 'You are near a coordinate',
            // nearbyCoordinate,
        });
    }

    try {
        const newCoordinate = new Coordinate({
            user: user._id,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });
        await newCoordinate.save();
        user.coordinates.push(newCoordinate);
        await user.save();

        return res.status(201).json({ message: 'Coordinate saved' });
    } catch (error) {
        console.error('Error saving coordinate:', error);
        return res.status(500).json({ message: 'Failed to save coordinate' });
    }
};

const getCoordinates = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('coordinates');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user.coordinates);
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return res.status(500).json({ message: 'Failed to get coordinates' });
    }
};

const resolveCoordinate = async (req, res) => {
    console.log('here!!!');
    try {
        const { id } = req.params;
        const coordinate = await Coordinate.findById(id);
        if (!coordinate) {
            return res.status(404).json({ message: 'Coordinate not found' });
        }
        coordinate.isResolved = true;
        coordinate.isResolvedAt = new Date();
        await coordinate.save();
        return res.status(200).json({ message: 'Coordinate resolved' });
    } catch (error) {
        console.error('Error resolving coordinate:', error);
        return res
            .status(500)
            .json({ message: 'Failed to resolve coordinate' });
    }
};

const getAllCoordinates = async (req, res) => {
    try {
        const coordinates = await Coordinate.find();
        return res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return res.status(500).json({ message: 'Failed to get coordinates' });
    }
};

module.exports = {
    locateMe,
    getCoordinates,
    resolveCoordinate,
    getAllCoordinates,
};
