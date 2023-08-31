const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers, true)

        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user')
                .setRequired(false)),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild
        const user = interaction.member.user;
        const target = await guild.members.fetch(interaction.options.getUser('target').id)
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content: 'You can\'t kick a user with the same or higher role than you! :(', ephemeral: true });
        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (!target.kickable) return interaction.editReply({ content: 'You can\'t kick this user! :(', ephemeral: true });
        if (target.id === user.id) return interaction.editReply({ content: 'You can\'t kick yourself! :(', ephemeral: true });
        if (target.id === guild.ownerId) return interaction.editReply({ content: 'You can\'t kick the server owner! :(', ephemeral: true });

        await target.kick(reason)
            .then(() => {
                interaction.editReply({ content: `Successfully kicked user!` });
                interaction.channel.send({ content: `${user} kicked ${target.user.tag} for: \`${reason}\`!` });
            })
            .catch(err => {
                console.log(`Error kicking user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                interaction.editReply({ content: 'An error occurred while trying to kick this user! :(', ephemeral: true });
            });
    }
}