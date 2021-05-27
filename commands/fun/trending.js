const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'trending',
    description: 'Top-3 trending coins on CoinGecko as searched by users in the last 24 hours!',
    aliases: ['trend', 't'],
    async execute(message, args) {

        reqURL = 'https://api.coingecko.com/api/v3/search/trending';

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results) {
            const priceEmbed = new Discord.MessageEmbed()
                .setColor('#ff6666')
                .setTitle('Trending Coins(24h)')
                .addField("🥇 " + results.coins[0].item.name + ' (' + results.coins[0].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[0].item.id})\`\`\`Market Cap Rank : ${results.coins[0].item.market_cap_rank}\`\`\``)
                .addField("🥈 " + results.coins[1].item.name + ' (' + results.coins[1].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[1].item.id})\`\`\`Market Cap Rank : ${ results.coins[1].item.market_cap_rank}\`\`\``)
                .addField("🥉 " + results.coins[2].item.name + ' (' + results.coins[2].item.symbol + ')', `[CoinGecko Page](https://www.coingecko.com/en/coins/${results.coins[2].item.id})\`\`\`Market Cap Rank : ${ results.coins[2].item.market_cap_rank}\`\`\``)

            message.channel.send(priceEmbed);
        }
    },
};