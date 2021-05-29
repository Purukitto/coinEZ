const fs = require('fs');
const Discord = require('discord.js');
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('ready', () => {
    client.user.setActivity('Crypto 🚀🌕', {
        type: 'WATCHING',
    });
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        const reply = new Discord.MessageEmbed()
            .setAuthor('Error #0', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
            .setColor('#ff6961')
            .setTitle('Invalid channel')
            .setDescription('I can\'t execute that command inside DMs!')
            .setTimestamp();

        return message.reply(reply);
    }

    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            const reply = new Discord.MessageEmbed()
                .setAuthor('Error #0', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
                .setColor('#ff6961')
                .setTitle('Permission missing')
                .setDescription('You don\'t have permisson to use this command!')
                .setTimestamp();

            return message.reply(reply);
        }
    }

    if (command.args && !args.length) {
        const reply = new Discord.MessageEmbed()
            .setAuthor('Error #1', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
            .setColor('#ff6961')
            .setTitle('Incorrect Arguments')
            .setTimestamp();

        if (command.usage) {
            reply.setDescription(`You didn\'t provide any arguments\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
        } else reply.setDescription('You didn\'t provide any arguments');

        return message.reply(reply);
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        const reply = new Discord.MessageEmbed()
            .setAuthor('Error #X', 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png')
            .setColor('#ff6961')
            .setTitle('Unknown error')
            .setDescription('Failed to execute command!' + error)
            .setTimestamp();

        return message.reply(reply);
    }
});

client.login(token);