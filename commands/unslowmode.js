const { EmbedBuilder } = require('discord.js');
const { hasModRoleOrHigher } = require('../utils/modPermissions');

module.exports = {
    name: 'unslowmode',
    aliases: ['unslow'],
    async execute(message) {
        if (!hasModRoleOrHigher(message.member)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ Necesitas rol mod o superior para usar este comando.')] });
        }

        await message.channel.setRateLimitPerUser(0, `Slowmode desactivado por ${message.author.tag}`);

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription('✅ Slowmode desactivado en este canal.');

        message.reply({ embeds: [embed] });
    }
};
