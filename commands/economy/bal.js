const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'balance',
    aliases: ['bal', 'b'],
    description: 'Check your ā© balance!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const result = await dbclient.db().collection("userData").find({ "id": { $eq: message.author.id } }).toArray();

        const balance = new Discord.MessageEmbed()
            .setTitle(`š³ ${message.author.username}'s Balance`)
            .setColor('#FFD700')
            .setFooter('Remember EZGold is just game currency!');

        if (!result[0]) {
            doc = { id: message.author.id, bal: 0, bank: 0, depTime: 0 }
            await dbclient.db().collection("userData").insertOne(doc, (err) => {
                if (err) throw err
            });
            balance.setDescription(`<:ezgold:848597364322074625> \`0\`\nš¦ \`0\``);
        } else {

            let dtime = message.createdTimestamp - result[0].depTime;
            dtime = dtime / 31556952000;
            bankbal = result[0].bank * (1 + ((5 * dtime) / 100));

            balance.setDescription(`<:ezgold:848597364322074625> \`${result[0].bal}\`\nš¦ \`${bankbal}\``);
        }
        message.channel.send(balance);
    },
};