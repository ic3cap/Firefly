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
            // field check (tester?)
            await cmdData.run(client, interaction)
                /* When uncommented enabled makes debugging a pain cause no stack trace.
                .catch(err => {
                    console.log(`Error running command!\nCommand: ${interaction.commandName}\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\n${err}`);
                });
                */
        } else {
            return;
        }
    }
}