const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server, optionally deleting their messages')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers, true)

        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for banning the user')
                .setRequired(false))

        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('The number of days of messages to delete')
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
        const days = interaction.options.getInteger('days') || 7;

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content: 'You can\'t ban a user with the same or higher role than you! :(', ephemeral: true });
        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (!target.bannable) return interaction.editReply({ content: 'You can\'t ban this user! :(', ephemeral: true });
        if (target.id === user.id) return interaction.editReply({ content: 'You can\'t ban yourself! :(', ephemeral: true });
        if (target.id === guild.ownerId) return interaction.editReply({ content: 'You can\'t ban the server owner! :(', ephemeral: true });

        await target.ban({ reason: reason, days: (days * 86400)})
            .then(() => {
                interaction.editReply({ content: `Successfully banned user!` });
                interaction.channel.send({ content: `${user} banned ${target.user.tag} for: \`${reason}\`${days === 0 ? '!' : ', and deleted all messages sent by them upto ${days} ago!'}`});
            })
            .catch(err => {
                console.log(`Error kicking user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                interaction.editReply({ content: 'An error occurred while trying to ban this user! :(', ephemeral: true });
            });
    }
}