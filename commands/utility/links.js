const Discord = require('discord.js');

module.exports = {
    name: 'links',
    aliases: ['link', 'social'],
    description: 'See the important links related to the bot!',
    async execute(bot, message) {
        const links = new Discord.MessageEmbed()
            .setTitle('Import Links 🔗')
            .setThumbnail(bot.user.avatarURL())
            .setDescription('[📍 Website](https://purukitto.github.io/coinEZ/)\n[📍 Invite](https://discord.com/oauth2/authorize?client_id=846743549219045376&permissions=314432&scope=bot)\n[📍 GitHub Repo](https://github.com/Purukitto/coinEZ)\n[📍 Support Server](https://discord.gg/tJQeGGbNCx)\n[📍 GitHub Discussions](https://github.com/Purukitto/coinEZ/discussions)');
        message.channel.send(links);
    },
};