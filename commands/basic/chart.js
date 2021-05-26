const fetch = require('node-fetch');
const cryptocurrencies = require('cryptocurrencies');
const Discord = require('discord.js');
const Canvas = require('canvas');
var Chart = require('chart.js');

module.exports = {
    name: 'chart',
    description: 'View the price chart any cryptocurrencies that you need!',
    aliases: ['cx'],
    args: true,
    usage: '[Symbol] <Time>',
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

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        if (results) {
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
            channel.send(`Welcome to the server, ${member}!`, attachment);
            // const priceEmbed = new Discord.MessageEmbed()
            //     .setColor(eColor)
            //     .setTitle(results.name + ' (' + symbolName + ')')
            //     .setURL(`https://www.coingecko.com/en/coins/${symbol}`)
            //     // .setAuthor(symbolName + '/' + currency, results[0].image)
            //     .addField('Current Price', `\`\`\`USD   : $${results.market_data.current_price.usd}\nEUR   : €${results.market_data.current_price.eur}\nINR   : ₹${results.market_data.current_price.inr}\nBTC   : Ƀ${results.market_data.current_price.btc}\nETH   : Ξ${results.market_data.current_price.eth}\n\`\`\``)
            //     .addField('Market', `\`\`\`Market Cap      : $${results.market_data.market_cap.usd}\nMarket Cap Rank : $${results.market_data.market_cap_rank}\nVolume          : $${results.market_data.total_volume.usd}\`\`\``)
            //     .addField('Price Change(%)', `\`\`\`24 Hours : ${results.market_data.price_change_percentage_24h.toFixed(2)}%\n7 Days   : ${results.market_data.price_change_percentage_7d.toFixed(2)}%\n30 Days  : ${results.market_data.price_change_percentage_30d.toFixed(2)}%\n1 year   : ${results.market_data.price_change_percentage_1y.toFixed(2)}%\n\`\`\``)
            //     .setThumbnail(results.image.small)

            // message.channel.send(priceEmbed);
        }
    },
};