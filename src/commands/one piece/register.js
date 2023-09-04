const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Sets your server up for One Piece commands')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, true),
    /**
     *
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {

    }
}