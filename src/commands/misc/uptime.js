const { Client, Interaction, SlashCommandBuilder } = require('discord.js');

const msToDHMS = ms => {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    let d = Math.floor(h / 24);

    h %= 24;
    m %= 60;
    s %= 60;

    return `${d} days, ${h} hours, ${m} minutes, ${s} seconds.`
}

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Gets the bot uptime in days, hours, minutes, and seconds'),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        return interaction.reply({ content: `Uptime: ${msToDHMS(client.uptime)}`, ephemeral: true });
    }
}