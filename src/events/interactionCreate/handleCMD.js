module.exports = {
    data: {
        name: 'interactionCreate',
        type: 'on',
        enabled: true,
        public: true
    },

    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const cmdData = client.commands.get(interaction.commandName);
        if (cmdData) {
            await cmdData.run(client, interaction)
                .catch(err => {
                    console.log(`Error running command!\nCommand: ${interaction.commandName}\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                });
        } else {
            return;
        }
    }
}