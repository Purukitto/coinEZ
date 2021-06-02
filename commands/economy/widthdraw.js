const Discord = require('discord.js');
const { getClient } = require("../../database");
const fetch = require('node-fetch');

module.exports = {
    name: 'withdraw',
    aliases: ['wit'],
    description: 'Withdraw your ⓩ\'s to the CoinEZ Bank!',
    async execute(bot, message, args) {

        const dbclient = await getClient();

        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();

        if (!result[0].depTime) {
            deptime = 0
        } else deptime = result[0].depTime;
        let dtime = message.createdTimestamp - deptime;
        dtime = dtime / 31556952000;
        const bankbal = result[0].bank * (1 + ((5 * dtime) / 100));

        let amount = Number(args[0]);
        if (isNaN(amount) && (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'bal')) amount = bankbal;
        else if (isNaN(amount)) amount = -1;
        if (amount <= 0) return console.log('Not applicable');

        if (bankbal >= amount) {
            try {
                const upbal = bankbal - amount;
                const dustBal = bankbal - result[0].bank;
                const results = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $set: { depTime: message.createdTimestamp, bank: upbal }, $inc: { bal: amount } }, { returnDocument: 'after' });
                if (results.ok) {
                    await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'bank' }, { $inc: { bal: -dustBal } });

                    const balance = new Discord.MessageEmbed()
                        .setTitle(`💸 Money withdrawn successfully!`)
                        .setColor('#ff6961')
                        .setDescription(`Yay! You withdrawn \`${amount}\` <:ezgold:848597364322074625> from the bank! You now have <:ezgold:848597364322074625> \`${results.value.bank}\` left in your bank account!\n\nYour updated wallet balance is <:ezgold:848597364322074625> \`${results.value.bal}\``);
                    message.channel.send(balance);
                }
            } catch (err) {
                console.log(err)
            }
        } else { console.log('Not enough balance!') }
    }
}