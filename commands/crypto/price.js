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

        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        if (!symbol) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #2', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Symbol not supported')
                .setDescription('Your symbol input didn\'t match any supported crypto!\nThe proper usage is: `ezprice [Symbol] <Currency>`')
                .setTimestamp();

            return message.reply(reply);
        }

        currency = "USD";
        if (args.length > 1) currency = args[1].toUpperCase();

        reqURL = process.env.BASEURL + `/coins/markets?vs_currency=${currency}&ids=${symbol}&order=market_cap_desc&per_page=1&page=1&sparkline=false`;

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
            const changePerc = (results[0].price_change_percentage_24h ? '(' + results[0].price_change_percentage_24h.toFixed(2) + '%)' : '')
            const priceEmbed = new Discord.MessageEmbed()
                .setColor(gcolor)
                .setTitle(esymbol + '  ' + results[0].current_price + changePerc)
                .setAuthor(symbolName + '/' + currency, results[0].image)
                .setDescription(`\`\`\`24h High          : ${results[0].high_24h}\n24h Low           : ${results[0].low_24h}\nPrice change(24h) : ${results[0].price_change_24h}\`\`\`\n\nUse \`ezchart ${symbolName} ${currency}\` to view the graph for last 24 hours`)
                .setFooter('Data provided by CoinGecko', process.env.GECKOEMO)
                .setTimestamp();
            message.channel.send(priceEmbed);
        } else {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #3', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Currency name invalid')
                .setDescription('No data was returned, the input currency is not supported or invalid!\nThe proper usage is: `ezprice [Symbol] <Currency>`')
                .setTimestamp();

            return message.reply(reply);
        }
    },
};