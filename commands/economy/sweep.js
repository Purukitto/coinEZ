const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'sweep',
    aliases: ['s'],
    cooldown: 60 * 60 * 12,
    description: 'Sweep up some ⓩ dust!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const result = await dbclient.db().collection("economyData").find({ "id": 'dust' }).toArray();

        const balance = new Discord.MessageEmbed()
            .setFooter('Dust is generated from the ezfaucet command!');

        if (result[0].bal > 0) {
            const zperc = (Math.random() * (.7 - .3) + .3);
            const zgot = zperc * result[0].bal;

            const results = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $inc: { bal: zgot, bank: 0 } }, { upsert: true, returnDocument: 'after' });

            if (results.ok) {
                const dresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'dust' }, { $inc: { bal: -zgot } });
                if (!dresult.ok) return;
                balance.setTitle(`🧹 Sweeped up some good stuff!`)
                    .setColor('#77dd77')
                    .setDescription(`You got <:ezgold:848597364322074625> \`${zgot}\` as dust! Your updated wallet balance is <:ezgold:848597364322074625> \`${results.value.bal}\``);
            }
        } else {
            balance.setTitle(`🧹 Nothing to sweep!`)
                .setColor('#ff6961')
                .setDescription(`Not enough dust! Try again later!`);
        }
        message.channel.send(balance);
    },
};