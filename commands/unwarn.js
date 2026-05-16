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
        const cantidadArg = args[1]?.toLowerCase();

        if (!target || !cantidadArg) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unwarn @usuario cantidad`\n*(La cantidad debe ser `1`, `2`, `3` o `all`)*')] });
        }

        const userWarns = global.warningsDB[target.id];
        if (!userWarns || userWarns.length === 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ **${target.username}** no tiene advertencias para quitar.`)] });
        }

        let removedWarns;
        if (cantidadArg === 'all') {
            removedWarns = [...userWarns];
            delete global.warningsDB[target.id];
        } else {
            const cantidad = Number(cantidadArg);
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 3) {
                return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ La cantidad debe ser `1`, `2`, `3` o `all`.')] });
            }

            removedWarns = userWarns.splice(-cantidad, cantidad);
            if (userWarns.length === 0) {
                delete global.warningsDB[target.id];
            }
        }

        await saveWarningsDB();

        const remainingWarns = global.warningsDB[target.id]?.length || 0;
        const removedList = removedWarns.map((warn, index) => `**${index + 1}.** ${warn}`).join('\n');
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`✅ Se quitaron **${removedWarns.length}** advertencia(s) de **${target.username}**.\n**Advertencias restantes:** ${remainingWarns}\n\n**Advertencias quitadas:**\n${removedList}`);
        message.reply({ embeds: [embed] });
    }
};
