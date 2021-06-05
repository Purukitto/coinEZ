const Discord = require('discord.js');
const ms = require('pretty-ms');
const os = require('os');

module.exports = {
    name: 'stats',
    aliases: ['botinfo', 'stat'],
    description: 'Check important information about the bot!',
    async execute(bot, message) {
        const usedMemory = os.totalmem() - os.freemem(),
            totalMemory = os.totalmem();
        const getpercentage = ((usedMemory / totalMemory) * 100).toFixed(2) + '%';
        const stats = new Discord.MessageEmbed()
            .setTitle('🖥️ Bot Stats')
            .addField('❯ Bot Latency', '`' + bot.ws.ping + '  ms`', true)
            .addField('❯ Bot Uptime', '`' + ms(bot.uptime, {
                verbose: true,
                secondsDecimalDigits: 0,
            }) + '`', true)
            .addField('❯ Active Shards', '`' + bot.ws.totalShards + ' 🟢`', true)
            .addField('❯ Servers', '`' + bot.guilds.cache.array().length + '`', true)
            .addField('❯ Channels', '`' + bot.channels.cache.array().length + '`', true)
            .addField('❯ Users', '`' + bot.users.cache.array().length + '`', true)
            .addField('❯ RAM Usage', '`' + (usedMemory / Math.pow(1024, 2)).toFixed(2) + ' MB`', true)
            .addField('❯ Processor Usage', '`' + getpercentage + '`', true)
            .addField('❯ Operating System', '`' + os.platform() + os.arch() + '`', true);
        message.channel.send(stats);
    },
};