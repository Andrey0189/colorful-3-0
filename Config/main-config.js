class Config {
    constructor() {
        const _this = this;

        this.name = 'Colorful';
        this.version = '1.0.0';

        this.colors = {
            blurple: '7289da',
            green: '77b255',
            red: 'da2f47'
        }

        this.creators = ['242975403512168449', '499271333033672714',
                        '756850630840156236'];

        this.whitelist = ['242975403512168449', '499271333033672714',
            '340825658865221634', '868794301537206273',
            '756850630840156236'];

        this.server = 'https://discord.gg/hjkHm5mxKC'

        this.channels = {
            servers: '905410629408550972',
            commands: '905410614426472468',
            dm: '905410551994253352'
        }

        this.emojis = {
            yes: '<:tickYes:847376681064464425>',
            no: '<:tickNo:847376704175603743>',
            offline: '<:offline:905584317613342781>',
            online: '<:online:905584347388715048>',
            idle: '<:idle:905584270876229662>',
            dnd: '<:dnd:905584225544208385>'
        };
    };
}

global.Config = new Config();
