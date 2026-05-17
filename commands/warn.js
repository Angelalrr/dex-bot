const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { saveWarningsDB, recordTimeout } = require('../utils/storage');

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

module.exports = {
    name: 'warn',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex warn @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        if (!global.warningsDB[target.id]) global.warningsDB[target.id] = [];
        global.warningsDB[target.id].push(razon);
        await saveWarningsDB();

        let timeoutApplied = false;
        if (global.warningsDB[target.id].length >= 3) {
            try {
                await target.timeout(MAX_TIMEOUT_MS, 'Acumuló 3 advertencias.');
                await recordTimeout(target.id, {
                    username: target.user.username,
                    moderatorId: message.author.id,
                    razon: 'Acumuló 3 advertencias.',
                    expiresAt: Date.now() + MAX_TIMEOUT_MS,
                    type: 'warns'
                });
                timeoutApplied = true;
            } catch (error) {
                return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ La advertencia fue guardada, pero no pude aplicar el timeout de 28 días. Es posible que el usuario tenga un rol superior al mío o sea el dueño del servidor.')] });
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`⚠️ **${target.user.username}** ha recibido una advertencia.\n**Razón:** ${razon}\n**Warns actuales:** ${global.warningsDB[target.id].length}${timeoutApplied ? '\n\n🤐 Alcanzó 3 advertencias y recibió timeout por 28 días.' : ''}`);
        message.reply({ embeds: [embed] });
    }
};
