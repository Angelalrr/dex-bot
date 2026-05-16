// Requerimos las herramientas de discord.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const express = require('express');

// --- SISTEMA ANTI-APAGADO (Servidor Web) ---
const app = express();
app.get('/', (req, res) => res.send('Dex está en línea y funcionando.'));
app.listen(process.env.PORT || 3000, () => console.log('Servidor web encendido.'));

// --- CREACIÓN DEL CLIENTE DE DISCORD ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Creamos la mochila de comandos
client.commands = new Collection();

// Creamos la memoria temporal para el comando de advertencias (warns)
global.warningsDB = {};

// --- CARGADOR DE COMANDOS ---
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// --- CARGADOR DE EVENTOS ---
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Encendemos el bot
client.login(process.env.TOKEN);
