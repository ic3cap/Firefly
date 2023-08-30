const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Gets the API latency'),
    async run(client, interaction) {
        interaction.reply('Pong! Let\'s see..', ephemeral = true)
            .then((result) => {
                return result.edit(`Pong! API Latency is ${Math.round(client.ws.ping)}ms`);
            })
            .catch((err) => {
                console.error(err);
                return interaction.reply('I encountered an error, oops!', ephemeral = true);
            });
    }
}