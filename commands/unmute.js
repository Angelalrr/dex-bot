const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'unmute',
    async execute(message) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unmute @usuario`')] });
        }
        if (!message.member.permissions.has('ManageRoles')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No existe un rol llamado "Muted".')] });

        await target.roles.remove(muteRole);
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription(`🔊 Se ha quitado el rol Muted a **${target.user.username}**.`);
        message.reply({ embeds: [embed] });
    }
};