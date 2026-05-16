const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    execute(message) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex avatar @usuario`')] });
        }

        const avatarUrl = target.displayAvatarURL({ dynamic: true, size: 1024 });
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🖼️ **Avatar de ${target.username}**\nVe la imagen abajo.`)
            .setImage(avatarUrl);
        message.reply({ embeds: [embed] });
    }
};
