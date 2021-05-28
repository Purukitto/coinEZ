const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');


module.exports = {
    name: 'info',
    description: 'Check the current price, market cap, etc. of any cryptocurrencies that you need!',
    aliases: ['coin', 'i'],
    args: true,
    usage: '[Symbol]',
    async execute(bot, message, args) {

        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        reqURL = `https://api.coingecko.com/api/v3/coins/${symbol}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results.market_data.price_change_24h >= 0) eColor = '#77dd77'
        else eColor = '#ff6961'

        const showBar = () => {
            const progress = (results.sentiment_votes_up_percentage / 100);
            progressOutOf10 = Math.round(progress * 10);
            // const x = "□";
            const barStr = `${'<:blank:847786493003169793>'.repeat(progressOutOf10)}**${results.sentiment_votes_up_percentage}%**\n<:scap:847780808198455306>${'<:gload:847780808332017684>'.repeat(progressOutOf10)}${'<:rload:847780808210776104>'.repeat(10 - progressOutOf10)}` + '<:ecap:847780808302395412>\nGood' + `${'<:blank:847786493003169793>'.repeat(9)}Bad`;
            return barStr;
            // console.log(barStr);
        };

        if (results) {
            const priceEmbed = new Discord.MessageEmbed()
                .setColor(eColor)
                .setTitle(results.name + ' (' + symbolName + ')')
                .setURL(`https://www.coingecko.com/en/coins/${symbol}`)
                .addField('Current Price', `\`\`\`USD   : $${results.market_data.current_price.usd}\nEUR   : €${results.market_data.current_price.eur}\nINR   : ₹${results.market_data.current_price.inr}\nBTC   : Ƀ${results.market_data.current_price.btc}\nETH   : Ξ${results.market_data.current_price.eth}\n\`\`\``)
                .addField('Market', `\`\`\`Market Cap Rank : ${results.market_data.market_cap_rank}\nMarket Cap      : $${results.market_data.market_cap.usd}\nVolume          : $${results.market_data.total_volume.usd}\`\`\``)
                .addField('Price Change(%)', `\`\`\`24 Hours : ${results.market_data.price_change_percentage_24h.toFixed(2)}%\n7 Days   : ${results.market_data.price_change_percentage_7d.toFixed(2)}%\n30 Days  : ${results.market_data.price_change_percentage_30d.toFixed(2)}%\n1 year   : ${results.market_data.price_change_percentage_1y.toFixed(2)}%\n\`\`\``)
                .setThumbnail(results.image.small)
                .addField('Sentiment', showBar())
                .setFooter('Data provided by CoinGecko', 'https://cdn.discordapp.com/emojis/847767121793384488.png?v=1')
                .setTimestamp();

            message.channel.send(priceEmbed);
        }
    },
};