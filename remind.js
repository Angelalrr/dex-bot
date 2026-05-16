const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'remind',
    execute(message, args) {
        const tiempo = parseInt(args[0]);
        const texto = args.slice(1).join(' ');
        if (isNaN(tiempo) || !texto) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex remind tiempo mensaje`\n*(El tiempo es en minutos)*')] });
        }
        const embedAviso = new EmbedBuilder().setColor('#00b0f4').setDescription(`⏰ ¡Anotado! Te recordaré en **${tiempo} minutos**.`);
        message.reply({ embeds: [embedAviso] });

        setTimeout(() => {
            const embedRecordatorio = new EmbedBuilder().setColor('#00b0f4').setDescription(`⏰ **RECORDATORIO:**\n\n${texto}`);
            message.author.send({ embeds: [embedRecordatorio] }).catch(() => {
                message.channel.send({ content: `<@${message.author.id}>`, embeds: [embedRecordatorio] });
            });
        }, tiempo * 60 * 1000);
    }
};