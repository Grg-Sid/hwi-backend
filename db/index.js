const mongoose = require('mongoose');
const { DB_URI } = process.env;
mongoose.connect(DB_URI);

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, unique: false },
    lastName: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'govUser'] },
    coordinates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coordinate' }],
});

const CoordinateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    isResolved: { type: Boolean, default: false },
    isResolvedAt: { type: Date },
});

const User = mongoose.model('User', UserSchema);
const Coordinate = mongoose.model('Coordinate', CoordinateSchema);

module.exports = { User, Coordinate };
