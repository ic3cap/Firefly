const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Untimeout a user in the server')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers, true)

        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to untimeout')
                .setRequired(true))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for untiming out the user')
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

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content: 'You can\'t ban untimeout a user with the same or higher role than you! :(', ephemeral: true });
        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (target.id === user.id) return interaction.editReply({ content: 'You can\'t untimeout yourself! :(', ephemeral: true });
        if (target.id === guild.ownerId) return interaction.editReply({ content: 'You can\'t untimeout the server owner! Nobody can timeout them in the first place.', ephemeral: true });

        await target.timeout(null, reason)
            .then(() => {
                interaction.editReply({ content: `Successfully untimed out user!` });
                interaction.channel.send({ content: `${user} untimed out ${target} for: \`${reason}\`` });
            })
            .catch(err => {
                console.log(`Error untiming out user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
                interaction.editReply({ content: 'An error occurred while trying to untimeout this user! :(', ephemeral: true });
            });
    }
}