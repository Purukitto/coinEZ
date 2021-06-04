const Discord = require('discord.js');

module.exports = {
        name: 'help',
        description: 'List all of the available commands or get info about a specific command!',
        aliases: ['commands'],
        usage: '<Command Name>',
        cooldown: 2,
        async execute(bot, message, args) {
            const data = new Discord.MessageEmbed()
                .setAuthor('CoinEZ Help', bot.user.avatarURL())
                .setThumbnail('https://i.ibb.co/DC3bfDz/helpicon.png');
            const { commands } = message.client;

            if (!args.length) {
                data.setDescription('Here\'s a list of all my commands:\n`' + commands.map(command => command.name).join('`, `') + '`\n\n\nYou can send \`ezhelp [command name]\` to get info on a specific command!').setTimestamp();

                return message.author.send(data)
                    .then(() => {
                        if (message.channel.type === 'dm') return;
                        message.reply('I\'ve sent you a DM with all my commands!');
                    })
                    .catch(error => {
                        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                        message.reply('It seems like I can\'t DM you!');
                    });
            }

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('That\'s not a valid command!');
            }

            data.setTitle('EZ' + command.name);

            descdata = [];

            if (command.aliases) descdata.push(`**Aliases:** \`${command.aliases.join('`, `')}\``);
        if (command.description) descdata.push(`**Description:** ${command.description}`);
        if (command.usage) descdata.push(`**Usage:** \`ez${command.name} ${command.usage}\``);
        if (command.cooldown) descdata.push(`**Cooldown:** ${command.cooldown} second(s)`);

        data.setDescription(descdata).setTimestamp();

        message.channel.send(data);
    },
};