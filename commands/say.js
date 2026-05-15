// commands/say.js
module.exports = {
    name: 'say',
    execute(message, args) {
        if (args.length === 0) return message.reply('Dime qué quieres que repita.');
        // Unimos el array de palabras con espacios
        const texto = args.join(' ');
        // Borramos el mensaje del autor para que parezca que el bot habló solo
        message.delete();
        message.channel.send(texto);
    }
};