function normalizeRoleName(name) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function hasModRoleOrHigher(member) {
    if (!member || !member.guild) return false;
    if (member.id === member.guild.ownerId) return true;
    if (member.permissions.has('Administrator')) return true;

    const modRole = member.guild.roles.cache
        .filter(role => ['mod', 'moderador', 'moderator'].includes(normalizeRoleName(role.name)))
        .sort((a, b) => b.position - a.position)
        .first();

    if (!modRole) {
        return member.permissions.has('ModerateMembers');
    }

    return member.roles.highest.position >= modRole.position;
}

module.exports = { hasModRoleOrHigher };
