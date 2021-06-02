const Discord = require('discord.js');
const { getClient } = require("../../database");
const fetch = require('node-fetch');

module.exports = {
    name: 'market',
    aliases: ['m'],
    description: 'Check the status of the ⓩ market!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const result = await dbclient.db().collection("economyData").find({ "id": { $in: ['mint', 'dust', 'bank'] } }).toArray();

        reqURL = process.env.MREQURL;
        const results = await fetch(reqURL)
            .then(response => response.json());

        if (result[0] && results[0]) {
            const balance = new Discord.MessageEmbed()
                .setTitle(`🪙 CoinEZ Market Stats`)
                .setColor('#FFD700')
                .setFooter('Remember EZGold is just game currency!')
                .setThumbnail('https://cdn.discordapp.com/emojis/847767121613815818.png?v=1')
                .addField('💸 Current Market', `\`\`\`USD                : $${results[0].current_price}\nMarket Cap         : $${result[0].bal * results[0].current_price}\`\`\``)
                .addField('🛒 Volume Distribution', `\`\`\`Total volume       : ${result[0].bal}\nContract Holdings  : ${result[1].bal}\nUser Holdings      : ${result[0].bal - result[1].bal -result[2].bal}\nDust               : ${result[2].bal}\`\`\``)
                .addField('💹 Price Change(%)', `\`\`\`24 Hours           : ${results[0].price_change_percentage_24h.toFixed(2)}%\`\`\``);
            // .setDescription(`Price: $\`${result[0].bal}\``);
            message.channel.send(balance);
        }
    },
};