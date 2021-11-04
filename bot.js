const Discord = require('discord.js');
const fs = require('fs');

/** @namespace process.env.DISCORD_TOKEN */

class Bot {
    constructor() {
        const _this = this;

        this.Discord = Discord;
        this.fs = fs;

        this.client = new Discord.Client({disableMentions: 'everyone'});
        this.client.login('NDcyMDQ4MzgzMDc1NTQ5MTg2.W1nbUA.NK4aC5OOBXCWD7g2cDfivk4iNag');

        this.name = 'Colorful';
        this.version = '1.0.0';

        this.commands = [];

        this.colors = {
            blurple: '7289da'
        }

        /* this.creator = ['242975403512168449', '499271333033672714',
                        '340825658865221634', '868794301537206273',
                        '756850630840156236']; */

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

        this.client.on('ready', () => {

            this.footer = `${_this.name} ${this.version} <> with ❤`
            this.prefixes = ['=', `<@${this.client.user.id}>`];

            setInterval(() => _this.client.user.setActivity(`${_this.prefixes[0]}help | ${_this.client.guilds.cache.size} servers`, {type: 'PLAYING'}), 12e4);
            console.log(`${this.client.user.tag} is logged successfully.\nGuilds: ${this.client.guilds.cache.size}\nUsers: ${this.client.users.cache.size}`);


            fs.readdir('./Commands', (err, cmds) => {
                if (err) throw err;
                cmds.forEach(command => {
                    const cmd = require(`./Commands/${command}`);
                    this.commands.push({
                        name: cmd.name,
                        regex: cmd.regex,
                        args: cmd.args,
                        desc: cmd.desc,
                        example: cmd.example,
                        private: cmd.private || false,
                        hidden: cmd.hidden || false,
                        run: cmd.run
                    });
                });
            });
        });


        this.declOfNum = (number, titles) => {
            const cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20)? 2 : cases[(number % 10 < 5)? number % 10 : 5]];
        };

        this.randomElement = arr => arr[Math.ceil(Math.random() * arr.length - 1)];

        this.toMoscowTime = (time) => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-');

        this.multipleReact = async (message, arr) => {
          if (0 in arr) await message.react(arr.shift()).then(() => _this.multipleReact(message, arr).catch());
        };


        this.client.on('message', message => {
            if (message.author.bot) return;

            if (!message.guild) {
                const files = message.attachments.map(key => key.attachment)
                return _this.client.channels.cache.get(_this.channels.dm).send(`${message.author} \`[${message.author.tag}]\`: ${message.content}`, {files: files});
            }

            const msgPrefix = _this.prefixes.find(p => message.content.toLowerCase().startsWith(p));
            if (!msgPrefix) return;

            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Кажется, у меня нет прав для отправки сообщений в этот канал')

            const args = message.content.slice(msgPrefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            this.err = (desc) => message.channel.send(_this.emojis.no + ' | ' + desc)
            this.suc = (desc) => message.channel.send(_this.emojis.yes + ' | ' + desc)

            const cmd = _this.commands.find(c => command.match(new RegExp(`^${c.regex.toString().slice(1, -1)}$`)));

            if (cmd && (!cmd.private || _this.whitelist.includes(message.author.id))) {
                cmd.run(message, args);

                if (message.guild.id === '847322841258262559') return
                const embed = new _this.Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(message.content)
                .setColor(_this.colors.main)
                .setFooter(message.guild.name, message.guild.iconURL());
                _this.client.channels.cache.get(_this.channels.commands).send(embed);
            }
        });
    };
}

global.Bot = new Bot();
