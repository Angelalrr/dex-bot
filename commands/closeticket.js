const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'closeticket',
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Solo moderadores o superiores pueden cerrar tickets.')] });
        }
        if (!message.channel.name.includes('ticket')) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Este comando solo se puede usar dentro de un canal de ticket.')] });
        }
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription('🔒 Cerrando ticket en 3 segundos...');
        message.channel.send({ embeds: [embed] });
        setTimeout(() => message.channel.delete(), 3000);
    }
};
