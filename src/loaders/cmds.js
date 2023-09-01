const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { getCommandCategory } = require('../utils/commands.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const commands = [];

readdirSync(`${__dirname}/../commands`).forEach(folder => readdirSync(`${__dirname}/../commands/${folder}`).forEach(file => {
    const cmdData = require(`${__dirname}/../commands/${folder}/${file}`);
    if (cmdData.enabled && cmdData.public && !cmdData.premium) commands.push(cmdData.data.toJSON());
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

        commands.forEach(data => client.commands.set(data.name, { data: data, run: require(`${__dirname}/../commands/${getCommandCategory(data.name)}/${data.name}.js`).run }));
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error);
    };
}