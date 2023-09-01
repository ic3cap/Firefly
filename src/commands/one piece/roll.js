const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a random One Piece character'),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        //
    }
}