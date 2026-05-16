const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'clear',
    async execute(message, args) {
        const cantidad = parseInt(args[0]);
        if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto o es inválido.**\n\n**Estructura:**\n`dex clear cantidad`\n*(La cantidad debe ser un número entre 1 y 100)*')] });
        }
        if (!message.member.permissions.has('ManageMessages')) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos.')] });

        await message.channel.bulkDelete(cantidad, true);
        const embed = new EmbedBuilder().setColor('#00b0f4').setDescription(`🧹 Se han eliminado **${cantidad} mensajes**.`);
        message.channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 4000));
    }
};