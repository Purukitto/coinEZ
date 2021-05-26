const fetch = require('node-fetch');
const cryptocurrencies = require('cryptocurrencies');
const Discord = require('discord.js');


module.exports = {
    name: 'info',
    description: 'Check the current price, market cap, etc. of any cryptocurrencies that you need!',
    aliases: ['coin', 'info', 'i'],
    args: true,
    usage: '[Symbol]',
    async execute(message, args) {
        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName].toLowerCase().replace(/\s/g, '-');
        if (symbol == 'binance-coin') symbol = 'binancecoin';

        reqURL = `https://api.coingecko.com/api/v3/coins/${symbol}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results.market_data.price_change_24h >= 0) eColor = '#77dd77'
        else eColor = '#ff6961'

        if (symbol == 'binancecoin') symbol = 'binance-coin';

        if (results) {
            const priceEmbed = new Discord.MessageEmbed()
                .setColor(eColor)
                .setTitle(results.name + ' (' + symbolName + ')')
                .setURL(`https://www.coingecko.com/en/coins/${symbol}`)
                // .setAuthor(symbolName + '/' + currency, results[0].image)
                .addField('Current Price', `\`\`\`USD   : $${results.market_data.current_price.usd}\nEUR   : €${results.market_data.current_price.eur}\nINR   : ₹${results.market_data.current_price.inr}\nBTC   : Ƀ${results.market_data.current_price.btc}\nETH   : Ξ${results.market_data.current_price.eth}\n\`\`\``)
                .addField('Market', `\`\`\`Market Cap      : $${results.market_data.market_cap.usd}\nMarket Cap Rank : $${results.market_data.market_cap_rank}\nVolume          : $${results.market_data.total_volume.usd}\`\`\``)
                .addField('Price Change(%)', `\`\`\`24 Hours : ${results.market_data.price_change_percentage_24h.toFixed(2)}%\n7 Days   : ${results.market_data.price_change_percentage_7d.toFixed(2)}%\n30 Days  : ${results.market_data.price_change_percentage_30d.toFixed(2)}%\n1 year   : ${results.market_data.price_change_percentage_1y.toFixed(2)}%\n\`\`\``)
                .setThumbnail(results.image.small)

            message.channel.send(priceEmbed);
        }
    },
};