const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'unafk',
    async execute(message) {
        const target = message.mentions.members.first();

        // 1. Verificamos si olvidó mencionar al usuario
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('⚠️ **Este comando está incompleto.**\n\n**Estructura:**\n`dex unafk @usuario`')] });
        }

        // 2. Verificamos si quien ejecuta el comando tiene permisos de Moderador
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('❌ No tienes permisos para usar este comando.')] });
        }

        // 3. Verificamos si ese usuario realmente está en la lista de AFK
        if (!global.afkDB || !global.afkDB[target.id]) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription(`❌ **${target.user.username}** no está en modo AFK.`)] });
        }

        // 4. Si está en la lista, sacamos sus datos
        const datosAfk = global.afkDB[target.id];

        // 5. Intentamos devolverle su nombre original (quitándole el [AFK])
        try {
            await target.setNickname(datosAfk.nombreOriginal);
        } catch (error) {
            // Ignoramos el error si el usuario tiene un rol más alto que el bot
        }

        // 6. Lo borramos de nuestra memoria temporal de AFKs
        delete global.afkDB[target.id];

        // 7. Enviamos el mensaje de éxito
        const embed = new EmbedBuilder()
            .setColor('#00b0f4')
            .setDescription(`👋 Se le ha quitado el estado AFK a **${target.user.username}** de forma manual.`);
        message.reply({ embeds: [embed] });
    }
};
