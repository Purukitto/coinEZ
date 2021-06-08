const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'sweep',
    aliases: ['s'],
    description: 'Sweep up some ⓩ dust!',
    async execute(bot, message) {

        const dbclient = await getClient();

        const cdresult = await dbclient.db('user').collection("cooldowns").findOneAndUpdate({ id: message.author.id }, { $set: { sweep: message.createdTimestamp } }, { upsert: true, returnDocument: 'before' });
        if (!cdresult.value || !cdresult.value.sweep)
            sweepcd = 0;
        else sweepcd = cdresult.value.sweep;

        let dtime = message.createdTimestamp - sweepcd;
        dtime = dtime / (1000 * 60 * 60);

        if (!(dtime >= 6)) {
            ltime = 6 - dtime;
            if (ltime < 1) ltime = (ltime / 60).toFixed(1) + ' Min(s)'
            else ltime = ltime.toFixed() + ' Hour(s)';

            const reply = new Discord.MessageEmbed()
                .setColor('#ff6961')
                .setTitle('⏲️ Sweep cooldown!')
                .setDescription('Don\'t be this greedy!\n You can sweep again after `' + ltime + '`')
                .setTimestamp();

            return message.reply(reply);
        }

        const result = await dbclient.db().collection("economyData").find({ "id": 'dust' }).toArray();

        const balance = new Discord.MessageEmbed()
            .setFooter('Dust is generated from the ezfaucet command!');

        if (!result[0]) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('DB Error', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Unknown error')
                .setDescription('There was some issue with the database')
                .setFooter('Please contact the developer about this so it can be solved ASAP!')
                .setTimestamp();

            return message.reply(reply);
        }

        if (result[0].bal > 0) {
            const zperc = (Math.random() * (.7 - .3) + .3);
            const zgot = zperc * result[0].bal;

            const results = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $inc: { bal: zgot, bank: 0 } }, { upsert: true, returnDocument: 'after' });

            if (results.ok) {
                const dresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'dust' }, { $inc: { bal: -zgot } });
                if (!dresult.ok) {
                    const reply = new Discord.MessageEmbed()
                        .setAuthor('DB Error', process.env.CROSSICON)
                        .setColor('#ff6961')
                        .setTitle('Unknown error')
                        .setDescription('There was some issue with the database')
                        .setFooter('Please contact the developer about this so it can be solved ASAP!')
                        .setTimestamp();

                    return message.reply(reply);
                }
                balance.setTitle(`🧹 Sweeped up some good stuff!`)
                    .setColor('#77dd77')
                    .setDescription(`You got <:ezgold:848597364322074625> \`${zgot}\` as dust! Your updated wallet balance is <:ezgold:848597364322074625> \`${results.value.bal}\``);
            } else {
                const reply = new Discord.MessageEmbed()
                    .setAuthor('DB Error', process.env.CROSSICON)
                    .setColor('#ff6961')
                    .setTitle('Unknown error')
                    .setDescription('There was some issue with the database')
                    .setFooter('Please contact the developer about this so it can be solved ASAP!')
                    .setTimestamp();

                return message.reply(reply);
            }
        } else {
            balance.setTitle(`🧹 Nothing to sweep!`)
                .setColor('#ff6961')
                .setDescription(`Not enough dust! Try again later!`);
        }
        message.channel.send(balance);
    },
};