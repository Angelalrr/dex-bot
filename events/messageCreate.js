const { Events, EmbedBuilder } = require('discord.js');
const { saveAfkDB } = require('../utils/storage');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        // Ignorar si el mensaje fue enviado por otro bot
        if (message.author.bot) return;

        // --- SISTEMA AFK: QUITAR AFK SI EL JUGADOR VUELVE A HABLAR ---
        if (global.afkDB && global.afkDB[message.author.id]) {
            const datosAfk = global.afkDB[message.author.id];

            try {
                await message.member.setNickname(datosAfk.nombreOriginal);
            } catch (error) {
                // Ignoramos el error si el usuario tiene un rol más alto que el bot.
            }

            delete global.afkDB[message.author.id];
            await saveAfkDB();

            const embedRegreso = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`👋 **${message.author.username}** ha vuelto y se le ha quitado el AFK.`);
            await message.channel.send({ embeds: [embedRegreso] });
        }
        // -------------------------------------------------------------

        // --- SISTEMA AFK: AVISAR SI MENCIONAN A ALGUIEN AFK ---
        if (global.afkDB && message.mentions.members.size > 0) {
            const usuariosAfkMencionados = message.mentions.members.filter(member => global.afkDB[member.id]);

            for (const member of usuariosAfkMencionados.values()) {
                const datosAfk = global.afkDB[member.id];
                const embedAfk = new EmbedBuilder()
                    .setColor('#00b0f4')
                    .setDescription(`💤 **${member.user.username}** está AFK.\n**Razón:** ${datosAfk.razon}`);
                await message.channel.send({ embeds: [embedAfk] });
            }
        }
        // --------------------------------------------------------

        // Definimos nuestro prefijo
        const prefix = 'dex ';

        // Si el mensaje no empieza con "dex ", lo ignora
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        // Separar el nombre del comando y los argumentos
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Buscar el comando en nuestra mochila
        const command = client.commands.get(commandName);

        if (!command) return;

        // Ejecutar comando
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
