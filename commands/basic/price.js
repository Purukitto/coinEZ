const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');

module.exports = {
    name: 'price',
    description: 'Check the current price and 24h changes of any cryptocurrencies against any other supported currencies that you need!',
    aliases: ['p'],
    args: true,
    usage: '[Symbol] <Currency>',
    async execute(bot, message, args) {

        currency = "USD";
        if (args.length > 1) currency = args[1].toUpperCase();
        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        reqURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${symbol}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results[0].price_change_percentage_24h >= 0) {
            esymbol = '📈';
            gcolor = '#77dd77';
        } else {
            esymbol = '📉';
            gcolor = '#ff6961';
        }

        if (!results.length < 1) {
            const priceEmbed = new Discord.MessageEmbed()
                .setColor(gcolor)
                .setTitle(esymbol + '  ' + results[0].current_price + '(' + results[0].price_change_percentage_24h.toFixed(2) + '%)')
                .setAuthor(symbolName + '/' + currency, results[0].image)
                .setDescription(`\`\`\`24h High          : ${results[0].high_24h}\n24h Low           : ${results[0].low_24h}\nPrice change(24h) : ${results[0].price_change_24h}\`\`\`\n\nUse \`ezchart ${symbolName} ${currency}\` to view the graph for last 24 hours`)
                .setFooter('Data provided by CoinGecko', 'https://cdn.discordapp.com/emojis/847767121793384488.png?v=1')
                .setTimestamp();
            message.channel.send(priceEmbed);
        }
    },
};