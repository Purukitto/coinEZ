const Discord = require('discord.js');

module.exports = {
    name: 'links',
    aliases: ['link', 'social'],
    description: 'See the important links related to the bot',
    async execute(bot, message) {
        const links = new Discord.MessageEmbed()
            .setTitle('Import Links 🔗')
            .setDescription('[📍 Invite](https://discord.com/oauth2/authorize?client_id=846743549219045376&permissions=314432&scope=bot)\n[📍 GitHub Repo](https://github.com/Purukitto/coinEZ)\n[📍 Support Server](https://discord.com/invite/3VMG4X56Zh)');
        message.channel.send(links);
    },
};