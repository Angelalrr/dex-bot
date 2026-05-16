const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'removerole',
    async execute(message) {
        const target = message.mentions.members.first();
        const rol = message.mentions.roles.first();
        if (!target || !rol) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex removerole @usuario @rol`')] });
        }
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        await target.roles.remove(rol);
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Se ha quitado el rol **${rol.name}** a **${target.user.username}**.`);
        message.reply({ embeds: [embed] });
    }
};
