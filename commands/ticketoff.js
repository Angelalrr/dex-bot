const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { getGuildTicketSystems } = require('../utils/ticketSystem');
const { saveTicketDB } = require('../utils/storage');

module.exports = {
    name: 'ticketoff',
    aliases: ['ticketsdisable', 'disabletickets'],
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        const systems = getGuildTicketSystems(message.guild.id);
        const activeSystems = Object.values(systems).filter(system => system.active);
        if (activeSystems.length === 0) return message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('✅ No hay sistemas de tickets activos para desactivar.')] });
        for (const system of activeSystems) system.active = false;
        await saveTicketDB();
        message.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('✅ Sistema de tickets desactivado. Los botones ya no abrirán tickets hasta que lo actives/editas con `dex ticket`.')] });
    }
};
