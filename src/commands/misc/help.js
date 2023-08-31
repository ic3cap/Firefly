const { Client, Interaction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
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
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Gets a list of commands or info on a specific command')

        .addSubcommand(subCommand => subCommand.setName('all').setDescription('Get a list of all commands'))

        .addSubcommand(subCommand => subCommand.setName('category').setDescription('Get a list of commands in a category')
            .addStringOption(option =>
                option.setName('category')
                    .setDescription('The category to get commands from')
                    .addChoices(
                        { name: 'Misc', value: 'misc' },
                        { name: 'Moderation', value: 'moderation' },
                        { name: 'One Piece', value: 'one piece' },
                    )
                    .setRequired(true)))


        .addSubcommand(subCommand => subCommand.setName('command').setDescription('Get info on a specific command')
            .addStringOption(option =>
                option.setName('command')
                    .setDescription('The command to get info on')
                    .addChoices(
                        { name: 'Help', value: 'help' },
                        { name: 'Ping', value: 'ping' },
                        { name: 'Uptime', value: 'uptime' },
                        { name: 'Softban', value: 'softban' },
                        { name: 'Ban', value: 'ban' },
                        { name: 'Unban', value: 'unban' },
                        { name: 'Kick', value: 'kick' },
                        { name: 'Timeout', value: 'timeout' },
                        { name: 'Untimeout', value: 'untimeout' },
                    )
                    .setRequired(true))),

    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        const subCommand = interaction.options.getSubcommand();
        switch (subCommand) {
            case 'all':
                const categories = commandUtils.getCategories().map(category => capitalizeFirstLetters(category));
                const embed = new EmbedBuilder();
                let desc = '';

                categories.forEach(category => {
                    let commands = commandUtils.getCommandsInCategory(category);
                    for (cmd in commands) {
                        cmd = commands[cmd];
                        desc += `\`${category}\` - ${Object.keys(commands).length} commands\nCommand: \`${cmd.data.name}\`\nDescription: ${cmd.data.description}\n\n`;
                    }
                });

                embed.setTitle('Commands');
                embed.setColor([130, 255, 180]);
                embed.setDescription(desc);

                return interaction.reply({ embeds: [embed] }, ephemeral = true);
            case 'category':
                const category = interaction.options.getString('category');
                if (category && commandUtils.doesCategoryExist(category)) {
                    const commands = commandUtils.getCommandsInCategory(category);
                    const embed = new EmbedBuilder();
                    let categoryName = capitalizeFirstLetters(category);
                    let desc = '';

                    Object.keys(commands).forEach(cmd => {
                        desc += `\`${cmd}\` - ${commands[cmd].data.description}\n`;
                    });

                    embed.setTitle(`Commands in ${categoryName} - ${Object.keys(commands).length} commands`);
                    embed.setColor([130, 255, 180]);
                    embed.setDescription(desc || 'No commands in this category yet! :(');

                    return interaction.reply({ embeds: [embed] }, ephemeral = true);
                } else {
                    return interaction.reply({ content: 'I don\'t think that\'s a valid category. :(' }, ephemeral = true);
                }
            case 'command':
                const command = interaction.options.getString('command');
                if (command && commandUtils.doesCommandExist(command)) {
                    const embed = new EmbedBuilder();
                    embed.setTitle(`Command - ${command}`);
                    embed.setColor([130, 255, 180]);
                    embed.setDescription(`${client.commands.get(command).data.description}`);

                    return interaction.reply({ embeds: [embed] }, ephemeral = true);
                } else {
                    return interaction.reply({ content: 'I don\'t think that\'s a valid command. :(' }, ephemeral = true);
                }
        }
    }
}