const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const commands = readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js')).forEach(file => console.log(file));
/*
const commands = [
    {
        name: 'ping',
        description: 'Replies with pong!'
    }
];
*/

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.log(error);
    };
})();