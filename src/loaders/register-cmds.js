const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const commands = [];

readdirSync(`${__dirname}/../commands`).forEach(folder => readdirSync(`${__dirname}/../commands/${folder}`).forEach(file => {
    const data = require(`${__dirname}/../commands/${folder}/${file}`);
    commands.push(data);
}));

module.exports = async (client) => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        commands.forEach(data => {
            client.commands.set(data.name, data);
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error);
    };
}