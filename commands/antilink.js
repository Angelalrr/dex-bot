const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { getGuildSettings } = require('../utils/moderationSettings');
const { saveModerationSettingsDB } = require('../utils/storage');

module.exports = {
    name: 'antilink',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const mode = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(mode)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex antilink on/off`')] });
        }

        const settings = getGuildSettings(message.guild.id);
        settings.antilink = mode === 'on';
        await saveModerationSettingsDB();

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🔗 Antilink quedó **${settings.antilink ? 'activado' : 'desactivado'}**.`);

        message.reply({ embeds: [embed] });
    }
};
