const db = '../../../src/database/GuildData.json';
const CardUtils = require('../../utils/card.js');
const fs = require('fs');
const templates = {
    member: JSON.parse(fs.readFileSync(`${__dirname}/../../templates/member.json`))
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
        name: 'guildCreate',
        type: 'on',
        enabled: true,
        public: true
    },

    run: async (client, guild) => {
        const guildId = guild.id;
        const dbData = JSON.parse(fs.readFileSync(`${__dirname}/${db}`));
        if (!dbData[guildId]) {
            const guildData = { members: new Set(), cardPool: {} };
            dbData[guildId] = guildData;
            fs.writeFileSync(`${__dirname}/../../../src/database/GuildData.json`, JSON.stringify(dbData));
            console.log(`Registered guild ${guild.name} (${guild.id})`);
        } else {
            console.log(`Guild ${guild.name} (${guild.id}) already registered`);
        };

        return;
    }
}