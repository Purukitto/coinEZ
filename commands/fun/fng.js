const fetch = require('node-fetch');
const Discord = require('discord.js');
const cryptocurrencies = require('../../cryptocurrencies.json');
const { CanvasRenderService } = require('chartjs-node-canvas');
const Canvas = require('canvas');

// Globals
const width = 600;
const height = 400;

module.exports = {
    name: 'fng',
    description: 'View the price chart of any cryptocurrencies that you need!',
    aliases: ['fear', 'gread'],
    usage: ['<chart/c>'],
    async execute(message, args) {

        reqURL = `https://api.alternative.me/fng/?limit=30&date_format=world`;
        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results) {

            gprice = results.data[0].value;

            glabels = []
            gvalues = []
            gmax = 0;
            gmin = Number.MAX_VALUE;

            for (x in results.data) {
                tlables = results.data[results.data.length - x - 1].timestamp.toString().split('-');
                glabels.push(tlables[0] + '/' + tlables[1]);
                tvalue = results.data[results.data.length - x - 1].value;
                gvalues.push(tvalue);
                if (tvalue > gmax) gmax = tvalue;
                else if (tvalue < gmin) gmin = tvalue;
            }

            if (gprice < 10) {
                gicon = '😨';
                gintent = 'Extremely fearful | Not likely to invest';
            } else if (gprice < 40) {
                gicon = '😨';
                gintent = 'Fearful | Less likely to invest';
            } else if (gprice < 60) {
                gicon = '😐';
                gintent = 'Neutral | Might invest';
            } else if (gprice < 90) {
                gicon = '😍';
                gintent = 'Greedy | More likely to invest';
            } else {
                gicon = '😍';
                gintent = 'Extremely greedy | Highly likely to invest';
            }

            if (args.length < 1) {
                const priceEmbed = new Discord.MessageEmbed()
                    .setColor('#ff6666')
                    .setTitle(gicon + ' | Current Index: ' + gprice)
                    .setAuthor('Fear and Greed Index')
                    .setDescription(`${gintent}\`\`\`30 Day High: ${gmax}\n30 Day Low : ${gmin}\`\`\``)
                    .setFooter('Data provided by Alternative.me');
                return message.channel.send(priceEmbed);
            }
            const data = {
                labels: glabels,
                datasets: [{
                    label: 'Price',
                    data: gvalues,
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

            const fCanvas = Canvas.createCanvas(width, height);
            const fContext = fCanvas.getContext('2d');
            fContext.drawImage(gImage, 0, 0, fCanvas.width, fCanvas.height);

            fContext.fillStyle = "#161a25";
            fContext.fillRect(0, 0, width, 60);

            const zimg = await Canvas.loadImage('https://i.ibb.co/QmJbGdZ/logog-01.png');
            fContext.drawImage(zimg, 40, 315, 35, 35);

            fContext.font = 'bold 15px arial';

            if ((gprice) - (results.data[1].value) >= 0) { gbcolor = '#77dd77' } else gbcolor = '#ff6961'
            fContext.fillStyle = gbcolor;
            fContext.fillText(`Fear and Greed Index (${gintent})`, 10, 20);

            fContext.font = 'bold 12px arial';
            fContext.fillText(`Current: ${gprice}     High: ${gmax}     Low: ${gmin}`, 10, 40);

            const attachment = new Discord.MessageAttachment(fCanvas.toBuffer(), 'welcome-image.png');
            message.channel.send(attachment)
        }
    },
};