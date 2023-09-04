const Rarity = require('../enums/rarity.js');
const fs = require('fs');

const paths = {
    guildDB: '../database/GuildData.json',
    cardDB: '../database/CardData.json'
};

module.exports = {
    async userHasRolls(guildID, userID, type) {
        const guildDB = JSON.parse(fs.readFileSync(`${__dirname}/${paths.guildDB}`));
        const guildData = guildDB[guildID];
        const userData = guildData && guildData.members[userID];

        if (!guildData) return 'GuildUnregistered';
        if (!userData) return 'UserUnregistered';
        if (!userData.rolls[type].amount === 0) return 'NoRolls';

        return true;
    },

    async rollRarity() {
        const randomNum = Math.floor(Math.random() * (100 - 0 + 1) + 0);
        let cumulativePercentage = 0;
        for (let tier of Object.keys(Rarity)) {
            tier = Rarity[tier];
            cumulativePercentage += tier.percentage;
            if (randomNum <= cumulativePercentage) {
                return tier.name;
            }
        }
    },

    async rollCard(guildID, userID, rarity, rollType) {
        const guildDB = JSON.parse(fs.readFileSync(`${__dirname}/${paths.guildDB}`));
        const guildData = guildDB[guildID];

        const userData = guildData.members[userID];
        const cardPool = guildData.cardPool[rarity];

        const randomNum = Math.floor(Math.random() * ((cardPool.length - 1) - 0 + 1) + 0);
        let card = cardPool[randomNum];

        for (const plrCard in userData.cards) {
            if (userData.cards[plrCard].name === card.name) {
                return this.rollCard(guildID, userID, rarity, rollType);
            }
        }

        userData.cards.push(card);
        userData.rolls[rollType] -= 1;

        cardPool[randomNum].splice(randomNum, 1);

        fs.writeFileSync(`${__dirname}/${paths.guildDB}`, JSON.stringify(guildDB));
        return card;
    },

    getRarityByStars(stars) {
        for (let tier of Object.keys(Rarity)) {
            tier = Rarity[tier];
            if (tier.stars === stars) {
                return tier.name;
            }
        }
    },

    getStarsByRarity(rarity) {
        for (let tier of Object.keys(Rarity)) {
            tier = Rarity[tier];
            if (tier.name === rarity) {
                return tier.stars;
            }
        }
    },

    async buildCardPool(memberCount) {
        const cards = JSON.parse(fs.readFileSync(`${__dirname}/${paths.cardDB}`));
        const cardPool = {
            Common: [],
            Uncommon: [],
            Rare: [],
            Epic: [],
            Legendary: [],
            Mythical: [],
            Seasonal: [],
            Exclusive: []
        };

        for (const cardType in cards) {
            for (const card in cards[cardType]) {

                const cardData = cards[cardType][card];
                const name = cardData.name;
                const availability = cardData.availability;
                const rarity = this.getRarityByStars(cardData.stars);
                const amount = Math.ceil(memberCount * availability) > 0 ? Math.ceil(memberCount * availability) : 1;

                for (let i = 0; i < amount; i++) {
                    cardPool[rarity].push({ name: name, stars: cardData.stars, rarity: rarity });
                }
            }
        }

        return cardPool;
    }
}