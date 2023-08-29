const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.once('ready', c => {
    console.log(`Logged in as ${c.user.tag}!`);
    require('./loaders/slash.js');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
    // message.channel.send(`🏓Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
})

client.login(process.env.TOKEN);