const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ban',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex ban @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        if (!message.member.permissions.has('BanMembers')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        await target.ban({ reason: razon });
        
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🔨 **${target.user.username}** ha sido baneado.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};