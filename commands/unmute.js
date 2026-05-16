const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { removeTimeout } = require('../utils/storage');

module.exports = {
    name: 'unmute',
    async execute(message) {
        const target = message.mentions.members.first();

        // Si el usuario olvida mencionar a alguien, le enseñamos la estructura
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unmute @usuario`')] });
        }

        // Verificamos permisos del que ejecuta el comando
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        try {
            // Pasamos "null" al timeout para remover cualquier silencio/aislamiento que tenga el usuario
            await target.timeout(null);
            removeTimeout(target.id);

            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`🔊 Se ha quitado el silencio a **${target.user.username}**.`);
            message.reply({ embeds: [embed] });

        } catch (error) {
            // Si hay un error de jerarquía de roles, enviamos mensaje de error en vez de apagar el bot
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No pude quitarle el silencio a este usuario. Es posible que tenga un rol superior al mío.')] });
        }
    }
};
