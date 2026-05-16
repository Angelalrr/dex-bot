const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'lock',
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription('🔒 **Este canal ha sido bloqueado.** Nadie puede escribir.');
        message.reply({ embeds: [embed] });
    }
};
