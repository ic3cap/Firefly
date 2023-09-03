const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const CardUtils = require('../../../src/utils/card.js');
const fs = require('fs');
const memberTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../../templates/member.json`));

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Sets your server up for One Piece commands')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, true),
    /**
     *
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        const guild = interaction.guild;
        const guildData = JSON.parse(fs.readFileSync(`${__dirname}/../../database/GuildData.json`));
        let guildMemberData = guildData[guild.id].members;

        if (Object.keys(guildData[guild.id].cardPool).length > 0) return interaction.reply({ content: 'This server has already been set up!', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('Server Setup')
            .setDescription('Initiated server setup! Please wait.\n`Adding existing members to database, new members will automatically be added.`')
            .setColor([130, 255, 180]);

        await interaction.reply({ embeds: [embed], ephemeral: true });

        guild.members.fetch()
            .then(async fetchedMembers => {
                const members = fetchedMembers.filter(member => !member.user.bot);
                members.forEach(member => {
                    if (!guildMemberData[member.id]) {
                        guildMemberData[member.id] = memberTemplate;
                    }
                    guildData[guild.id].members = guildMemberData;
                });

                embed.setDescription('Successfully added all members to database! Saving to database..');
                interaction.editReply({ embeds: [embed], ephemeral: true });

                guildData[guild.id].cardPool = await CardUtils.buildCardPool(guild.memberCount);
                fs.writeFileSync(`${__dirname}/../../database/GuildData.json`, JSON.stringify(guildData));

                embed.setDescription('Server setup successful! You can now use One Piece commands in this server.');
                return interaction.editReply({ embeds: [embed], ephemeral: true });
            })
            .catch(err => {
                console.log(err);
                return interaction.editReply({ content: 'An error occurred while fetching members! Server setup has been cancelled.', ephemeral: true });
            });
    }
}

/* OLD CODE
const { Client, Interaction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    enabled: false,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Sets your server up for One Piece commands')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, true),
    //
     // @param { Client } client
     // @param { Interaction } interaction
     //
    async run(client, interaction) {
    const embed = new EmbedBuilder()
        .setTitle('Server Setup')
        .setDescription('Initiated setup! Please follow the instructions below to complete setup.\nNOTE: You will have to complete setup for each server you want to use One Piece commands in.\n\nPlease select a ruleset for your server to follow. This cannot be changed.\nFor more information on rulesets, cycle through the pages!\nTo cancel setup, select the cancel option.')
        .setColor([130, 255, 180])
        .addFields(
            { name: '1️⃣ - **Infinite Availability**', value: 'All cards have infinite availability, anyone can get any card.' },
            { name: '2️⃣ - **Finite Availability**', value: 'All cards have finite availability, you can set the amount of cards available for each rarity. You can even use the Member Count to determine the amount of cards available for each rarity!' },
            { name: '3️⃣ - **Selective Finite Availability**', value: 'Only cards with [A, B] stars inclusive are finite. The rest have an unlimited amount.' },
            { name: '4️⃣ - **Single Claiming**', value: 'Each card can only be claimed by one person. Once claimed, it is removed from the pool of available cards.' }
        );

    const row = new ActionRowBuilder();
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('ruleset1')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('1️⃣'),

        new ButtonBuilder()
            .setCustomId('ruleset2')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('2️⃣'),

        new ButtonBuilder()
            .setCustomId('ruleset3')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('3️⃣'),

        new ButtonBuilder()
            .setCustomId('ruleset4')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('4️⃣'),

        new ButtonBuilder()
            .setCustomId('cancel')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('❌')
    );

    const reply = await interaction.reply({ embeds: [embed], components: [row] });
    const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: btnInteraction => btnInteraction.user.id === interaction.user.id,
        time: 60000
    })

    collector.on('collect', async () => {
        collector.stop('collected');
    });

    await collector.on('end', async (ruleset, reason) => {
        if (!ruleset || reason !== 'collected') {
            const embed = new EmbedBuilder()
                .setTitle('Server Setup')
                .setDescription('Setup cancelled.')
                .setColor('RED');
            return await interaction.editReply({ embeds: [embed], ephermeral: true });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Server Setup')
                .setDescription(`Perfect! You have selected ruleset ${ruleset}.`)
                .setColor([130, 255, 180]);
            interaction.editReply({ embeds: [embed] });
        }
    });

}
}
*/