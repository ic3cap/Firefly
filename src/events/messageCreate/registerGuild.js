const db = require('../../../src/database/GuildData.json');
const fs = require('fs');
const template = {
    "prefix": "!",
    "members": {
        "123": {
            "character": {
                "name": "",
                "bounty": 0,
                "age": 0,
                "faction": "",
                "profession": "",
                "hairColor": [],
                "eyeColor": [],
                "traits": [],
                "devilFruit": "",
                "conqueror": false,
                "armament": false,
                "observation": false,
                "crew": "",
                "crewRank": "",
                "lbRank": ""
            },
            "premium": false,
            "xp": 0,
            "level": 0,
            "persistedRoles": [],
            "cards": {
                "characters": [],
                "powerUps": []
            },
            "favoriteCrew": "",
            "crews": [
                {
                    "name": "",
                    "members": [],
                }
            ],
            "inventory": [
                {
                    "name": "",
                    "amount": 1
                }
            ]
        }
    },
    "premium": false,
    "roles": {
        "modRole": "Moderator",
        "adminRole": "Administrator",
        "muteRole": "Muted",
    },
    "channels": {
        "welcomeChannel": "welcome",
        "leaveChannel": "goodbye",
        "logChannel": "logs",
    },
    "messages": {
        "join": {
            "content": "Welcome to the server, {user}!",
            "dm": false
        },
        "leave": {
            "content": "Goodbye, {user}!",
            "dm": false
        }
    },
    "events": {
        "join": true,
        "leave": true
    }
}

const reconcile = (template, data) => {
    for (const key in template) {
        if (!data[key]) {
            if (typeof key == 'object') {
                reconcile(template[key], data);
            } else {
                data[key] = template[key];
            }
        }
    }
}

module.exports = {
    data: {
        name: 'messageCreate',
        type: 'once',
        enabled: true,
        public: true
    },

    run: async (client, guild) => {
        const guildId = guild.id;
        let dbData = JSON.parse(fs.readFileSync(`${__dirname}/../../../src/database/GuildData.json`));
        console.log(dbData);

        if (!dbData[guildId]) {
            const guildData = template;
            dbData[guildId] = guildData;
            fs.writeFileSync(`${__dirname}/../../../src/database.json`, JSON.stringify(dbData));
        }

        return;
    }
}