const { Client, Guild } = require('discord.js');
const guild = require('../../models/guild.js');

module.exports = {
    data: {
        name: 'guildCreate',
        type: 'on',
        enabled: true,
        public: true
    },

    /**
     *
     * @param { Client } client
     * @param { Guild } guild
     */
    run: async (client, guild) => {
        console.log(guild.id);
        const registered = await models.Guild.findOne({ GuildID: guild.id });

        if (registered) return console.log(`Guild ${guild.id} already registered.`);

        //const guildData = new guild({})
        console.log(`Guild ${guild.id} is not registered.`);

    }
}