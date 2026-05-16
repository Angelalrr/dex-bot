const { EmbedBuilder } = require('discord.js');
const { saveAfkDB } = require('../utils/storage');

function isOwner(message) {
    return Boolean(process.env.OWNER_ID && message.author.id === process.env.OWNER_ID);
}

module.exports = {
    name: 'unafk',
    async execute(message) {
        if (!isOwner(message)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Solo el owner puede usar este comando.')] });
        }

        const target = message.mentions.members.first();

        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unafk @usuario`')] });
        }

        if (!global.afkDB || !global.afkDB[target.id]) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ **${target.user.username}** no está en modo AFK.`)] });
        }

        const datosAfk = global.afkDB[target.id];

        try {
            await target.setNickname(datosAfk.nombreOriginal);
        } catch (error) {
            // Ignoramos el error si el usuario tiene un rol más alto que el bot.
        }

        delete global.afkDB[target.id];
        saveAfkDB();

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`👋 Se le ha quitado el estado AFK a **${target.user.username}** de forma manual.`);
        message.reply({ embeds: [embed] });
    }
};
