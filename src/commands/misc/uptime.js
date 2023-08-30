const { SlashCommandBuilder } = require('discord.js');

const msToDHMS = ms => {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    let d = Math.floor(h / 24);

    h %= 24;
    m %= 60;
    s %= 60;

    /*
    const remainingH = h % 24;
    const remainingM = m % 60;
    const remainingS = s % 60;
    */

    //return `${d}D:${remainingH}H:${remainingM}M:${remainingS}S`
    return `${d}D:${h}H:${m}M:${s}S`
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Gets the bot uptime in days, hours, minutes, and seconds'),
    async run(client, interaction) {
        return interaction.reply(`Uptime: ${msToDHMS(client.uptime)}`, ephemeral = true);
    }
}