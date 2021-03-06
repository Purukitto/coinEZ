//TODO: Implement top.gg logic

const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'faucet',
    aliases: ['f'],
    cooldown: 60 * 60 * 12,
    // description: 'Recieve free ⓩ by voting for the bot every 12 hours!',
    description: 'Recieve free ⓩ every 12 hours!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const daily = Number((Math.random() * (10 - 3) + 3).toFixed(4));
        const rdaily = Math.ceil(daily);

        const result = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $inc: { bal: daily, bank: 0, depTime: 0 } }, { upsert: true, returnDocument: 'after' });
        if (result.ok) {
            const mresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'mint' }, { $inc: { bal: rdaily } });
            if (!mresult.ok) {
                const reply = new Discord.MessageEmbed()
                    .setAuthor('DB Error', process.env.CROSSICON)
                    .setColor('#ff6961')
                    .setTitle('Unknown error')
                    .setDescription('There was some issue with the database')
                    .setFooter('Please contact the developer about this so it can be solved ASAP!')
                    .setTimestamp();

                return message.reply(reply);
            };
            const dresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'dust' }, { $inc: { bal: rdaily - daily } });
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
                .setTitle(`💸 Faucet bonus claimed!`)
                // .setTitle(`💸 Voting bonus claimed!`)
                .setColor('#77dd77')
                .setDescription(`Yay! You got \`${daily}\` <:ezgold:848597364322074625>\n\nYour updated balance is:\n<:ezgold:848597364322074625> \`${result.value.bal}\``);
            message.channel.send(balance);
        }
    },
};