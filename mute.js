const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'mute',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex mute @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        if (!message.member.permissions.has('ManageRoles')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No existe un rol llamado "Muted".')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        await target.roles.add(muteRole);
        
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🤐 **${target.user.username}** ha sido silenciado con el rol Muted.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};