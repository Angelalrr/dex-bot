const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'userinfo',
    execute(message) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex userinfo @usuario`')] });
        }
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`👤 **Información de ${target.user.username}**\n\n**ID:** ${target.user.id}\n**Se unió a Discord:** <t:${Math.floor(target.user.createdTimestamp / 1000)}:R>\n**Se unió al Servidor:** <t:${Math.floor(target.joinedTimestamp / 1000)}:R>`);
        message.reply({ embeds: [embed] });
    }
};