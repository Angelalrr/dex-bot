const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { parseDuration, formatDuration } = require('../utils/timeParser');

const MAX_SLOWMODE_MS = 6 * 60 * 60 * 1000;

module.exports = {
    name: 'slowmode',
    aliases: ['slow'],
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const durationMs = parseDuration(args[0], 's');
        if (durationMs === null || durationMs < 1000 || durationMs > MAX_SLOWMODE_MS) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto o es inválido.**\n\n**Estructura:**\n`dex slowmode tiempo`\n*(Ejemplos: `dex slowmode 10s`, `dex slow 5m`. El máximo de Discord es 6h.)*')] });
        }

        const seconds = Math.floor(durationMs / 1000);
        await message.channel.setRateLimitPerUser(seconds, `Slowmode activado por ${message.author.tag}`);

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🐢 Slowmode activado en este canal: **${formatDuration(seconds * 1000)}**.`);

        message.reply({ embeds: [embed] });
    }
};
