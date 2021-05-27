const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');

module.exports = {
    name: 'price',
    description: 'Check the current price of any cryptocurrencies against any other supported currencies that you need!',
    aliases: ['p'],
    args: true,
    usage: '[Symbol] <Currency>',
    async execute(message, args) {

        currency = "USD";
        if (args.length > 1) currency = args[1].toUpperCase();
        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        reqURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${symbol}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (!results.length < 1) {
            const priceEmbed = new Discord.MessageEmbed()
                .setColor('#ff6666')
                .setTitle(results[0].current_price + '(' + results[0].price_change_24h.toFixed(2) + '%)')
                .setAuthor(symbolName + '/' + currency, results[0].image)
                .setDescription(`\`\`\`24h High: ${results[0].high_24h}\n24h Low : ${results[0].low_24h}\`\`\``)

            message.channel.send(priceEmbed);
        }
    },
};