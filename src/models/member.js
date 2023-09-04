const { Schema, model } = require('mongoose');

module.exports = model('member', new Schema({
    Cards: {
        Characters: {
            type: Set
        },
        PowerUps: {
            type: Set
        },
        Items: {
            type: Set
        }
    },
    Spins: {
        Daily: {
            type: Number,
            default: 10
        },
        Uncommon: {
            type: Number,
            default: 0
        },
        Rare: {
            type: Number,
            default: 0
        },
        Epic: {
            type: Number,
            default: 0
        },
        Legendary: {
            type: Number,
            default: 0
        },
        Mythical: {
            type: Number,
            default: 0
        },
        Seasonal: {
            type: Number,
            default: 0
        },
        Exclusive: {
            type: Number,
            default: 0
        }
    }
}));