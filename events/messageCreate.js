const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message, client) {
        // --- CHISMOSO 1: Ver si lee el mensaje ---
        console.log(`He leído un mensaje de ${message.author.username} que dice: "${message.content}"`);

        // Ignorar si es otro bot
        if (message.author.bot) return;

        const prefix = 'dex ';
        
        // Si no empieza con "dex ", lo ignora silenciosamente
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        // Separar el comando y los argumentos
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // --- CHISMOSO 2: Ver qué intenta buscar ---
        console.log(`🔍 Intentando buscar el comando: "${commandName}"`);

        // Buscar en la mochila de comandos
        const command = client.commands.get(commandName);

        // Si no existe, nos avisa en la consola y se detiene
        if (!command) {
            console.log(`❌ No se encontró ningún comando en la mochila llamado "${commandName}"`);
            return;
        }

        // Si existe, intentar ejecutarlo
        try {
            command.execute(message, args, client);
            console.log(`🚀 Comando "${commandName}" ejecutado con éxito por ${message.author.username}`);
        } catch (error) {
            console.error(`💥 Error al ejecutar el comando ${commandName}:`, error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
