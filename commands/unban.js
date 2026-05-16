const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { removeBan } = require('../utils/storage');

module.exports = {
    name: 'unban',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const userId = args[0]?.replace(/[<@!>]/g, '');
        if (!userId) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unban ID_usuario razón`\n*(La razón puede ir en blanco)*')] });
        }

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';

        try {
            const unbannedUser = await message.guild.members.unban(userId, razon);
            await removeBan(userId);

            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`✅ **${unbannedUser.username}** ha sido desbaneado.\n**Razón:** ${razon}`);
            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No pude desbanear a ese usuario. Verifica que el ID sea correcto y que el usuario esté baneado.')] });
        }
    }
};
