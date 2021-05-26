const fetch = require('node-fetch');
const Discord = require('discord.js');


module.exports = {
    name: 'invite',
    description: 'Invite the bot to your own server!',
    aliases: ['inv'],
    async execute(message, args) {
        message.reply({
            embed: {
                color: '#ff6666',
                description: '[Click here](https://discord.com/oauth2/authorize?client_id=846743549219045376&permissions=314432&scope=bot) to invite the bot to your server',
            },
        });
    },
};