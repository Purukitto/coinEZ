const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');

module.exports = {
    name: 'quickprice',
    description: 'Quickly check the current price of any cryptocurrencies against any other supported currencies that you need!',
    aliases: ['qp', 'quick', 'q'],
    args: true,
    usage: '[Symbol] <Currency>',
    async execute(bot, message, args) {

        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        if (!symbol) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #2', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Symbol not supported')
                .setDescription('Your symbol input didn\'t match any supported crypto!\nThe proper usage is: `ezquickprice [Symbol] <Currency>`')
                .setTimestamp();

            return message.reply(reply);
        }

        currency = "USD";
        if (args.length > 1) currency = args[1].toUpperCase();

        reqURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${symbol}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (!results.length < 1) {
            if (results[0].price_change_percentage_24h >= 0) {
                esymbol = '📈';
                gcolor = '#77dd77';
            } else {
                esymbol = '📉';
                gcolor = '#ff6961';
            }

            const priceEmbed = new Discord.MessageEmbed()
                .setColor(gcolor)
                .setTitle(esymbol + '  ' + results[0].current_price + '(' + results[0].price_change_percentage_24h.toFixed(2) + '%)')
                .setAuthor(symbolName + '/' + currency, results[0].image);
            message.channel.send(priceEmbed);
        } else {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #3', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Currency name invalid')
                .setDescription('No data was returned, the input currency is not supported or invalid!\nThe proper usage is: `ezquickprice [Symbol] <Currency>`')
                .setTimestamp();

            return message.reply(reply);
        }
    },
};