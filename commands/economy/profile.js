const Discord = require('discord.js');
const { getClient } = require("../../database");
const Canvas = require('canvas');

module.exports = {
    name: 'profile',
    aliases: ['rank'],
    description: 'Check your CoinEZ profile card!',
    async execute(bot, message) {

        const dbclient = await getClient();

        var rank = 0;


        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();
        if (!result[0]) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #5', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Account not found!')
                .setDescription('Your account is not active so you can\'t view your rank yet!\nUse `ezfaucet` `ezmine` `ezsweep` to earn some <:ezgold:848597364322074625> so you can get started!')
                .setTimestamp();

            return message.reply(reply);
        }

        const sortRes = await dbclient.db().collection("userData").find().sort({ 'bal': -1, 'bank': -1 }).toArray();
        sortRes.some(function(el) {
            rank++;
            return el.id == message.author.id;
        });

        if (!result[0].depTime) {
            deptime = 0
        } else deptime = result[0].depTime;

        bankbal = result[0].bank;
        if (bankbal === undefined) bankbal = 0;

        let dtime = message.createdTimestamp - deptime;
        dtime = dtime / 31556952000;
        bankbal = bankbal * (1 + ((5 * dtime) / 100));

        const canvas = Canvas.createCanvas(472, 300);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('https://i.ibb.co/XkXTRBy/modern-abstract-background-117739-545-1.jpg');
        const roundRad = 20;

        context.beginPath();
        context.moveTo(0 + roundRad, 0);
        context.lineTo(0 + canvas.width - roundRad, 0);
        context.quadraticCurveTo(0 + canvas.width, 0, 0 + canvas.width, 0 + roundRad);
        context.lineTo(0 + canvas.width, 0 + canvas.height - roundRad);
        context.quadraticCurveTo(0 + canvas.width, 0 + canvas.height, 0 + canvas.width - roundRad, 0 + canvas.height);
        context.lineTo(0 + roundRad, 0 + canvas.height);
        context.quadraticCurveTo(0, 0 + canvas.height, 0, 0 + canvas.height - roundRad);
        context.lineTo(0, 0 + roundRad);
        context.quadraticCurveTo(0, 0, 0 + roundRad, 0);
        context.closePath();
        context.clip();
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.fillStyle = '#ffffff';
        context.font = '13px arial black';
        context.fillText('RANK', 375, 25);
        context.font = '25px arial black';
        context.fillText(rank, 375, 50);

        context.beginPath();
        context.moveTo(canvas.width + roundRad, canvas.height);
        context.quadraticCurveTo(0 + canvas.width, 0 + canvas.height, 0 + canvas.width - roundRad, 0 + canvas.height);
        context.lineTo(0 + roundRad, canvas.height);
        context.quadraticCurveTo(0, 0 + canvas.height, 0, 0 + canvas.height - roundRad);
        context.lineTo(0, 0 + roundRad);
        context.quadraticCurveTo(0, 0, 0 + roundRad, 0);
        context.quadraticCurveTo(160, 0, 180, 120);
        context.quadraticCurveTo(195, 210, 335, 225);
        context.arc(380, 220, 45, Math.PI, 0);
        context.quadraticCurveTo(425, 265, canvas.width, 245);
        context.closePath();
        context.clip();

        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(255, 105, 97, 0.6)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const brand = await Canvas.loadImage('https://i.ibb.co/r50Kt8j/card-Asset.png');
        context.drawImage(brand, 25, 35, 254 / 2, 128 / 2);

        const chip = await Canvas.loadImage('https://i.ibb.co/x5hq8MQ/cardChip.png');
        context.drawImage(chip, 30, 110, 128 / 2, 128 / 2);

        context.fillStyle = '#ffffff';
        context.font = '22px arial black';
        context.fillText("BALANCE: " + (Number(result[0].bal) + bankbal).toFixed(2), 40, 260);
        context.font = '15px arial black';
        let aname = message.author.username;
        if (aname.length > 24) aname = aname.substring(0, 24);
        else aname = aname + '#' + message.author.discriminator;
        context.fillText(aname, 41, 277.5);

        context.beginPath();
        context.arc(380, 220, 35, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(avatar, 345, 185, 70, 70);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${message.author.username}.png`);
        message.channel.send(attachment);
    }
}