const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { recordTimeout } = require('../utils/storage');

module.exports = {
    name: 'mute',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex mute @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }

        // El permiso necesario para esto se llama ModerateMembers (Aislar miembros)
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';

        // Calculamos 28 días en milisegundos (Es el límite máximo de Discord)
        const tiempoMaximo = 28 * 24 * 60 * 60 * 1000;

        try {
            // Aplicamos el silencio nativo sin usar ningún rol
            await target.timeout(tiempoMaximo, razon);
            recordTimeout(target.id, {
                username: target.user.username,
                moderatorId: message.author.id,
                razon,
                expiresAt: Date.now() + tiempoMaximo,
                type: 'mute'
            });

            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`🤐 **${target.user.username}** ha sido silenciado (Aislado por 28 días).\n**Razón:** ${razon}`);
            message.reply({ embeds: [embed] });

        } catch (error) {
            // Si hay error (ejemplo: el usuario es el dueño del server), avisamos
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No puedo silenciar a este usuario. Es posible que tenga un rol superior al mío o sea el dueño del servidor.')] });
        }
    }
};
