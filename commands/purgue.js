const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');

const MAX_MESSAGES_TO_SCAN = 1000;
const BULK_DELETE_MAX_AGE = 14 * 24 * 60 * 60 * 1000;

async function fetchRecentMessages(channel, commandMessageId, includeCommandMessage) {
    const messages = [];
    let before;

    while (messages.length < MAX_MESSAGES_TO_SCAN) {
        const fetched = await channel.messages.fetch({ limit: 100, before });
        if (fetched.size === 0) break;

        const recentMessages = fetched.filter(msg => {
            const canBulkDelete = Date.now() - msg.createdTimestamp < BULK_DELETE_MAX_AGE;
            const canDeleteCommand = includeCommandMessage || msg.id !== commandMessageId;
            return !msg.pinned && canDeleteCommand && canBulkDelete;
        });
        messages.push(...recentMessages.values());

        before = fetched.last()?.id;
        if (fetched.size < 100) break;
    }

    return messages;
}

module.exports = {
    name: 'purgue',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const porcentaje = Number(args[0]);
        if (!Number.isInteger(porcentaje) || porcentaje < 1 || porcentaje > 100) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto o es inválido.**\n\n**Estructura:**\n`dex purgue número`\n*(El número debe ser un porcentaje entre 1 y 100. Ejemplo: `dex purgue 100` limpia todo lo reciente posible y `dex purgue 50` limpia la mitad.)*')] });
        }

        const includeCommandMessage = porcentaje === 100;
        const recentMessages = await fetchRecentMessages(message.channel, message.id, includeCommandMessage);
        const cantidad = porcentaje === 100 ? recentMessages.length : Math.ceil(recentMessages.length * (porcentaje / 100));
        const messagesToDelete = recentMessages.slice(0, cantidad);

        if (messagesToDelete.length === 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('✅ No encontré mensajes recientes para eliminar.')] });
        }

        let deletedCount = 0;
        for (let i = 0; i < messagesToDelete.length; i += 100) {
            const deleted = await message.channel.bulkDelete(messagesToDelete.slice(i, i + 100), true);
            deletedCount += deleted.size;
        }

        if (porcentaje < 100) {
            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`🧹 Se eliminó el **${porcentaje}%** de los mensajes recientes del canal (**${deletedCount} mensajes**).\n*Discord no permite borrar con bulk delete mensajes de más de 14 días.*`);
            message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 4000));
        }
    }
};
