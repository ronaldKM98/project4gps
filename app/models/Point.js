/**
 * The Point model in the database
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PointSchema = new Schema({
    routeId: {
        type: String,
        index: true,
    },
    lat: {
        type: Number,
        index: true
    },
    lon: {
        type: Number,
        index: true
    },
    userId: {
        type: String,
        index: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Point', PointSchema);