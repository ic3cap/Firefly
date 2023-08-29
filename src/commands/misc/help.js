const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const commandUtils = require('../../utils/commands.js');

function capitalizeFirstLetters(input) {
    const words = input.split(' ');
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const result = capitalizedWords.join(' ');
    return result;
}

module.exports = {
    name: 'help',
    description: 'Gets a list of commands or info on a command',
    options: [
        {
            name: 'category',
            description: 'Displays all commands in a category',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: 'misc',
                    value: 'misc'
                },
                {
                    name: 'moderation',
                    value: 'moderation'
                },
                {
                    name: 'one piece',
                    value: 'one piece'
                }
            ]
        },
        {
            name: 'command',
            description: 'Displays info about a specific command',
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: [
                {
                    name: 'help',
                    value: 'help'
                },
                {
                    name: 'ping',
                    value: 'ping'
                },
                {
                    name: 'uptime',
                    value: 'uptime'
                }
            ]
        }
    ],
    async run(client, interaction) {
        const categoryInteractionValue = interaction.options.get('category') && interaction.options.get('category').value;
        const commandInteractionValue = interaction.options.get('command') && interaction.options.get('command').value;

        if (!categoryInteractionValue && !commandInteractionValue) {
            const categories = commandUtils.getCategories().map(category => capitalizeFirstLetters(category));
            const embed = new EmbedBuilder();
            let desc = '';

            categories.forEach(category => {
                let commands = commandUtils.getCommandsInCategory(category);
                for (cmd in commands) {
                    cmd = commands[cmd];
                    desc += `\`${category}\` - ${Object.keys(commands).length} commands\nCommand: \`${cmd.name}\`\nDescription: ${cmd.description}\n\n`;
                }
            });

            embed.setTitle('Commands');
            embed.setColor([130, 255, 180]);
            embed.setDescription(desc);

            return interaction.reply({ embeds: [embed] }, ephemeral = true);
        };

        if (categoryInteractionValue && commandUtils.doesCategoryExist(categoryInteractionValue)) {
            const commands = commandUtils.getCommandsInCategory(categoryInteractionValue);
            const embed = new EmbedBuilder();
            let category = capitalizeFirstLetters(categoryInteractionValue);
            let desc = '';

            Object.keys(commands).forEach(cmd => {
                desc += `\`${cmd}\` - ${commands[cmd].description}\n`;
            });

            embed.setTitle(`Commands in ${category} - ${Object.keys(commands).length} commands`);
            embed.setColor([130, 255, 180]);
            embed.setDescription(desc || 'No commands in this category yet! :(');

            return interaction.reply({ embeds: [embed] }, ephemeral = true);
        } else if (commandInteractionValue && commandUtils.doesCommandExist(commandInteractionValue)) {
            const embed = new EmbedBuilder();

            embed.setTitle(`Command: ${commandInteractionValue}`);
            embed.setColor([130, 255, 180]);
            embed.setDescription(`${client.commands.get(commandInteractionValue).description}`);

            return interaction.reply({ embeds: [embed] }, ephemeral = true);
        } else {
            return interaction.reply({ content: 'That category or command does not exist!', ephemeral: true });
        }
    }
}