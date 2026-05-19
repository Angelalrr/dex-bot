const { ChannelType, EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { askQuestion, parseRole, parseTextChannel } = require('../utils/setupConversation');
const { applyVerificationPermissions, getGuildVerificationSystems, sendOrUpdateVerifyPanel } = require('../utils/verificationSystem');
const { saveVerificationDB } = require('../utils/storage');

function listSystems(systems) {
    return Object.values(systems).map((system, index) => `**${index + 1}.** <#${system.channelId}> - ${system.title}`).join('\n');
}

function getSystemByIndex(systems, response) {
    return Object.values(systems)[Number(response.content.trim()) - 1] || null;
}

async function askSystem(message, systems, action) {
    if (Object.keys(systems).length === 1) return Object.values(systems)[0];
    const response = await askQuestion(message, `Hay varios sistemas. Responde con el número del sistema que quieres ${action}:\n\n${listSystems(systems)}`);
    return response ? getSystemByIndex(systems, response) : null;
}

async function configureSystem(message, existingSystem = null) {
    let channel = existingSystem ? message.guild.channels.cache.get(existingSystem.channelId) : null;
    if (!existingSystem) {
        const channelResponse = await askQuestion(message, '¿En qué canal se creará el sistema de verificación? Menciona el canal, por ejemplo `#verificacion`.');
        if (!channelResponse) return null;
        channel = parseTextChannel(message, channelResponse);
        if (!channel || channel.type !== ChannelType.GuildText) {
            await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Ese canal no es válido. Vuelve a usar `dex verify` para intentarlo otra vez.')] });
            return null;
        }
        if (Object.values(getGuildVerificationSystems(message.guild.id)).some(system => system.channelId === channel.id)) {
            await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Ya existe un sistema de verificación en ese canal. No se pueden crear dos en el mismo canal.')] });
            return null;
        }
    }

    const titleResponse = await askQuestion(message, 'Escribe el **título** del sistema de verificación.');
    if (!titleResponse) return null;
    const descriptionResponse = await askQuestion(message, 'Ahora escribe la **descripción** que verán los usuarios.');
    if (!descriptionResponse) return null;
    const appliesResponse = await askQuestion(message, '¿A quién aplicará la verificación?\nResponde con `all`, `only new users` o menciona un rol con `@rol`.');
    if (!appliesResponse) return null;

    const rawApplies = appliesResponse.content.toLowerCase().trim();
    let appliesTo;
    if (rawApplies === 'all') appliesTo = { type: 'all' };
    else if (rawApplies === 'only new users') appliesTo = { type: 'new' };
    else {
        const role = parseRole(message, appliesResponse);
        if (!role) {
            await message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Opción inválida. Usa `all`, `only new users` o menciona un rol.')] });
            return null;
        }
        appliesTo = { type: 'role', roleId: role.id };
    }

    return {
        id: existingSystem?.id || channel.id,
        channelId: channel.id,
        title: titleResponse.content,
        description: descriptionResponse.content,
        appliesTo,
        createdBy: existingSystem?.createdBy || message.author.id,
        createdAt: existingSystem?.createdAt || Date.now(),
        messageId: existingSystem?.messageId || null
    };
}

module.exports = {
    name: 'verify',
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        const systems = getGuildVerificationSystems(message.guild.id);
        let action = 'new';

        if (Object.keys(systems).length > 0) {
            const response = await askQuestion(message, `Ya existe al menos un sistema de verificación en este servidor:\n\n${listSystems(systems)}\n\n¿Qué quieres hacer? Responde: \`edit\`, \`delete\` o \`new\`.`);
            if (!response) return;
            action = response.content.toLowerCase().trim();
            if (!['edit', 'delete', 'new'].includes(action)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Opción inválida. Usa `edit`, `delete` o `new`.')] });
        }

        if (action === 'delete') {
            const selected = await askSystem(message, systems, 'eliminar');
            if (!selected) return;
            const channel = message.guild.channels.cache.get(selected.channelId);
            if (channel && selected.messageId) await (await channel.messages.fetch(selected.messageId).catch(() => null))?.delete().catch(() => null);
            delete systems[selected.id];
            await saveVerificationDB();
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('✅ Sistema de verificación eliminado. Puedes volver a usar `dex verify` para crear, editar o eliminar sistemas.')] });
        }

        const existingSystem = action === 'edit' ? await askSystem(message, systems, 'editar') : null;
        if (action === 'edit' && !existingSystem) return;
        const system = await configureSystem(message, existingSystem);
        if (!system) return;

        systems[system.id] = system;
        await applyVerificationPermissions(message.guild, system);
        const channel = message.guild.channels.cache.get(system.channelId);
        await sendOrUpdateVerifyPanel(channel, system);
        await saveVerificationDB();

        message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Sistema de verificación listo en ${channel}.\nPuedes volver a usar \`dex verify\` para eliminarlo, editarlo o crear otro sistema en otro canal.`)] });
    }
};
