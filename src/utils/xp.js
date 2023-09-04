const { Client, Message } = require('discord.js');
//const Level = require('../models/level');
const Cooldowns = new Set();

const getRandomXP = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getXPForLevel = level => 100 * (level || 1);

/* NOT USING MONGO-DB DURING TESTING
module.exports = async (client, msg) => {
    if (!msg.inGuild() || msg.author.bot || Cooldowns.has(message.author.id)) return;

    try {
        const level = await Level.findOne({ userId: msg.author.id, guildId: msg.guild.id });
        if (level) {
            level.xp += getRandomXP(10, 15);
            if (level.xp >= getXPForLevel(level.level)) {
                msg.channel.send(`${msg.author} just leveled up! **(${level.level} -> ${level.level + 1})**`);
                level.level++;
                level.xp = 0;
                await level.save().catch(err => console.log(`Error saving level!\nUser: ${msg.author.tag}\nGuild: ${msg.guild.name}\nError: ${err}`));
            }
        } else {
            const newLevel = new Level({
                userId: msg.author.id,
                guildId: msg.guild.id,
                level: 1,
                xp: getRandomXP(10, 15)
            });
            await newLevel.save().catch(err => console.log(`Error saving level!\nUser: ${msg.author.tag}\nGuild: ${msg.guild.name}\nError: ${err}`));
        }
        Cooldowns.add(message.author.id);
        setTimeout(() => Cooldowns.delete(message.author.id), 60000);
    } catch (error) {
        console.log(`Error giving user XP!\nUser: ${msg.author.tag}\nGuild: ${msg.guild.name}\nError: ${error}`);
    }
}
*/
