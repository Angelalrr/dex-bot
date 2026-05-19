// Requerimos las herramientas de discord.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { loadData } = require('./utils/storage');

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

async function startBot() {
    // Creamos la mochila de comandos
    client.commands = new Collection();

    // Cargamos la memoria persistente gratuita desde Supabase si está configurado
    const persistedData = await loadData();
    global.warningsDB = persistedData.warningsDB;
    global.afkDB = persistedData.afkDB;
    global.timeoutsDB = persistedData.timeoutsDB;
    global.bansDB = persistedData.bansDB;
    global.moderationSettingsDB = persistedData.moderationSettingsDB;
    global.verificationSystemsDB = persistedData.verificationSystemsDB;
    global.verifiedUsersDB = persistedData.verifiedUsersDB;
    global.ticketSystemsDB = persistedData.ticketSystemsDB;
    global.ticketCountersDB = persistedData.ticketCountersDB;
    global.moderationActionsDB = persistedData.moderationActionsDB;

    // --- CARGADOR DE COMANDOS ---
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                client.commands.set(alias, command);
            }
        }
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
    await client.login(process.env.TOKEN);
}

startBot().catch(error => {
    console.error('No se pudo iniciar Dex:', error);
});
