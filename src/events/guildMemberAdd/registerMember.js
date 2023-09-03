const guildDB = '../../database/GuildData';

module.exports = {
    data: {
        name: 'guildMemberAdd',
        type: 'on',
        enabled: true,
        public: true
    },

    run: async (client, member) => {
        // TODO
        console.log(member);
    }
}