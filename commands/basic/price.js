const fetch = require('node-fetch');
const cryptocurrencies = require('cryptocurrencies');

module.exports = {
    name: 'price',
    description: 'Check the current price of any cryptocurrencies in any other supported currencies that you need!',
    cooldown: 5,
    aliases: ['p'],
    usage: '[Symbol] <Currency> <Time>',
    async execute(message, args) {
        if (args.length == 1) {
            symbolName = args[0];
            currency = "USD";
            time = "24h";
        }
        if (args.length == 2) {
            symbolName = args[0];
            currency = args[1];
            time = "24h";
        } else {
            symbolName = args[0];
            currency = args[1];
            time = args[2];
        }


        symbol = cryptocurrencies.symbolName;

        console.log(symbolName, symbol, currency, time)
            // reqURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${symbol}"&order=market_cap_desc&per_page=1&page=1&sparkline=false&price_change_percentage=${time}`;

        // const { list } = await fetch(reqURL)
        //     .then(response => response.json());

        // if (list) {

        //     message.channel.send(list[0].current_price);
        // }

    },
};