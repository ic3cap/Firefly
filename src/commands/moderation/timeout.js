const { Client, Interaction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    enabled: true,
    public: true,
    premium: false,
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeouts a user in the server')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers, true)

        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to timeout')
                .setRequired(true))

        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The time to timeout the user for in minutes, defaults to 1')
                .setRequired(false))

        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout')
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
        const time = interaction.options.getInteger('time') || 1;

        if (target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({ content: 'You can\'t timeout a user with the same or higher role than you! :(', ephemeral: true });
        if (!target) return interaction.editReply({ content: 'Couldn\'t find that user! :(', ephemeral: true });
        if (!target.kickable) return interaction.editReply({ content: 'You can\'t timeout this user! :(', ephemeral: true });
        if (target.id === user.id) return interaction.editReply({ content: 'You can\'t timeout yourself! :(', ephemeral: true });
        if (target.id === guild.ownerId) return interaction.editReply({ content: 'You can\'t timeout the server owner! :(', ephemeral: true });

        await target.timeout((time * 60000), reason)
            .then(() => {
                interaction.editReply({ content: `Successfully timed out user!` });
                interaction.channel.send({ content: `${user} timed out ${target.user.tag} for ${time} minutes, for: \`${reason}\`` });
            })
            .catch(err => {
                console.log(`Error timing out user!\nUserID: ${interaction.member.id}\nGuildID: ${interaction.guildId}\nError: ${err}`);
            });
    }
}