const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'warnings',
    execute(message) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex warnings @usuario`')] });
        }
        const userWarns = global.warningsDB[target.id];
        if (!userWarns || userWarns.length === 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ **${target.username}** no tiene advertencias.`)] });
        }
        const lista = userWarns.map((w, index) => `**${index + 1}.** ${w}`).join('\n');
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`⚠️ **Advertencias de ${target.username}:**\n\n${lista}`);
        message.reply({ embeds: [embed] });
    }
};