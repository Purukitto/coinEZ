const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'trending',
    description: 'Top-3 trending coins on CoinGecko as searched by users in the last 24 hours!',
    aliases: ['trend', 't'],
    async execute(bot, message, args) {

        reqURL = process.env.BASEURL + '/search/trending';

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results.coins) {
            const trendEmbed = new Discord.MessageEmbed()
                .setColor('#ff6666')
                .setTitle('👑 Trending Coins (24h)')
                .addField("🥇 " + results.coins[0].item.name + ' (' + results.coins[0].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[0].item.id})\`\`\`\nMarket Cap Rank : ${results.coins[0].item.market_cap_rank}\`\`\``)
                .addField("🥈 " + results.coins[1].item.name + ' (' + results.coins[1].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[1].item.id})\`\`\`\nMarket Cap Rank : ${ results.coins[1].item.market_cap_rank}\`\`\``)
                .addField("🥉 " + results.coins[2].item.name + ' (' + results.coins[2].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[2].item.id})\`\`\`\nMarket Cap Rank : ${ results.coins[2].item.market_cap_rank}\`\`\``)
                .setFooter('Data provided by CoinGecko', process.env.GECKOEMO)
                .setTimestamp();
            message.channel.send(trendEmbed);
        } else {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #4', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('API response invalid')
                .setDescription('No data was returned, please try again later!')
                .setTimestamp();

            return message.reply(reply);
        }
    },
};