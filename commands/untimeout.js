const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { removeTimeout } = require('../utils/storage');

module.exports = {
    name: 'untimeout',
    async execute(message) {
        const target = message.mentions.members.first();

        // Si el usuario olvida mencionar a alguien
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex untimeout @usuario`')] });
        }

        // Verificamos permisos
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        try {
            // Al igual que unmute, quitamos el timeout poniéndolo en "null"
            await target.timeout(null);
            await removeTimeout(target.id);

            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`🔊 Se ha quitado el timeout a **${target.user.username}**.`);
            message.reply({ embeds: [embed] });

        } catch (error) {
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No pude quitarle el timeout a este usuario. Es posible que tenga un rol superior al mío.')] });
        }
    }
};
