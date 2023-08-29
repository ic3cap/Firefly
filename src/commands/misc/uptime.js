const msToDHMS = ms => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const remainingH = h % 24;
    const remainingM = m % 60;
    const remainingS = s % 60;

    return `${d}:${remainingH}:${remainingM}:${remainingS}`
}

module.exports = {
    name: 'uptime',
    description: 'Gets the bot uptime in days, hours, minutes, and seconds',
    async run(client, interaction) {
        return interaction.reply(`Uptime: ${msToDHMS(client.uptime)}`, ephemeral = true);
    }
}