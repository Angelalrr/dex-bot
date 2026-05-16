const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'avatar',
    execute(message) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex avatar @usuario`')] });
        }
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🖼️ **Avatar de ${target.username}**\n[Haz clic aquí para verlo en grande](${target.displayAvatarURL({ dynamic: true, size: 1024 })})`);
        message.reply({ embeds: [embed] });
    }
};