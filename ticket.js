const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
module.exports = {
    name: 'ticket',
    async execute(message) {
        const guild = message.guild;
        const canalTicket = await guild.channels.create({
            name: `ticket-${message.author.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: message.author.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
            ]
        });
        const aviso = new EmbedBuilder().setColor('#00b0f4').setDescription(`✅ Tu ticket ha sido creado en ${canalTicket}`);
        message.reply({ embeds: [aviso] });

        const bienvenida = new EmbedBuilder().setColor('#00b0f4').setDescription(`👋 Hola ${message.author}, un administrador te atenderá pronto.\nUsa \`dex closeticket\` para cerrar este canal.`);
        canalTicket.send({ embeds: [bienvenida] });
    }
};