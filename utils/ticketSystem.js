const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getModRolesOrHigher } = require('./modPermissions');

function getGuildTicketSystems(guildId) {
    if (!global.ticketSystemsDB) global.ticketSystemsDB = {};
    if (!global.ticketSystemsDB[guildId]) global.ticketSystemsDB[guildId] = {};
    return global.ticketSystemsDB[guildId];
}

function getNextTicketNumber(guildId) {
    if (!global.ticketCountersDB) global.ticketCountersDB = {};
    global.ticketCountersDB[guildId] = (global.ticketCountersDB[guildId] || 0) + 1;
    return global.ticketCountersDB[guildId];
}

function buildTicketPanel(system) {
    const embeds = [new EmbedBuilder().setColor('#00b0f4').setTitle(system.title).setDescription(system.description)];
    for (const option of system.options.slice(0, 9)) {
        embeds.push(new EmbedBuilder().setColor('#00b0f4').setTitle(option.title).setDescription(option.description || `Razón: ${option.reason}`));
    }

    const buttons = system.options.slice(0, 25).map((option, index) => new ButtonBuilder()
        .setCustomId(`ticket_open:${system.id}:${index}`)
        .setLabel(option.reason.slice(0, 80))
        .setStyle(ButtonStyle.Primary));

    const rows = [];
    for (let i = 0; i < buttons.length; i += 5) rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
    return { embeds, components: rows };
}

async function lockTicketPanelChannel(channel) {
    await channel.permissionOverwrites.edit(channel.guild.id, { ViewChannel: true, SendMessages: false });
    for (const role of getModRolesOrHigher(channel.guild).values()) {
        await channel.permissionOverwrites.edit(role.id, { ViewChannel: true, SendMessages: true }).catch(() => null);
    }
}

async function sendOrUpdateTicketPanel(channel, system) {
    const payload = buildTicketPanel(system);
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

async function createTicketChannel(interaction, system, option) {
    const number = getNextTicketNumber(interaction.guild.id);
    const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'usuario';
    const overwrites = [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
    ];

    for (const role of getModRolesOrHigher(interaction.guild).values()) {
        overwrites.push({ id: role.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] });
    }

    const channel = await interaction.guild.channels.create({
        name: `ticket-${String(number).padStart(4, '0')}-${safeName}`,
        type: ChannelType.GuildText,
        permissionOverwrites: overwrites
    });

    const info = new EmbedBuilder()
        .setColor('#00b0f4')
        .setTitle(`Ticket #${number}`)
        .setDescription(`**Usuario:** ${interaction.user}\n**Razón:** ${option.reason}\n\nEn breve te atenderá un miembro del staff.`);
    const closeEmbed = new EmbedBuilder().setColor('Red').setDescription('Pulsa el botón para cerrar este ticket.');
    const closeButton = new ButtonBuilder().setCustomId('ticket_close').setLabel('close ticket').setStyle(ButtonStyle.Danger);

    await channel.send({ embeds: [info, closeEmbed], components: [new ActionRowBuilder().addComponents(closeButton)] });
    return { channel, number };
}

module.exports = { createTicketChannel, getGuildTicketSystems, lockTicketPanelChannel, sendOrUpdateTicketPanel };
