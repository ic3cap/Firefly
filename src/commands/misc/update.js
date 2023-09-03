const { Client, Interaction, SlashCommandBuilder } = require('discord.js');
const db = '../../database/GuildData.json';
const fs = require('fs');


module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Updates the bot'),

    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        interaction.reply({ content: 'Updated started..' },)
            .then(result => {
                // Re-register guild
                //const dbData = JSON.parse(fs.readFileSync(`${__dirname}/${db}`));
                //const guildId = interaction.guild.id;
                
                return interaction.editReply({ content: 'Updated successfully! :greencheck:' });
            })
            .catch(err => {
                console.error(err);
                return interaction.reply({ content: 'An error occurred while trying to update! :(', ephemeral: true });
            });
    }
}