const { Client, IntentsBitField, Collection } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.commands = new Collection();

client.once('ready', c => {
    console.log(`Logged in as ${c.user.tag}!`);
    readdirSync(`${__dirname}/loaders`).forEach(loader => require(`./loaders/${loader}`)(client));
});

client.on('interactionCreate', async interaction => {
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
})

/*
mongodb+srv://fireflyadmin:<password>@firefly-discord-bot.hlh6oby.mongodb.net/?retryWrites=true&w=majority
*/

client.login(process.env.TOKEN);