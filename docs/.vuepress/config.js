module.exports = {
    // site config
    base: '/coinEZ/',
    lang: 'en-US',
    title: 'CoinEZ',
    description: 'CoinEZ is a discord bot to get cryptocurrency price, volume and market data of over 8000 publicly traded cryptocurrencies and more! Along with a full fledged global economy so that no one is bored while waiting for the coins to land on the moon! 🚀🚀',
    // theme and its config
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: 'https://i.ibb.co/QmJbGdZ/logog-01.png',
        repo: 'Purukitto/coinEZ',
        docsDir: 'docs',
        editLink: false,
        navbar: [{
                text: 'Get Started',
                link: '/get_started/',
            },
            {
                text: 'Commands',
                link: '/commands/',
            },
            // {
            //     text: 'Commands',
            //     children: [{
            //         text: 'Crypto',
            //         link: 'commands/README.md#crypto',
            //     }, {
            //         text: 'Economy',
            //         link: 'commands/README.md#economy',
            //     }, {
            //         text: 'Fun',
            //         link: 'commands/README.md#fun',
            //     }, {
            //         text: 'Utility',
            //         link: 'commands/README.md#utility',
            //     }, ]
            // },
            {
                text: 'Invite',
                link: 'https://discord.com/oauth2/authorize?client_id=846743549219045376&permissions=314432&scope=bot',
            },
            {
                text: 'Support',
                link: 'https://discord.com/invite/3VMG4X56Zh',
            }
        ]
    },
    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: `/images/icons/logo_16x16.png`,
            },
        ],
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: `/images/icons/logo_32x32.png`,
            },
        ],
        ['meta', { name: 'application-name', content: 'CoinEZ' }],
        ['meta', { name: 'msapplication-TileColor', content: '#ff6666' }],
        ['meta', { name: 'theme-color', content: '#ff6666' }],
    ],
}