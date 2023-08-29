module.exports = {
    name: 'ping',
    description: 'Gets the bot and API latency',
    async run(client, interaction) {
        interaction.reply('Pong! Let\'s see..', ephemeral = true)
            .then((result) => {
                return result.edit(`Pong! The bot latency is ${interaction.createdTimestamp - result.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping) <= 0 ? 0 : Math.round(client.ws.ping)}ms.`);
            })
            .catch((err) => {
                console.error(err);
                return interaction.reply('I encountered an error, oops!', ephemeral = true);
            });
    }
}