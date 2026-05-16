const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banner',
    async execute(message, args, client) {
        const target = message.mentions.users.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex banner @usuario`')] });
        }

        const fetchedUser = await client.users.fetch(target.id, { force: true });
        const bannerUrl = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

        if (!bannerUrl) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ **${target.username}** no tiene banner.`)] });
        }

        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`🖼️ **Banner de ${target.username}**\nVe la imagen abajo.`)
            .setImage(bannerUrl);
        message.reply({ embeds: [embed] });
    }
};
