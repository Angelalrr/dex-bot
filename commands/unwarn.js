const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { saveWarningsDB } = require('../utils/storage');

module.exports = {
    name: 'unwarn',
    async execute(message, args) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const target = message.mentions.users.first();
        const cantidadRaw = args[1]?.toLowerCase();

        if (!target || !cantidadRaw) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unwarn @usuario cantidad`\n*(La cantidad debe ser del 1 al 3 o `all`)*')] });
        }

        const userWarns = global.warningsDB[target.id];
        if (!userWarns || userWarns.length === 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ **${target.username}** no tiene advertencias.`)] });
        }

        let cantidad;
        if (cantidadRaw === 'all') {
            cantidad = userWarns.length;
        } else {
            cantidad = parseInt(cantidadRaw, 10);
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 3) {
                return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ La cantidad debe ser un número del 1 al 3 o `all`.')] });
            }
        }

        const removedCount = Math.min(cantidad, userWarns.length);
        userWarns.splice(-removedCount, removedCount);

        if (userWarns.length === 0) {
            delete global.warningsDB[target.id];
        }

        await saveWarningsDB();

        const restantes = global.warningsDB[target.id]?.length || 0;
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`✅ Se quitaron **${removedCount}** advertencia(s) de **${target.username}**.\n**Warns restantes:** ${restantes}`);

        message.reply({ embeds: [embed] });
    }
};
