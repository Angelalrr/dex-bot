const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { recordModerationAction } = require('../utils/storage');
module.exports = {
    name: 'kick',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex kick @usuario razón`\n*(La razón puede ir en blanco)*')] });
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        await target.kick(razon);
        await recordModerationAction(message.guild.id, 'kick', target.id, { username: target.user.username, moderatorId: message.author.id, razon, kickedAt: Date.now() });
        message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`👢 **${target.user.username}** ha sido expulsado.\n**Razón:** ${razon}`)] });
    }
};
