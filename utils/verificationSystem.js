const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getModRolesOrHigher } = require('./modPermissions');

const VERIFIED_ROLE_NAME = 'Verificado';

function getGuildVerificationSystems(guildId) {
    if (!global.verificationSystemsDB) global.verificationSystemsDB = {};
    if (!global.verificationSystemsDB[guildId]) global.verificationSystemsDB[guildId] = {};
    return global.verificationSystemsDB[guildId];
}

function getGuildVerifiedUsers(guildId) {
    if (!global.verifiedUsersDB) global.verifiedUsersDB = {};
    if (!global.verifiedUsersDB[guildId]) global.verifiedUsersDB[guildId] = {};
    return global.verifiedUsersDB[guildId];
}

async function getOrCreateVerifiedRole(guild) {
    const existing = guild.roles.cache.find(role => role.name === VERIFIED_ROLE_NAME);
    if (existing) return existing;
    return guild.roles.create({ name: VERIFIED_ROLE_NAME, reason: 'Sistema de verificación de Dex' });
}

function buildVerifyMessage(system) {
    const embed = new EmbedBuilder().setColor('#00b0f4').setTitle(system.title).setDescription(system.description);
    const button = new ButtonBuilder().setCustomId(`verify:${system.id}`).setLabel('Verificarse').setStyle(ButtonStyle.Success);
    return { embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] };
}

async function lockVerificationChannel(channel) {
    await channel.permissionOverwrites.edit(channel.guild.id, { ViewChannel: true, SendMessages: false });
    for (const role of getModRolesOrHigher(channel.guild).values()) {
        await channel.permissionOverwrites.edit(role.id, { ViewChannel: true, SendMessages: true }).catch(() => null);
    }
}

async function applyVerificationPermissions(guild, system) {
    const verificationChannel = guild.channels.cache.get(system.channelId);
    if (!verificationChannel) return;

    const verifiedRole = await getOrCreateVerifiedRole(guild);
    system.verifiedRoleId = verifiedRole.id;
    await lockVerificationChannel(verificationChannel);
    const channels = guild.channels.cache.filter(channel => channel.id !== verificationChannel.id);

    if (system.appliesTo.type === 'role') {
        for (const channel of channels.values()) {
            await channel.permissionOverwrites.edit(system.appliesTo.roleId, { ViewChannel: false }).catch(() => null);
        }
        return;
    }

    for (const channel of channels.values()) {
        await channel.permissionOverwrites.edit(guild.id, { ViewChannel: false }).catch(() => null);
        await channel.permissionOverwrites.edit(verifiedRole.id, { ViewChannel: true }).catch(() => null);
    }

    if (system.appliesTo.type === 'new') {
        const members = await guild.members.fetch();
        for (const member of members.values()) {
            if (!member.user.bot && member.id !== guild.ownerId) {
                await member.roles.add(verifiedRole, 'Usuarios actuales marcados como verificados').catch(() => null);
                getGuildVerifiedUsers(guild.id)[member.id] = { verifiedAt: Date.now(), systemId: system.id, automatic: true };
            }
        }
    }
}

async function markMemberVerified(member, system) {
    const verifiedRole = await getOrCreateVerifiedRole(member.guild);
    system.verifiedRoleId = verifiedRole.id;
    await member.roles.add(verifiedRole, 'Usuario verificado con Dex').catch(() => null);

    if (system.appliesTo.type === 'role') {
        for (const channel of member.guild.channels.cache.values()) {
            if (channel.id !== system.channelId) await channel.permissionOverwrites.edit(member.id, { ViewChannel: true }).catch(() => null);
        }
    }

    getGuildVerifiedUsers(member.guild.id)[member.id] = { verifiedAt: Date.now(), systemId: system.id };
}

async function sendOrUpdateVerifyPanel(channel, system) {
    const payload = buildVerifyMessage(system);
    if (system.messageId) {
        const existing = await channel.messages.fetch(system.messageId).catch(() => null);
        if (existing) {
            await existing.edit(payload);
            return existing;
        }
    }
    const sent = await channel.send(payload);
    system.messageId = sent.id;
    return sent;
}

module.exports = { applyVerificationPermissions, buildVerifyMessage, getGuildVerificationSystems, getGuildVerifiedUsers, getOrCreateVerifiedRole, markMemberVerified, sendOrUpdateVerifyPanel };
