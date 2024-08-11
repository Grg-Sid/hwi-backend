const mongoose = require('mongoose');
const { DB_URI } = process.env;
mongoose.connect(DB_URI);

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, unique: false },
    lastName: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'gov'] },
    coordinates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coordinate' }],
});

const CoordinateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
        type: {
            type: String,
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    createdAt: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false },
    isResolvedAt: { type: Date },
});

CoordinateSchema.index({ location: '2dsphere' });

const Coordinate = mongoose.model('Coordinate', CoordinateSchema);

const User = mongoose.model('User', UserSchema);

module.exports = { User, Coordinate };
