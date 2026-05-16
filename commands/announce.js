const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'announce',
    execute(message, args) {
        const canal = message.mentions.channels.first();
        const texto = args.slice(1).join(' ');
        if (!canal || !texto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex announce #canal mensaje`')] });
        }
        if (!message.member.permissions.has('ManageMessages')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });
        
        message.delete();
        const embedAnuncio = new EmbedBuilder().setColor('#00b0f4').setDescription(`📢 **ANUNCIO**\n\n${texto}`);
        canal.send({ embeds: [embedAnuncio] });
        
        const success = new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Anuncio enviado correctamente en ${canal}`);
        message.channel.send({ embeds: [success] }).then(msg => setTimeout(() => msg.delete(), 3000));
    }
};