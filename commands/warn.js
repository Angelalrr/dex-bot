const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { recordTimeout, saveWarningsDB } = require('../utils/storage');

module.exports = {
    name: 'warn',
    async execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex warn @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        if (!global.warningsDB[target.id]) global.warningsDB[target.id] = [];
        global.warningsDB[target.id].push(razon);
        await saveWarningsDB();

        const totalWarns = global.warningsDB[target.id].length;
        let timeoutMessage = '';

        if (totalWarns === 3) {
            const targetMember = message.mentions.members.first();
            if (targetMember) {
                const tiempoMaximo = 28 * 24 * 60 * 60 * 1000;
                const timeoutReason = 'Acumuló 3 advertencias';

                try {
                    await targetMember.timeout(tiempoMaximo, timeoutReason);
                    await recordTimeout(target.id, {
                        username: target.username,
                        moderatorId: message.author.id,
                        razon: timeoutReason,
                        expiresAt: Date.now() + tiempoMaximo,
                        type: 'warn-auto-timeout'
                    });
                    timeoutMessage = '\n\n🤫 También recibió timeout máximo de **28 días** por acumular **3 advertencias**.';
                } catch (error) {
                    timeoutMessage = '\n\n⚠️ No pude darle timeout automático. Es posible que tenga un rol superior al mío o sea el dueño del servidor.';
                }
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`⚠️ **${target.username}** ha recibido una advertencia.\n**Razón:** ${razon}\n**Advertencias totales:** ${totalWarns}${timeoutMessage}`);
        message.reply({ embeds: [embed] });
    }
};
