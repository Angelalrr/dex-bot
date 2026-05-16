const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        // Ignorar si el mensaje fue enviado por otro bot
        if (message.author.bot) return;

        // --- NUEVO SISTEMA: DETECTOR AFK ---
        // Si el usuario que acaba de hablar está guardado en la memoria de AFK...
        if (global.afkDB && global.afkDB[message.author.id]) {
            const datosAfk = global.afkDB[message.author.id];
            const target = message.member;

            // 1. Intentamos devolverle su nombre original quitando el [AFK]
            try {
                await target.setNickname(datosAfk.nombreOriginal);
            } catch (error) {
                // Ignorar si es el dueño o rol mayor
            }

            // 2. Lo borramos de la lista de AFK
            delete global.afkDB[message.author.id];

            // 3. Avisamos que volvió
            const embedRegreso = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`👋 **${message.author.username}** ha vuelto y se le ha quitado el AFK.`);
            message.channel.send({ embeds: [embedRegreso] });
        }
        // ------------------------------------

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
            command.execute(message, args, client);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
