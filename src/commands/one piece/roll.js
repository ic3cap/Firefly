const { Client, Interaction, SlashCommandBuilder } = require('discord.js');
const CardUtils = require('../../utils/card.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls a random One Piece character, providing no type will roll a random character of any type')
        .setDMPermission(false)

        .addStringOption(option =>
            option.setName('rolltype')
                .setDescription('The type of roll you want to use, check what rolls you have by using /rolls')
                .addChoices(
                    { name: 'Common', value: 'common' },
                    { name: 'Uncommon', value: 'uncommon' },
                    { name: 'Rare', value: 'rare' },
                    { name: 'Epic', value: 'epic' },
                    { name: 'Legendary', value: 'legendary' },
                    { name: 'Mythical', value: 'mythical' },
                    { name: 'Seasonal', value: 'seasonal' },
                    { name: 'Exclusive', value: 'exclusive' },
                )
                .setRequired(false))

        .addBooleanOption(option =>
            option.setName('all')
                .setDescription('Whether or not to use all of your rolls of that rarity, defaults to no')
                .setRequired(false)),

    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        const guild = interaction.guild;
        const user = interaction.user;
        const rollType = interaction.options.getString('rolltype') || 'Default';
        const useAll = interaction.options.getBoolean('all') || false;

        switch (await CardUtils.userHasRolls(guild.id, user.id, rollType)) {
            case 'GuildUnregistered':
                return interaction.reply({ content: 'This guild is not registered in the database!', ephemeral: true });
            case 'UserUnregistered':
                return interaction.reply({ content: 'You are not registered in the database!', ephemeral: true });
            case 'NoRolls':
                return interaction.reply({ content: `You do not have any ${rollType} rolls!`, ephemeral: true });
        }

        const rarity = await ((rollType === 'Default') && CardUtils.rollRarity()) || rollType;
        console.log(rarity);

        const card = await CardUtils.rollCard(guild.id, user.id, rarity, rollType);
        console.log(card);
        interaction.reply({ content: `You rolled "${card.name}"!`, ephemeral: true });
    }
}