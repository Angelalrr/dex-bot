const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { removeTimeout } = require('../utils/storage');

module.exports = {
    name: 'untimeout',
    async execute(message) {
        const target = message.mentions.members.first();
        if (!target) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex untimeout @usuario`')] });
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const currentTimeout = global.timeoutsDB?.[target.id];
        const discordTimeoutUntil = target.communicationDisabledUntilTimestamp || 0;
        if ((!currentTimeout || currentTimeout.expiresAt <= Date.now()) && discordTimeoutUntil <= Date.now()) {
            if (currentTimeout) await removeTimeout(target.id);
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ **${target.user.username}** no tiene timeout activo.`)] });
        }

        try {
            await target.timeout(null);
            await removeTimeout(target.id);
            message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`🔊 Se ha quitado el timeout a **${target.user.username}**.`)] });
        } catch (error) {
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No pude quitarle el timeout a este usuario. Es posible que tenga un rol superior al mío.')] });
        }
    }
};
