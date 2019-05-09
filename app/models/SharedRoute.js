/**
 * The Shared Route model in the database
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SharedRouteSchema = new Schema({
    route:{
        type: String,
        required: true
    },
    viewers:{
        type: [String],
        require: false
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('SharedRoute', SharedRouteSchema);