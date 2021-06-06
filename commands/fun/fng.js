const fetch = require('node-fetch');
const Discord = require('discord.js');
const { CanvasRenderService } = require('chartjs-node-canvas');

// Globals
const width = 600;
const height = 400;

module.exports = {
    name: 'fearngreed',
    description: 'Check the current fear and greed index and info for the last month!',
    aliases: ['fear', 'gread', 'fng'],
    async execute(bot, message) {

        reqURL = process.env.FNGAPI;
        const results = await fetch(reqURL)
            .then(response => response.json());

        if (results.data) {
            fngindex = results.data[0].value;

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

            if (fngindex < 15) {
                gicon = '😱';
                gintent = 'Extreme fear';
            } else if (fngindex < 40) {
                gicon = '😨';
                gintent = 'Fear';
            } else if (fngindex < 60) {
                gicon = '😐';
                gintent = 'Neutral';
            } else if (fngindex < 85) {
                gicon = '🤩';
                gintent = 'Greed';
            } else {
                gicon = '😍';
                gintent = 'Extreme greed';
            }

            const showBar = () => {
                const progress = (fngindex / 100);
                progressOutOf10 = Math.round(progress * 15);
                const barStr = `${'<:blank:847786493003169793>'.repeat(progressOutOf10)}**${fngindex}%**\n<:scap:847780808198455306>${'<:gload:847780808332017684>'.repeat(progressOutOf10)}${'<:rload:847780808210776104>'.repeat(15 - progressOutOf10)}` + '<:ecap:847780808302395412>\nFear' + `${'<:blank:847786493003169793>'.repeat(14)}Greed`;
                return barStr;
            };

            const fngEmbed = new Discord.MessageEmbed()
                .setColor('#ff6666')
                .setTitle('Current Index: ' + gintent + '  ' + gicon)
                .setAuthor('Cryptocurrency Fear and Greed Index')
                .setDescription(showBar() + `\n\`\`\`30 Day High: ${gmax}\n30 Day Low : ${gmin}\`\`\``)
                .setFooter('Data provided by Alternative.me')
                .setTimestamp();

            const data = {
                labels: glabels,
                datasets: [{
                    label: 'Cryptocurrency Fear and Greed Index',
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

            const gImage = await canvas.renderToBuffer(config);
            const attachment = new Discord.MessageAttachment(gImage, 'fng.png');


            fngEmbed.attachFiles(attachment).setImage('attachment://fng.png');

            message.channel.send(fngEmbed);
        } else {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #4', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('API response invalid')
                .setDescription('No data was returned, please try again later!')
                .setTimestamp();

            return message.reply(reply);
        }
    },
};