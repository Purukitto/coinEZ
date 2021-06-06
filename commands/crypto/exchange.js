const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');
const { getColorFromURL } = require('color-thief-node');
const { CanvasRenderService } = require('chartjs-node-canvas');
const width = 350;
const height = 320;
module.exports = {
    name: 'pricexchange',
    description: 'Check the current price,volume,etc for cryptocurrencies on supported exchanges (top 3 target currencies)!',
    aliases: ['px', 'x'],
    args: true,
    usage: '[Symbol] [Exchange]',
    async execute(bot, message, args) {

        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];

        if (!symbol) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #2', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Symbol not supported')
                .setDescription('Your symbol input didn\'t match any supported crypto!\nThe proper usage is: `ezchart [Symbol] [Exchange]`')
                .setTimestamp();

            return message.reply(reply);
        }

        if (!args[1]) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #1', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Exchange name missing')
                .setDescription('You didn\'t input any exchange name!\nThe proper usage is: `ezchart [Symbol] Exchange]`')
                .setTimestamp();

            return message.reply(reply);
        }
        exchange = args[1].trim();

        reqURL = `https://api.coingecko.com/api/v3/coins/${symbol}/tickers?exchange_ids=${exchange}&include_exchange_logo=true`;

        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results.tickers[0]) {
            const chartCallback = (ChartJS) => {
                ChartJS.register({
                    id: 'background_color',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = '#161a25';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                    },
                })
            }

            const dominantColor = await getColorFromURL(results.tickers[0].market.logo);

            const xEmbed = new Discord.MessageEmbed()
                .setColor(dominantColor)
                .setAuthor(symbolName + ' on ' + results.tickers[0].market.name, results.tickers[0].market.logo)
                .setFooter('Data provided by CoinGecko', 'https://cdn.discordapp.com/emojis/847767121793384488.png?v=1')
                .setTimestamp();

            glabels = [];
            gvalues = [];
            bcolor = ['#32ae85', '#add7ff', '#df4576']
            gcolor = [];

            for (x in results.tickers) {
                if (x < 3) {
                    if (results.tickers[0].trust_score == 'green')
                        esymbol = '🟢';
                    else if (results.tickers[0].trust_score == 'red')
                        esymbol = '🔴';
                    else esymbol = '🟡';

                    const tickData = results.tickers[x];

                    xEmbed.addField(esymbol + ' ' + symbolName + '/' + tickData.target, `\`\`\`Last Trade Price: ${tickData.last}\nTrade Volume: ${tickData.volume}\nBid-ask Spread: ${tickData.bid_ask_spread_percentage.toFixed(2)}%\`\`\``);

                    glabels.push(tickData.target);
                    gvalues.push(tickData.volume);
                    gcolor.push(bcolor[x]);
                }
            }

            const data = {
                labels: glabels,
                datasets: [{
                    label: 'Trade volume distribution',
                    data: gvalues,
                    backgroundColor: gcolor,
                }]
            };

            const canvas = new CanvasRenderService(width, height, chartCallback);

            const config = {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                },
            };

            const gImage = await canvas.renderToBuffer(config);
            const attachment = new Discord.MessageAttachment(gImage, 'trade_dist.png');


            xEmbed.attachFiles(attachment).setImage('attachment://trade_dist.png');

            message.channel.send(xEmbed);
        } else {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #3', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Exchange name invalid')
                .setDescription('No data was returned, the input/exchange pair  is not supported or invalid!\nThe proper usage is: `ezchart [Symbol] [Exchange]`')
                .setTimestamp();

            return message.reply(reply);
        }
    },
};