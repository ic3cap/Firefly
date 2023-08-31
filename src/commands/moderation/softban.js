const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Bans and unbans a member immediately, deleting 7 days of their messages')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers, true)

        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to softban')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for softbanning the user')
                .setRequired(false)),
    /**
    * @param { Client } client
    * @param { Interaction } interaction
    */
    async run(client, interaction) {
        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild
        const user = interaction.member.user;
        const target = await guild.members.fetch(interaction.options.getUser('target').id);
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content: 'You can\'t softban a user with the same or higher role than you! :(', ephemeral: true });
        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (!target.bannable) return interaction.editReply({ content: 'You can\'t softban this user! :(', ephemeral: true });
        if (target.id === user.id) return interaction.editReply({ content: 'You can\'t softban yourself! :(', ephemeral: true });
        if (target.id === guild.ownerId) return interaction.editReply({ content: 'You can\'t softban the server owner! :(', ephemeral: true });

        await target.ban({ reason: reason, days: 604800 })
            .then(async () => {
                interaction.editReply({ content: `Successfully softbanned user!` });
                interaction.channel.send({ content: `${user} softbanned ${target.user.tag} (${target.user.id}) for: \`${reason}\`` });
                await guild.members.unban(target.user.id, reason)
                    .catch(err => {
                        console.log(`Error unbanning user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                        interaction.editReply({ content: 'An error occurred while trying to unban this user! :(', ephemeral: true });
                    });
            })
            .catch(err => {
                console.log(`Error softbanning user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                interaction.editReply({ content: 'An error occurred while trying to softban this user! :(', ephemeral: true });
            });
    }
}