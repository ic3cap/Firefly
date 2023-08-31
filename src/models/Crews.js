const { Schema, model } = require('mongoose');
// Wouldn't you make a schema for a crew, not crews?
module.exports = model('Crews', new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    favoriteCrew: {
        type: String,
        default: ''
    },
    crew1: {
        type: String,
        default: ''
    },
    crew2: {
        type: String,
        default: ''
    },
    crew3: {
        type: String,
        default: ''
    },
    crew4: {
        type: String,
        default: ''
    },
    crew5: {
        type: String,
        default: ''
    }
}));