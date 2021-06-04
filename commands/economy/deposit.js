const Discord = require('discord.js');
const { getClient } = require("../../database");
const fetch = require('node-fetch');

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: 'Deposit your ⓩ\'s to the CoinEZ Bank!',
    usage: '[amount]',
    async execute(bot, message, args) {

        const dbclient = await getClient();

        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();
        let amount = Number(args[0]);

        if (isNaN(amount) && (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'bal')) amount = result[0].bal;
        else if (isNaN(amount)) amount = -1;

        if (amount <= 0) return console.log('Not applicable');
        if (!result[0].depTime) {
            deptime = 0
        } else deptime = result[0].depTime;

        let dtime = message.createdTimestamp - deptime;
        dtime = dtime / 31556952000;
        const bankbal = result[0].bank * (1 + ((7 * dtime) / 100));

        if (result[0].bal >= amount) {
            try {
                const upbal = amount + bankbal;
                const dustBal = bankbal - result[0].bank;
                const results = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $set: { depTime: message.createdTimestamp, bank: upbal }, $inc: { bal: -amount } }, { returnDocument: 'after' });
                if (results.ok) {
                    await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'bank' }, { $inc: { bal: -dustBal } });

                    const balance = new Discord.MessageEmbed()
                        .setTitle(`💸 Money deposited successfully!`)
                        .setColor('#77dd77')
                        .setDescription(`Yay! You deposited \`${amount}\` <:ezgold:848597364322074625> in the bank! You now have <:ezgold:848597364322074625> \`${results.value.bank}\` in your bank account!\n\nYour updated wallet balance is <:ezgold:848597364322074625> \`${results.value.bal}\``);
                    message.channel.send(balance);
                }
            } catch (err) {
                console.log(err)
            }
        } else { console.log('not enough balance!') }
    }
}