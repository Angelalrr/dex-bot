const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'warn',
    execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex warn @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        if (!message.member.permissions.has('ModerateMembers')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        if (!global.warningsDB[target.id]) global.warningsDB[target.id] = [];
        global.warningsDB[target.id].push(razon);
        
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`⚠️ **${target.username}** ha recibido una advertencia.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};