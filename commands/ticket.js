const { ChannelType, EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { askQuestion, parseTextChannel } = require('../utils/setupConversation');
const { getGuildTicketSystems, lockTicketPanelChannel, sendOrUpdateTicketPanel } = require('../utils/ticketSystem');
const { saveTicketDB } = require('../utils/storage');

function listSystems(systems) {
    return Object.values(systems).map((system, index) => `**${index + 1}.** <#${system.channelId}> - ${system.title} (${system.active ? 'activo' : 'desactivado'})`).join('\n');
}

function getSystemByIndex(systems, response) {
    return Object.values(systems)[Number(response.content.trim()) - 1] || null;
}

async function askSystem(message, systems, action) {
    if (Object.keys(systems).length === 1) return Object.values(systems)[0];
    const response = await askQuestion(message, `Hay varios sistemas. Responde con el número del sistema que quieres ${action}:\n\n${listSystems(systems)}`);
    return response ? getSystemByIndex(systems, response) : null;
}

async function askTicketOptions(message, existingOptions = []) {
    const options = [...existingOptions];
    while (options.length < 25) {
        const reasonResponse = await askQuestion(message, options.length === 0 ? 'Escribe la **razón** del primer embed/botón de ticket.' : 'Escribe otra **razón** para agregar otro embed/botón, o responde `done` para terminar.');
        if (!reasonResponse) return null;
        if (reasonResponse.content.toLowerCase().trim() === 'done') {
            if (options.length === 0) {
                await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Debes agregar al menos una razón.')] });
                continue;
            }
            break;
        }
        const titleResponse = await askQuestion(message, 'Escribe el **título** de ese embed.');
        if (!titleResponse) return null;
        const descriptionResponse = await askQuestion(message, 'Escribe la **descripción** de ese embed.');
        if (!descriptionResponse) return null;
        options.push({ reason: reasonResponse.content, title: titleResponse.content, description: descriptionResponse.content });
        const anotherResponse = await askQuestion(message, '¿Quieres agregar otro embed/razón? Responde `yes` o `no`.');
        if (!anotherResponse) return null;
        if (anotherResponse.content.toLowerCase().trim() !== 'yes') break;
    }
    return options;
}

async function configureSystem(message, existingSystem = null, appendOptions = false) {
    let channel = existingSystem ? message.guild.channels.cache.get(existingSystem.channelId) : null;
    if (!existingSystem) {
        const channelResponse = await askQuestion(message, '¿En qué canal se creará el sistema de tickets? Menciona el canal, por ejemplo `#tickets`.');
        if (!channelResponse) return null;
        channel = parseTextChannel(message, channelResponse);
        if (!channel || channel.type !== ChannelType.GuildText) {
            await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Ese canal no es válido. Vuelve a usar `dex ticket` para intentarlo otra vez.')] });
            return null;
        }
        if (Object.values(getGuildTicketSystems(message.guild.id)).some(system => system.channelId === channel.id)) {
            await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Ya existe un sistema de tickets en ese canal. No se pueden crear dos en el mismo canal.')] });
            return null;
        }
    }

    let title = existingSystem?.title;
    let description = existingSystem?.description;
    if (!appendOptions) {
        const titleResponse = await askQuestion(message, 'Escribe el **título** del sistema de tickets.');
        if (!titleResponse) return null;
        title = titleResponse.content;
        const descriptionResponse = await askQuestion(message, 'Ahora escribe la **descripción** principal del sistema de tickets.');
        if (!descriptionResponse) return null;
        description = descriptionResponse.content;
    }

    const options = await askTicketOptions(message, appendOptions ? existingSystem.options : []);
    if (!options) return null;
    return { id: existingSystem?.id || channel.id, channelId: channel.id, title, description, options, active: true, createdBy: existingSystem?.createdBy || message.author.id, createdAt: existingSystem?.createdAt || Date.now(), messageId: existingSystem?.messageId || null };
}

module.exports = {
    name: 'ticket',
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        const systems = getGuildTicketSystems(message.guild.id);
        let action = 'new';

        if (Object.keys(systems).length > 0) {
            const response = await askQuestion(message, `Ya existe al menos un sistema de tickets en este servidor:\n\n${listSystems(systems)}\n\n¿Qué quieres hacer? Responde: \`edit\`, \`delete\`, \`new\` o \`add embed\`.`);
            if (!response) return;
            action = response.content.toLowerCase().trim();
            if (!['edit', 'delete', 'new', 'add embed'].includes(action)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Opción inválida. Usa `edit`, `delete`, `new` o `add embed`.')] });
        }

        if (action === 'delete') {
            const selected = await askSystem(message, systems, 'eliminar');
            if (!selected) return;
            const channel = message.guild.channels.cache.get(selected.channelId);
            if (channel && selected.messageId) await (await channel.messages.fetch(selected.messageId).catch(() => null))?.delete().catch(() => null);
            delete systems[selected.id];
            await saveTicketDB();
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('✅ Sistema de tickets eliminado.')] });
        }

        const selected = ['edit', 'add embed'].includes(action) ? await askSystem(message, systems, action === 'edit' ? 'editar' : 'modificar') : null;
        if (['edit', 'add embed'].includes(action) && !selected) return;
        const system = await configureSystem(message, selected, action === 'add embed');
        if (!system) return;

        systems[system.id] = system;
        const channel = message.guild.channels.cache.get(system.channelId);
        await lockTicketPanelChannel(channel);
        await sendOrUpdateTicketPanel(channel, system);
        await saveTicketDB();
        message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Sistema de tickets listo en ${channel}.\nPuedes volver a usar \`dex ticket\` para editarlo, eliminarlo, crear otro en otro canal o agregar otro embed.`)] });
    }
};
