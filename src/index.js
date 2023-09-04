const { Client, IntentsBitField, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
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

(async () => {
  await mongoose.connect(process.env.DB_URI)
    .then(() => {
      console.log('Successfully connected to MongoDB!');
    })
    .catch(err => {
      console.error(`Error connecting to MongoDB!\n${err}`);
    });
})();

client.once('ready', c => {
  readdirSync(`${__dirname}/loaders`).forEach(loader => require(`./loaders/${loader}`)(client));
  console.log(`Successfully deployed bot. Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN);