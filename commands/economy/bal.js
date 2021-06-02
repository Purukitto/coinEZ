const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'bal',
    aliases: ['balance', 'b'],
    description: 'Check your ⓩ balance!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();

        const balance = new Discord.MessageEmbed()
            .setTitle(`💳 ${message.author.username}'s Balance`)
            .setColor('#FFD700')
            .setFooter('Remember EZGold is just game currency!');

        if (!result[0]) {
            doc = { id: message.author.id, bal: 0, bank: 0 }
            await dbclient.db().collection("userData").insertOne(doc, (err) => {
                if (err) throw err
            });
            balance.setDescription(`<:ezgold:848597364322074625> \`0\`\n🏦 \`0\``);
        } else {
            if (!result[0].depTime) {
                deptime = 0
            } else deptime = result[0].depTime;

            bankbal = result[0].bank;
            if (bankbal === undefined) bankbal = 0;

            let dtime = message.createdTimestamp - deptime;
            dtime = dtime / 31556952000;
            bankbal = bankbal * (1 + ((7 * dtime) / 100));

            balance.setDescription(`<:ezgold:848597364322074625> \`${result[0].bal}\`\n🏦 \`${bankbal}\``);
        }
        message.channel.send(balance);
    },
};