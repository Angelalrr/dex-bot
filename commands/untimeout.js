// commands/untimeout.js
module.exports = {
    name: 'untimeout',
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) return message.reply('Sin permisos.');
        const target = message.mentions.members.first();
        if (!target) return message.reply('Menciona a un usuario.');
        
        // Quitar el timeout se hace pasando 'null' como tiempo
        await target.timeout(null);
        message.reply(`🔊 Se le ha quitado el silencio a ${target.user.username}.`);
    }
};