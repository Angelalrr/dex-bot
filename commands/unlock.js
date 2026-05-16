const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'unlock',
    async execute(message) {
        if (!message.member.permissions.has('ManageChannels')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true });
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription('🔓 **Este canal ha sido desbloqueado.**');
        message.reply({ embeds: [embed] });
    }
};