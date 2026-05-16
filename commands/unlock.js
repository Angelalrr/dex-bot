const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'unlock',
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true });
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription('🔓 **Este canal ha sido desbloqueado.**');
        message.reply({ embeds: [embed] });
    }
};
