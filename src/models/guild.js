const { Schema, model } = require('mongoose');
const member = require('./member.js');

module.exports = model('Guild', new Schema({
    CardPool: {
        Common: {
            type: Set
        },
        Uncommon: {
            type: Set
        },
        Rare: {
            type: Set
        },
        Epic: {
            type: Set
        },
        Legendary: {
            type: Set
        },
        Mythical: {
            type: Set
        },
        Seasonal: {
            type: Set
        },
        Exclusive: {
            type: Set
        },
    },
    Members: {
        Member: {
            type: String,
            Data: {
                type: member
            }
        }
    }
}));