const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers, true)

        .addStringOption(option =>
            option.setName('target')
                .setDescription('The user to unban')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for unbanning the user')
                .setRequired(false)),
    /**
     * @param { Client } client
     * @param { Interaction } interaction
     */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild
        const user = interaction.member.user;
        const target = interaction.options.getString('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (Number(target) === user.id) return interaction.editReply({ content: 'You can\'t unban yourself, and you aren\'t banned!', ephemeral: true });
        if (Number(target) === guild.ownerId) return interaction.editReply({ content: 'You can\'t unban the server owner! Nobody can ban them in the first place.', ephemeral: true });

        await guild.members.unban(target, reason)
            .then(() => {
                interaction.editReply({ content: `Successfully unbanned user!` });
                interaction.channel.send({ content: `${user} unbanned ${target} for: \`${reason}\`` });
            })
            .catch(err => {
                console.log(`Error unbanning user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                interaction.editReply({ content: 'An error occurred while trying to unban this user! :(', ephemeral: true });
            });
    }
}