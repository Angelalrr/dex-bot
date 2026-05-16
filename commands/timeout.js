const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'timeout',
    async execute(message, args) {
        const target = message.mentions.members.first();
        const tiempo = parseInt(args[1]);
        if (!target || isNaN(tiempo)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex timeout @usuario tiempo razón`\n*(El tiempo es en minutos. La razón puede ir en blanco)*')] });
        }
        if (!message.member.permissions.has('ModerateMembers')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        const razon = args.slice(2).join(' ') || 'Ninguna especificada';
        await target.timeout(tiempo * 60 * 1000, razon);
        
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🤫 **${target.user.username}** ha sido silenciado por ${tiempo} minutos.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};