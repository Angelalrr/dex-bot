const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'afk',
    async execute(message, args) {
        // Por defecto, el objetivo es el que escribió el comando
        let target = message.member;
        let razon = args.join(' '); // Unimos todo lo que escribió

        // Revisamos si el primer argumento es "me" o una mención
        if (args[0]) {
            const primero = args[0].toLowerCase();
            if (primero === 'me') {
                // Si dijo "me", quitamos la palabra "me" de la razón
                razon = args.slice(1).join(' ');
            } else if (message.mentions.members.first()) {
                // Si mencionó a alguien, el objetivo cambia a esa persona
                target = message.mentions.members.first();
                razon = args.slice(1).join(' ');

                // Si intenta poner AFK a otra persona, comprobamos si es administrador
                if (target.id !== message.author.id && !message.member.permissions.has('ModerateMembers')) {
                    return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos para poner AFK a otra persona.')] });
                }
            }
        }

        // Si la razón quedó vacía
        if (!razon) razon = 'Ninguna especificada';

        // Obtenemos su nombre actual. Si ya tenía un [AFK] viejo, se lo quitamos para no duplicar: [AFK] [AFK] Juan
        let nombreOriginal = target.displayName;
        if (nombreOriginal.startsWith('[AFK] ')) {
            nombreOriginal = nombreOriginal.replace('[AFK] ', '');
        }

        // Guardamos sus datos en nuestra memoria global
        global.afkDB[target.id] = {
            razon: razon,
            nombreOriginal: nombreOriginal
        };

        // Intentamos cambiarle el apodo
        try {
            await target.setNickname(`[AFK] ${nombreOriginal}`);
        } catch (error) {
            // Nota: Discord prohíbe a los bots cambiar el apodo del dueño del servidor o de roles superiores.
            // Si eres el dueño, te pondrá AFK en el bot, pero no podrá cambiar tu nombre visualmente.
            console.log('No se pudo cambiar el apodo (falta de jerarquía).');
        }

        // Mensaje de éxito
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`💤 **${target.user.username}** ahora está AFK.\n**Razón:** ${razon}`);
        message.reply({ embeds: [embed] });
    }
};
