const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'lock',
    async execute(message) {
        if (!message.member.permissions.has('ManageChannels')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });
        await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription('🔒 **Este canal ha sido bloqueado.** Nadie puede escribir.');
        message.reply({ embeds: [embed] });
    }
};