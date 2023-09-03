const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the API latency'),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        interaction.reply({ content: 'Pong! Let\'s see..', ephemeral: true },)
            .then(result => {
                return result.edit(`Pong! API Latency is ${Math.round(client.ws.ping)}ms`);
            })
            .catch(err => {
                console.error(err);
                return interaction.reply({ content: 'An error occurred while trying to get the API latency!', ephemeral: true });
            });
    }
}