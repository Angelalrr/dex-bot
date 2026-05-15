// Requerimos las herramientas de discord.js que vamos a usar
const { Client, GatewayIntentBits, Collection } = require('discord.js');
// Requerimos fs (File System) para leer las carpetas de nuestra computadora
const fs = require('fs');
// Requerimos dotenv para leer nuestro archivo .env de forma segura
require('dotenv').config();
// Requerimos express para crear un servidor web (vital para el host gratuito)
const express = require('express');

// --- SISTEMA ANTI-APAGADO (Servidor Web) ---
const app = express();
// Cuando alguien entre a la URL de nuestro bot, mostrará este mensaje
app.get('/', (req, res) => res.send('Dex está en línea y funcionando.'));
// El servidor escuchará en un puerto asignado por el host o el 3000
app.listen(process.env.PORT || 3000, () => console.log('Servidor web encendido.'));

// --- CREACIÓN DEL CLIENTE DE DISCORD (El Bot) ---
// Los Intents le dicen a Discord qué información necesitamos recibir
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Para saber en qué servidores está
        GatewayIntentBits.GuildMessages, // Para leer mensajes
        GatewayIntentBits.MessageContent, // Para leer el CONTENIDO del mensaje (la palabra "dex")
        GatewayIntentBits.GuildMembers // Para ver a los usuarios (necesario para kick/ban/roles)
    ]
});

// Creamos una colección (como un diccionario) para guardar nuestros comandos
client.commands = new Collection();

// --- CARGADOR DE COMANDOS ---
// Leemos todos los archivos que terminen en .js dentro de la carpeta 'commands'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Guardamos el comando en la colección usando su nombre como llave
    client.commands.set(command.name, command);
}

// --- CARGADOR DE EVENTOS ---
// Leemos los archivos de la carpeta 'events'
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    // Si el evento es de tipo "una sola vez" (once), lo ejecutamos así
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        // Si es continuo (on), lo ejecutamos así
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Finalmente, encendemos el bot usando el Token del .env
client.login(process.env.TOKEN);