const Discord = require('discord.js');
const { getClient } = require("../../database");
const fetch = require('node-fetch');

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: 'Deposit your ⓩ\'s to the CoinEZ Bank!',
    args: true,
    usage: '[amount]',
    async execute(bot, message, args) {

        const dbclient = await getClient();

        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();

        if (!result[0]) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #5', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Account not found!')
                .setDescription('Your account is not active so you can\'t deposit anything yet!\nUse `ezfaucet` `ezmine` `ezsweep` to earn some <:ezgold:848597364322074625> so you can get started!')
                .setTimestamp();

            return message.reply(reply);
        };

        let amount = Number(args[0]);

        if (isNaN(amount) && (args[0].toLowerCase() == 'all' || args[0].toLowerCase() == 'bal')) amount = result[0].bal;
        else if (isNaN(amount)) amount = -1;

        if (amount <= 0) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #6', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Invalid Input!')
                .setDescription('The amount you entered is not valid to be deposited!\nUse values greater than `0`!')
                .setTimestamp();

            return message.reply(reply);
        }
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
                console.log(err);
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
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #6', process.env.CROSSICON)
                .setColor('#ff6961')
                .setTitle('Invalid Input!')
                .setDescription('The amount you entered is greater than what your have in your wallet!\nUse values less than your balance or `ezdep all` to deposit everything at once\n Currently you have <:ezgold:848597364322074625>`' + result[0].bal + '` in your wallet!')
                .setTimestamp();

            return message.reply(reply);
        }
    }
}