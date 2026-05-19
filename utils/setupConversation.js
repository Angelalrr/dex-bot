const { EmbedBuilder } = require('discord.js');

async function askQuestion(message, question, options = {}) {
    const prompt = await message.channel.send({
        embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription(question)]
    });

    try {
        const collected = await message.channel.awaitMessages({
            filter: response => response.author.id === message.author.id,
            max: 1,
            time: options.time || 120000,
            errors: ['time']
        });
        return collected.first();
    } catch (error) {
        await prompt.edit({
            embeds: [new EmbedBuilder().setColor('Red').setDescription('⏰ Se acabó el tiempo de configuración. Vuelve a usar el comando cuando estés listo.')]
        }).catch(() => null);
        return null;
    }
}

function parseTextChannel(message, response) {
    const channelId = response.mentions.channels.first()?.id || response.content.replace(/[<#>]/g, '').trim();
    return message.guild.channels.cache.get(channelId) || null;
}

function parseRole(message, response) {
    const roleId = response.mentions.roles.first()?.id || response.content.replace(/[<@&>]/g, '').trim();
    return message.guild.roles.cache.get(roleId) || null;
}

module.exports = { askQuestion, parseTextChannel, parseRole };
