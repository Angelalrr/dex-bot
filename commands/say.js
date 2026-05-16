const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'say',
    execute(message, args) {
        const texto = args.join(' ');
        if (!texto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex say mensaje`')] });
        }
        message.delete();
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription(texto);
        message.channel.send({ embeds: [embed] });
    }
};