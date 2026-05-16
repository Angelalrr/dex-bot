const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'mute',
    async execute(message, args) {
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex mute @usuario razón`\n*(La razón puede ir en blanco)*')] });
        }
        
        // El permiso necesario para esto se llama ModerateMembers (Aislar miembros)
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos para usar este comando.')] });
        }

        const razon = args.slice(1).join(' ') || 'Ninguna especificada';
        
        // Calculamos 28 días en milisegundos (Es el límite máximo de Discord)
        const tiempoMaximo = 28 * 24 * 60 * 60 * 1000;

        try {
            // Aplicamos el silencio nativo sin usar ningún rol
            await target.timeout(tiempoMaximo, razon);
            
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
