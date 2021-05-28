const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Invite the bot to your own server!',
    aliases: ['inv'],
    async execute(bot, message, args) {
        const invembed = new Discord.MessageEmbed()
            .setColor('#ff6666')
            .setAuthor(bot.user.username, bot.user.avatarURL())
            .setDescription('[Click here](https://discord.com/oauth2/authorize?client_id=846743549219045376&permissions=314432&scope=bot) to invite the bot to your server 🎉');

        message.channel.send(invembed);
    },
};