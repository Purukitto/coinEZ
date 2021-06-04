// TODO : Implement upgrades

const Discord = require('discord.js');
const { getClient } = require("../../database");

module.exports = {
    name: 'mine',
    aliases: ['m'],
    cooldown: 60 * 60 * 6,
    description: 'Mine and earn ⓩ based on your current hardware!',
    async execute(bot, message) {

        const dbclient = await getClient();
        const minedZ = Number((Math.random() * (50 - 25) + 25).toFixed(4));
        const rminedZ = Math.ceil(minedZ);

        const result = await dbclient.db().collection("userData").findOneAndUpdate({ id: message.author.id }, { $inc: { bal: minedZ, bank: 0 } }, { upsert: true, returnDocument: 'after' });
        if (result.ok) {
            const mresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'mint' }, { $inc: { bal: rminedZ } });
            if (!mresult.ok) return;
            const dresult = await dbclient.db().collection("economyData").findOneAndUpdate({ id: 'dust' }, { $inc: { bal: rminedZ - minedZ } });
            if (!dresult.ok) return;

            const balance = new Discord.MessageEmbed()
                .setTitle(`🖥️ Mining completed!`)
                .setColor('#77dd77')
                .setDescription(`Yay! You mined \`${minedZ}\` <:ezgold:848597364322074625>\n\nYour updated balance is:\n<:ezgold:848597364322074625> \`${result.value.bal}\``);
            message.channel.send(balance);
        }
    },
};