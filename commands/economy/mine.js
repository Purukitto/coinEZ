// TODO : Implement upgrades

const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'mine',
    aliases: ['m'],
    description: 'Mine and earn ⓩ based on your current hardware!',
    async execute(bot, message) {
        const dbclient = await getClient();
        const minedZ = Number((Math.random() * (50 - 25) + 25).toFixed(4));
        const rminedZ = Math.ceil(minedZ);

        const cdresult = await dbclient.db('user').collection("cooldowns").findOneAndUpdate({ id: message.author.id }, { $set: { mine: message.createdTimestamp } }, { upsert: true, returnDocument: 'before' });
        if (!cdresult.value || !cdresult.value.mine)
            minecd = 0;
        else minecd = cdresult.value.mine;

        let dtime = message.createdTimestamp - minecd;
        dtime = dtime / (1000 * 60 * 60);

        if (!(dtime >= 6)) {

            ltime = 6 - dtime;
            if (ltime < 1) ltime = (ltime / 60).toFixed(1) + ' Min(s)'
            else ltime = ltime.toFixed() + ' Hour(s)';

            const reply = new Discord.MessageEmbed()
                .setColor('#ff6961')
                .setTitle('⏲️ Mining cooldown!')
                .setDescription('Your setup is currently busy mining!\n You can mine again after `' + ltime + '`')
                .setTimestamp();

            return message.reply(reply);
        }

        const result = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $inc: { bal: minedZ, bank: 0 } }, { upsert: true, returnDocument: 'after' });
        if (result.ok) {
            const mresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'mint' }, { $inc: { bal: rminedZ } });
            if (!mresult.ok) {
                const reply = new Discord.MessageEmbed()
                    .setAuthor('DB Error', process.env.CROSSICON)
                    .setColor('#ff6961')
                    .setTitle('Unknown error')
                    .setDescription('There was some issue with the database')
                    .setFooter('Please contact the developer about this so it can be solved ASAP!')
                    .setTimestamp();

                return message.reply(reply);
            }
            const dresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'dust' }, { $inc: { bal: rminedZ - minedZ } });
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

            const balance = new Discord.MessageEmbed()
                .setTitle(`🖥️ Mining completed!`)
                .setColor('#77dd77')
                .setDescription(`Yay! You mined \`${minedZ}\` <:ezgold:848597364322074625>\n\nYour updated balance is:\n<:ezgold:848597364322074625> \`${result.value.bal}\``);
            message.channel.send(balance);
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
    },
};