const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { recordTimeout } = require('../utils/storage');

module.exports = {
    name: 'timeout',
    async execute(message, args) {
        const target = message.mentions.members.first();
        const tiempo = parseInt(args[1]);
        if (!target || isNaN(tiempo)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex timeout @usuario tiempo razón`\n*(El tiempo es en minutos. La razón puede ir en blanco)*')] });
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const currentTimeout = global.timeoutsDB?.[target.id];
        const discordTimeoutUntil = target.communicationDisabledUntilTimestamp || 0;
        if ((currentTimeout && currentTimeout.expiresAt > Date.now()) || discordTimeoutUntil > Date.now()) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ **${target.user.username}** ya tiene un timeout activo.`)] });
        }

        if (tiempo > 40320) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ El tiempo máximo que permite Discord es de 28 días (40320 minutos).')] });
        const razon = args.slice(2).join(' ') || 'Ninguna especificada';

        try {
            await target.timeout(tiempo * 60 * 1000, razon);
            await recordTimeout(target.id, { username: target.user.username, guildId: message.guild.id, moderatorId: message.author.id, razon, expiresAt: Date.now() + tiempo * 60 * 1000, type: 'timeout' });
            message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`🤫 **${target.user.username}** ha sido silenciado temporalmente.\n**Duración:** ${tiempo} minutos\n**Razón:** ${razon}`)] });
        } catch (error) {
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No puedo silenciar a este usuario. Es posible que tenga un rol superior al mío o sea el dueño del servidor.')] });
        }
    }
};
