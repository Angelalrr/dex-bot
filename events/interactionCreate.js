const { Events, EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');
const { saveTicketDB, saveVerificationDB } = require('../utils/storage');
const { createTicketChannel, getGuildTicketSystems } = require('../utils/ticketSystem');
const { getGuildVerificationSystems, getGuildVerifiedUsers, markMemberVerified } = require('../utils/verificationSystem');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isButton() || !interaction.guild) return;

        if (interaction.customId.startsWith('verify:')) {
            const systemId = interaction.customId.split(':')[1];
            const system = getGuildVerificationSystems(interaction.guild.id)[systemId];
            if (!system) return interaction.reply({ content: 'Este sistema de verificación ya no existe.', ephemeral: true });
            if (interaction.user.id === interaction.guild.ownerId) return interaction.reply({ content: 'El owner no necesita verificarse.', ephemeral: true });

            const verifiedUsers = getGuildVerifiedUsers(interaction.guild.id);
            if (verifiedUsers[interaction.user.id]) return interaction.reply({ content: 'Ya estás verificado.', ephemeral: true });
            if (system.appliesTo.type === 'role' && !interaction.member.roles.cache.has(system.appliesTo.roleId)) {
                return interaction.reply({ content: 'Este sistema de verificación no aplica para ti.', ephemeral: true });
            }

            await markMemberVerified(interaction.member, system);
            await saveVerificationDB();
            return interaction.reply({ content: '✅ Verificación completada. Ya puedes ver los canales permitidos.', ephemeral: true });
        }

        if (interaction.customId.startsWith('ticket_open:')) {
            const [, systemId, optionIndexRaw] = interaction.customId.split(':');
            const system = getGuildTicketSystems(interaction.guild.id)[systemId];
            const option = system?.options?.[Number(optionIndexRaw)];
            if (!system || !option) return interaction.reply({ content: 'Este sistema de tickets ya no existe.', ephemeral: true });
            if (!system.active) return interaction.reply({ content: 'El sistema de tickets está desactivado.', ephemeral: true });

            const { channel } = await createTicketChannel(interaction, system, option);
            await saveTicketDB();
            return interaction.reply({ content: `✅ Tu ticket fue creado en ${channel}.`, ephemeral: true });
        }

        if (interaction.customId === 'ticket_close') {
            if (!hasModRoleOrHigher(interaction.member)) return interaction.reply({ content: 'Solo moderadores o superiores pueden cerrar tickets.', ephemeral: true });
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00b0f4').setDescription('🔒 Cerrando ticket en 3 segundos...')] });
            setTimeout(() => interaction.channel.delete().catch(() => null), 3000);
        }
    }
};
