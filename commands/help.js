const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`
📚 **LISTA DE COMANDOS DE DEX** 📚

🛠️ **Información Básica**
🔸 **dex ping** | Muestra la latencia y velocidad de respuesta.
↳ *Estructura:* \`dex ping\`
🔸 **dex help** | Muestra la lista de comandos y cómo usarlos.
↳ *Estructura:* \`dex help\`
🔸 **dex uptime** | Muestra cuánto tiempo lleva activo el bot.
↳ *Estructura:* \`dex uptime\`
🔸 **dex botinfo** | Muestra información general del bot.
↳ *Estructura:* \`dex botinfo\`

👤 **Usuarios y Servidor**
🔸 **dex userinfo** | Muestra información de un usuario.
↳ *Estructura:* \`dex userinfo @usuario\`
🔸 **dex serverinfo** | Muestra información del servidor.
↳ *Estructura:* \`dex serverinfo\`
🔸 **dex avatar** | Muestra el avatar de un usuario.
↳ *Estructura:* \`dex avatar @usuario\`
🔸 **dex banner** | Muestra el banner de un usuario.
↳ *Estructura:* \`dex banner @usuario\`

🛡️ **Moderación**
🔸 **dex purgue** | Limpia un porcentaje de los mensajes recientes.
↳ *Estructura:* \`dex purgue número\`
🔸 **dex kick** | Expulsa a un usuario.
↳ *Estructura:* \`dex kick @usuario razón\`
🔸 **dex ban** | Banea a un usuario.
↳ *Estructura:* \`dex ban @usuario/ID razón\`
🔸 **dex unban** | Desbanea a un usuario por ID.
↳ *Estructura:* \`dex unban ID_usuario razón\`
🔸 **dex timeout** | Silencia temporalmente.
↳ *Estructura:* \`dex timeout @usuario tiempo razón\`
🔸 **dex untimeout** | Quita el timeout de un usuario.
↳ *Estructura:* \`dex untimeout @usuario\`
🔸 **dex slowmode** | Activa el slowmode del canal. *(Alias: dex slow)*
↳ *Estructura:* \`dex slowmode tiempo\`
🔸 **dex unslowmode** | Quita el slowmode del canal. *(Alias: dex unslow)*
↳ *Estructura:* \`dex unslowmode\`
🔸 **dex antilink** | Bloquea o permite links.
↳ *Estructura:* \`dex antilink on/off\`
🔸 **dex antispam** | Activa o desactiva timeout por spam.
↳ *Estructura:* \`dex antispam on/off tiempo\`
🔸 **dex warn** | Añade una advertencia.
↳ *Estructura:* \`dex warn @usuario razón\`
🔸 **dex unwarn** | Quita advertencias de un usuario.
↳ *Estructura:* \`dex unwarn @usuario 1-3/all\`
🔸 **dex warnings** | Muestra advertencias de un usuario.
↳ *Estructura:* \`dex warnings @usuario\`
🔸 **dex verify** | Configura el sistema de verificación paso a paso.
↳ *Estructura:* \`dex verify\`
🔸 **dex lock** | Bloquea un canal.
↳ *Estructura:* \`dex lock\`
🔸 **dex unlock** | Desbloquea un canal.
↳ *Estructura:* \`dex unlock\`

💬 **Interacción y Utilidades**
🔸 **dex say** | Hace que el bot envíe un mensaje.
↳ *Estructura:* \`dex say mensaje\`
🔸 **dex announce** | Envía un anuncio en un canal.
↳ *Estructura:* \`dex announce #canal mensaje\`
🔸 **dex suggest** | Envía una sugerencia.
↳ *Estructura:* \`dex suggest sugerencia\`
🔸 **dex poll** | Crea una encuesta.
↳ *Estructura:* \`dex poll pregunta\`
🔸 **dex remind** | Crea un recordatorio.
↳ *Estructura:* \`dex remind tiempo mensaje\`
🔸 **dex afk** | Marca tu estado como AFK.
↳ *Estructura:* \`dex afk razón\`
🔸 **dex unafk** | Quita manualmente el AFK de un usuario. *(Solo owner)*
↳ *Estructura:* \`dex unafk @usuario\`

🎫 **Tickets y Roles**
🔸 **dex ticket** | Configura el sistema de tickets paso a paso.
↳ *Estructura:* \`dex ticket\`
🔸 **dex ticketoff** | Desactiva los sistemas de tickets activos.
↳ *Estructura:* \`dex ticketoff\`
🔸 **dex closeticket** | Cierra un ticket.
↳ *Estructura:* \`dex closeticket\`
🔸 **dex addrole** | Añade un rol a un usuario.
↳ *Estructura:* \`dex addrole @usuario @rol\`
🔸 **dex removerole** | Quita un rol a un usuario.
↳ *Estructura:* \`dex removerole @usuario @rol\`
            `);
        message.reply({ embeds: [embed] });
    }
};
