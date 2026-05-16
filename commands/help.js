module.exports = {
    name: 'help',
    execute(message, args, client) {
        // Mapeamos los nombres de todos los comandos cargados
        const commandList = client.commands.map(cmd => `\`dex ${cmd.name}\``).join(', ');
        message.reply(`**Lista de comandos disponibles:**\n${commandList}`);
    }
};
