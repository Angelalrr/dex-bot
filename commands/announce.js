const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
module.exports = {
    name: 'announce',
    execute(message, args) {
        const canal = message.mentions.channels.first();
        const texto = args.slice(1).join(' ');
        if (!canal || !texto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex announce #canal mensaje`')] });
        }
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        message.delete();
        const embedAnuncio = new EmbedBuilder().setColor('#00b0f4').setDescription(`📢 **ANUNCIO**\n\n${texto}`);
        canal.send({ embeds: [embedAnuncio] });

        const success = new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Anuncio enviado correctamente en ${canal}`);
        message.channel.send({ embeds: [success] }).then(msg => setTimeout(() => msg.delete(), 3000));
    }
};
