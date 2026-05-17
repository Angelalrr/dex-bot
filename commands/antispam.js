const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { getGuildSettings, DEFAULT_ANTISPAM_TIMEOUT_MS } = require('../utils/moderationSettings');
const { saveModerationSettingsDB } = require('../utils/storage');
const { parseDuration, formatDuration } = require('../utils/timeParser');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

module.exports = {
    name: 'antispam',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const mode = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(mode)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex antispam on/off tiempo`\n*(Ejemplo: `dex antispam on 1h`. Si no pones tiempo, usa 1h.)*')] });
        }

        const settings = getGuildSettings(message.guild.id);
        settings.antispam.enabled = mode === 'on';

        if (settings.antispam.enabled) {
            const timeoutMs = args[1] ? parseDuration(args[1], 'm') : (settings.antispam.timeoutMs || DEFAULT_ANTISPAM_TIMEOUT_MS);
            if (timeoutMs === null || timeoutMs < 60 * 1000 || timeoutMs > MAX_TIMEOUT_MS) {
                return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ El tiempo debe ser válido entre 1 minuto y 28 días. Ejemplos: `30m`, `1h`, `2d`.')] });
            }
            settings.antispam.timeoutMs = timeoutMs;
        }

        await saveModerationSettingsDB();

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🚫 Antispam quedó **${settings.antispam.enabled ? 'activado' : 'desactivado'}**.${settings.antispam.enabled ? `\n**Timeout:** ${formatDuration(settings.antispam.timeoutMs)}` : ''}`);

        message.reply({ embeds: [embed] });
    }
};
