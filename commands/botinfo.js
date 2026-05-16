const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'botinfo',
    execute(message, args, client) {
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🤖 **Información de Dex**\n\n**Servidores:** ${client.guilds.cache.size}\n**RAM en uso:** ${memory} MB\n**Versión Node.js:** ${process.version}`);
        message.reply({ embeds: [embed] });
    }
};