const { Schema, model } = require('mongoose');

module.exports = model('Inventory', new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    cards: {
        type: String,
        default: ''
    },
    powerUps: {
        type: String,
        default: ''
    },
    items: {
        type: String,
        default: ''
    }
}));