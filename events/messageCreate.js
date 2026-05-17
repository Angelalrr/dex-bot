const { Events, EmbedBuilder } = require('discord.js');
const { saveAfkDB, recordTimeout } = require('../utils/storage');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { getGuildSettings } = require('../utils/moderationSettings');
const { formatDuration } = require('../utils/timeParser');

const spamChains = new Map();
const SPAM_CHAIN_RESET_MS = 10 * 1000;
const LINK_REGEX = /(?:https?:\/\/|www\.|discord\.gg\/|discord\.com\/invite\/|(?:^|\s)[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*)/i;

function hasLink(content) {
    return LINK_REGEX.test(content);
}

function isSpamming(message) {
    const key = `${message.guild.id}:${message.channel.id}`;
    const now = Date.now();
    const current = spamChains.get(key);

    if (!current || current.userId !== message.author.id || now - current.lastMessageAt > SPAM_CHAIN_RESET_MS) {
        spamChains.set(key, {
            userId: message.author.id,
            count: 1,
            lastMessageAt: now
        });
        return false;
    }

    current.count += 1;
    current.lastMessageAt = now;
    spamChains.set(key, current);

    return current.count > 3;
}

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message, client) {
        // Ignorar si el mensaje fue enviado por otro bot
        if (message.author.bot) return;
        if (!message.guild) return;

        // --- SISTEMA AFK: QUITAR AFK SI EL JUGADOR VUELVE A HABLAR ---
        if (global.afkDB && global.afkDB[message.author.id]) {
            const datosAfk = global.afkDB[message.author.id];

            try {
                await message.member.setNickname(datosAfk.nombreOriginal);
            } catch (error) {
                // Ignoramos el error si el usuario tiene un rol más alto que el bot.
            }

            delete global.afkDB[message.author.id];
            await saveAfkDB();

            const embedRegreso = new EmbedBuilder()
                .setColor('#00b0f4')
                .setDescription(`👋 **${message.author.username}** ha vuelto y se le ha quitado el AFK.`);
            await message.channel.send({ embeds: [embedRegreso] });
        }
        // -------------------------------------------------------------

        // --- SISTEMA AFK: AVISAR SI MENCIONAN A ALGUIEN AFK ---
        if (global.afkDB && message.mentions.members.size > 0) {
            const usuariosAfkMencionados = message.mentions.members.filter(member => global.afkDB[member.id]);

            for (const member of usuariosAfkMencionados.values()) {
                const datosAfk = global.afkDB[member.id];
                const embedAfk = new EmbedBuilder()
                    .setColor('#00b0f4')
                    .setDescription(`💤 **${member.user.username}** está AFK.\n**Razón:** ${datosAfk.razon}`);
                await message.channel.send({ embeds: [embedAfk] });
            }
        }
        // --------------------------------------------------------

        const settings = getGuildSettings(message.guild.id);
        const isModerator = hasModRoleOrHigher(message.member);

        if (!isModerator && settings.antilink && hasLink(message.content)) {
            await message.delete().catch(() => null);
            const embedAntilink = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`🔗 **${message.author.username}**, los links están bloqueados en este servidor.`);
            const warning = await message.channel.send({ embeds: [embedAntilink] });
            setTimeout(() => warning.delete().catch(() => null), 4000);
            return;
        }

        if (!isModerator && settings.antispam.enabled && isSpamming(message)) {
            const timeoutMs = settings.antispam.timeoutMs || 60 * 60 * 1000;
            spamChains.delete(`${message.guild.id}:${message.channel.id}`);

            try {
                await message.member.timeout(timeoutMs, 'Antispam: más de 3 mensajes seguidos.');
                await recordTimeout(message.author.id, {
                    username: message.author.username,
                    moderatorId: client.user.id,
                    razon: 'Antispam: más de 3 mensajes seguidos.',
                    expiresAt: Date.now() + timeoutMs,
                    type: 'antispam'
                });
                await message.delete().catch(() => null);

                const embedAntispam = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`🚫 **${message.author.username}** recibió timeout por spam.\n**Duración:** ${formatDuration(timeoutMs)}`);
                await message.channel.send({ embeds: [embedAntispam] });
            } catch (error) {
                console.error('No pude aplicar timeout por antispam:', error);
            }
            return;
        }

        // Definimos nuestro prefijo
        const prefix = 'dex ';

        // Si el mensaje no empieza con "dex ", lo ignora
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        // Separar el nombre del comando y los argumentos
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Buscar el comando en nuestra mochila
        const command = client.commands.get(commandName);

        if (!command) return;

        // Ejecutar comando
        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);
            message.reply('Hubo un error al intentar ejecutar ese comando.');
        }
    },
};
