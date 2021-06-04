module.exports = {
    name: 'ping',
    aliases: ['pong', 'heartbeat'],
    description: 'Check the current latency of the bot!',
    async execute(bot, message) {
        const m = await message.channel.send('Ping?');
        m.edit(`🏓 Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Heartbeat is ${bot.ws.ping}ms.`);
    },
};