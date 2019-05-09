/**
 * The Route model in the database
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const RouteSchema = new Schema({
    userId: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Route', RouteSchema);