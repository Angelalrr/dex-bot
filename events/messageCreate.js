const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message, client) {
        // Ignorar si el mensaje fue enviado por otro bot
        if (message.author.bot) return;

        // Definimos nuestro "prefijo" (la palabra disparadora)
        const prefix = 'dex ';
        
        // Si el mensaje no empieza con "dex ", lo ignora silenciosamente
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        // Separar el nombre del comando y los argumentos
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Buscar el comando en nuestra mochila
        const command = client.commands.get(commandName);

        // Si el comando no existe, nos detenemos aquí
        if (!command) return;

        // Si el comando existe, lo ejecutamos
        try {
            command.execute(message, args, client);
        } catch (error) {
            // Este console.error sí lo dejamos porque es una buena práctica 
            // registrar errores reales que puedan tumbar al bot
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
