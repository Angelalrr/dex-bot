const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { recordBan } = require('../utils/storage');
module.exports = {
    name: 'ban',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const target = message.mentions.members.first();
        const userId = target?.id || args[0]?.replace(/[<@!>]/g, '');
        if (!userId) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex ban @usuario razón`\n*(La razón puede ir en blanco)*')] });

        const existingBan = await message.guild.bans.fetch(userId).catch(() => null);
        if (global.bansDB?.[userId] || existingBan) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Ese usuario ya está baneado.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        await message.guild.members.ban(userId, { reason: razon });
        await recordBan(userId, { username: target?.user.username || userId, guildId: message.guild.id, moderatorId: message.author.id, razon, bannedAt: Date.now() });
        message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`🔨 **${target?.user.username || userId}** ha sido baneado.\n**Razón:** ${razon}`)] });
    }
};
