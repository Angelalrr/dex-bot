const { Events, ActivityType } = require('discord.js');

module.exports = {
    // Nombre del evento
    name: Events.ClientReady,
    // Este evento solo ocurre una vez al iniciar
    once: true,
    execute(client) {
        console.log(`¡Listo! El bot ${client.user.tag} ha despertado.`);
        
        // Le ponemos un estado al bot (Ej: "Jugando a ser el mejor bot")
        client.user.setActivity('dex help', { type: ActivityType.Listening });
    },
};
