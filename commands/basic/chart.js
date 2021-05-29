const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');
const { CanvasRenderService } = require('chartjs-node-canvas');
const Canvas = require('canvas');

// Globals
const width = 600;
const height = 400;

module.exports = {
    name: 'chart',
    description: 'View the price chart of any cryptocurrencies that you need!',
    aliases: ['cx', 'c'],
    args: true,
    usage: '[Symbol] <Currency>',
    async execute(bot, message, args) {

        symbolName = args[0].toUpperCase();
        symbol = cryptocurrencies[symbolName.toLowerCase()];
        currency = "USD";
        if (args.length > 1) currency = args[1].toUpperCase();

        reqURL = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=${currency}&days=1`;
        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results) {

            glabels = []
            gprices = []
            gmax = 0;
            gmin = Number.MAX_VALUE;

            for (x in results.prices) {
                glabels.push(results.prices[x][0]);
                tprice = results.prices[x][1];
                gprices.push(tprice);
                if (tprice > gmax) gmax = tprice;
                else if (tprice < gmin) gmin = tprice;
            }

            gprice = results.prices[results.prices.length - 1][1]

            for (x in glabels) {
                unixTime = glabels[x];
                var date = new Date(unixTime * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                glabels[x] = hours + ':' + minutes.substr(-2);
            }

            const data = {
                labels: glabels,
                datasets: [{
                    label: `${symbolName} price vs ${currency} in last 24 hours`,
                    data: gprices,
                    borderColor: '#77dd77',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    showLine: true,
                    steppedLine: true
                }]

            };

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

            const canvas = new CanvasRenderService(width, height, chartCallback);

            const config = {
                type: 'line',
                data: data,
                options: {
                    responsive: false,
                    plugins: {}
                },
            };

            const gImageSRC = await canvas.renderToDataURL(config);
            const gImage = await Canvas.loadImage(gImageSRC);

            const fCanvas = Canvas.createCanvas(width, height + 60);
            const fContext = fCanvas.getContext('2d');
            fContext.drawImage(gImage, 0, 60, fCanvas.width, fCanvas.height);

            fContext.fillStyle = "#161a25";
            fContext.fillRect(0, 0, width, 60);

            const zimg = await Canvas.loadImage('https://i.ibb.co/3F1MT0N/logog-03.png');
            fContext.drawImage(zimg, 50, 415, 115.49, 31.5);

            fContext.font = 'bold 15px arial';

            if ((gprice) - (results.prices[results.prices.length - 2][1]) >= 0) {
                gbcolor = '#77dd77';
                gbsymbol = '📈'
            } else {
                gbcolor = '#ff6961';
                gbsymbol = '📉';
            }
            fContext.fillStyle = gbcolor;
            fContext.fillText(`${gbsymbol} ${symbolName}/${currency} | 1 Day`, 10, 20);

            fContext.font = 'bold 12px arial';
            fContext.fillText(`Price: ${gprice.toFixed(4)}     High: ${gmax.toFixed(4)}     Low: ${gmin.toFixed(4)}`, 10, 40);

            const attachment = new Discord.MessageAttachment(fCanvas.toBuffer(), `${symbolName}_${currency}.png`);
            message.channel.send(attachment)
        }
    },
};