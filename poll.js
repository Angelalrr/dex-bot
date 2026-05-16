const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'poll',
    async execute(message, args) {
        const pregunta = args.join(' ');
        if (!pregunta) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex poll pregunta`')] });
        }
        message.delete();
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`📊 **ENCUESTA**\n\n${pregunta}`);
        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react('👍');
        await msg.react('👎');
    }
};