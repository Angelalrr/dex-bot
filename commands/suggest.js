const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'suggest',
    async execute(message, args) {
        const texto = args.join(' ');
        if (!texto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex suggest sugerencia`')] });
        }
        message.delete();
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`💡 **Nueva Sugerencia de ${message.author.username}**\n\n${texto}`);
        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react('✅');
        await msg.react('❌');
    }
};