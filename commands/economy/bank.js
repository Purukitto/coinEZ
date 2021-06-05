const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'bank',
    aliases: ['saving'],
    description: 'Check your bank balance!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();

        const balance = new Discord.MessageEmbed()
            .setTitle(`🏦 ${message.author.username}'s Savings Account`)
            .setColor('#FFD700')
            .setFooter('Remember EZGold is just game currency!');

        if (!result[0]) {
            doc = { id: message.author.id, bal: 0, bank: 0 }
            await dbclient.db().collection("userData").insertOne(doc, (err) => {
                if (err) throw err
            });
            balance.setDescription(`You have not desposited any amount in the bank! \n You bank balance is <:ezgold:848597364322074625> \`0\``);
        } else {
            if (!result[0].depTime) {
                deptime = 0
            } else deptime = result[0].depTime;

            bankbal = result[0].bank;
            if (bankbal === undefined) bankbal = 0;

            let dtime = message.createdTimestamp - deptime;
            dtime = dtime / 31556952000;
            bankbal = bankbal * (1 + ((5 * dtime) / 100));

            if (bankbal == 0) balance.setDescription(`You have not desposited any amount in the bank!\n Use \`ezdeposit [amount]\` to deposit desired amount or \`ezdeposit all\` to deposit everything you own!`);
            else balance.setDescription(`You have <:ezgold:848597364322074625> \`${bankbal}\` in your savings account!\n Use \`ezwithdraw [amount]\` to withdraw desired amount!`);
        }
        message.channel.send(balance);
    },
};