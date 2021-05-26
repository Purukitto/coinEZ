const fetch = require('node-fetch');
const Discord = require('discord.js');


module.exports = {
    name: 'botinfo',
    description: 'Check bot information!',
    aliases: ['bot'],
    async execute(message, args) {
        let bicon = bot.user.displayAvatarURL();
        let botembed = new Discord.MessageEmbed()
            .setTitle("Bot Information")
            .setColor("#00FFFF")
            .setThumbnail(bicon)
            .setDescription('Developed by purukitto#0001\n```Data provided by CoinGecko```')
            .addField("Bot Name", bot.user.username)
            .addField("Created on", bot.user.createdAt);
        return message.channel.send(botembed);
    },
};