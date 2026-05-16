const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ping',
    execute(message, args, client) {
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🏓 **Pong!** La latencia y velocidad de respuesta del bot es de **${client.ws.ping}ms**.`);
        message.reply({ embeds: [embed] });
    }
};