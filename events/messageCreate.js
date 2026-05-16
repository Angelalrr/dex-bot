const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message, client) {
        // Si el mensaje fue enviado por otro bot, lo ignoramos para evitar bucles
        if (message.author.bot) return;

        // Nuestro disparador principal
        const prefix = 'dex ';

        // Convertimos el mensaje a minúsculas y revisamos si empieza con "dex "
        // Si alguien escribe "Hola", esto lo ignora y detiene el código (return)
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        // Separamos el mensaje. 
        // Ejemplo: "dex kick @usuario spam"
        // .slice(prefix.length) quita el "dex " -> "kick @usuario spam"
        // .split(/ +/) lo divide por espacios -> ["kick", "@usuario", "spam"]
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        
        // .shift() saca la primera palabra del array ("kick") y la pasa a minúsculas
        const commandName = args.shift().toLowerCase();

        // Buscamos si existe un comando con ese nombre en nuestra colección
        const command = client.commands.get(commandName);

        // Si el comando no existe, no hacemos nada
        if (!command) return;

        try {
            // Si existe, lo ejecutamos pasándole el mensaje y los argumentos extra
            command.execute(message, args, client);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
