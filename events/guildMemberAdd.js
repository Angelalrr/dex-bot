const { Events } = require('discord.js');
const { getGuildVerificationSystems, getOrCreateVerifiedRole } = require('../utils/verificationSystem');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        const systems = getGuildVerificationSystems(member.guild.id);
        const appliesToNewUsers = Object.values(systems).some(system => ['all', 'new'].includes(system.appliesTo.type));
        if (!appliesToNewUsers || member.user.bot || member.id === member.guild.ownerId) return;
        await getOrCreateVerifiedRole(member.guild);
    }
};
