const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'timeout',
    async execute(message, args) {
        // args[0] es la mención del usuario, args[1] es el tiempo
        const target = message.mentions.members.first();
        const tiempo = parseInt(args[1]);
        
        // Verificamos si falta el usuario, falta el tiempo, o el tiempo no es un número válido
        if (!target || isNaN(tiempo)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex timeout @usuario tiempo razón`\n*(El tiempo es en minutos. La razón puede ir en blanco)*')] });
        }
        
        // Verificamos permisos del que ejecuta el comando
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos para usar este comando.')] });
        }

        // Límite de seguridad de Discord: El timeout máximo es de 28 días (40320 minutos)
        if (tiempo > 40320) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ El tiempo máximo que permite Discord es de 28 días (40320 minutos).')] });
        }

        // Si escriben una razón la guardamos, si no, ponemos "Ninguna especificada"
        const razon = args.slice(2).join(' ') || 'Ninguna especificada';

        try {
            // Convertimos los minutos que pidió el usuario a milisegundos (1 min = 60,000 ms)
            await target.timeout(tiempo * 60 * 1000, razon);
            
            const embed = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`🤫 **${target.user.username}** ha sido silenciado temporalmente.\n**Duración:** ${tiempo} minutos\n**Razón:** ${razon}`);
            message.reply({ embeds: [embed] });
            
        } catch (error) {
            // Si intentan silenciar al dueño o a un administrador, evitamos que el bot se apague
            message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No puedo silenciar a este usuario. Es posible que tenga un rol superior al mío o sea el dueño del servidor.')] });
        }
    }
};
