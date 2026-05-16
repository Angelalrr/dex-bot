const { EmbedBuilder } = require('discord.js');
const { saveAfkDB } = require('../utils/storage');

module.exports = {
    name: 'afk',
    async execute(message, args) {
        const target = message.member;
        const razon = args.join(' ').trim() || 'Ninguna especificada';

        let nombreOriginal = target.displayName;
        if (nombreOriginal.startsWith('[AFK] ')) {
            nombreOriginal = nombreOriginal.replace('[AFK] ', '');
        }

        global.afkDB[target.id] = {
            razon,
            nombreOriginal
        };
        saveAfkDB();

        try {
            await target.setNickname(`[AFK] ${nombreOriginal}`);
        } catch (error) {
            console.log('No se pudo cambiar el apodo (falta de jerarquía).');
        }

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`💤 **${target.user.username}** ahora está AFK.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};
