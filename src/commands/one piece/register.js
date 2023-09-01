const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Sets your server up for One Piece commands'),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        interaction.reply('Setting up..', ephemeral = true)
    }
}