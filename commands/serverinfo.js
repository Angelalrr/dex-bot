const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'serverinfo',
    execute(message) {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🏰 **Información del servidor: ${guild.name}**\n\n**ID:** ${guild.id}\n**Miembros Totales:** ${guild.memberCount}\n**Creado el:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`);
        message.reply({ embeds: [embed] });
    }
};