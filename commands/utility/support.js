const Discord = require('discord.js');

module.exports = {
    name: 'support',
    description: 'Join the support server!',
    aliases: ['report', 'bug'],
    async execute(bot, message, args) {
        const invembed = new Discord.MessageEmbed()
            .setColor('#ff6666')
            .setAuthor(bot.user.username, bot.user.avatarURL())
            .setTitle('Need help with something?')
            .setDescription('[Click here](https://discord.gg/tJQeGGbNCx) to join the support server!\nPlease report any bugs you find, give any suggestions you have or just have fun with the community!');

        message.channel.send(invembed);
    },
};