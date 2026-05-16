const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'uptime',
    execute(message, args, client) {
        const uptime = Math.floor(client.uptime / 1000);
        const horas = Math.floor(uptime / 3600);
        const minutos = Math.floor((uptime % 3600) / 60);
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`⏱️ Llevo activo y funcionando **${horas} horas y ${minutos} minutos**.`);
        message.reply({ embeds: [embed] });
    }
};