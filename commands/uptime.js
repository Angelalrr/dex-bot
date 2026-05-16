// commands/uptime.js
module.exports = {
    name: 'uptime',
    execute(message, args, client) {
        // client.uptime está en milisegundos. Lo pasamos a segundos.
        const uptime = Math.floor(client.uptime / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        message.reply(`Llevo encendido: **${hours} horas y ${minutes} minutos** sin dormir.`);
    }
};