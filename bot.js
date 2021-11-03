const Discord = require('discord.js');
const fs = require('fs');

/** @namespace process.env.DISCORD_TOKEN */

class Bot {
    constructor() {
        let _this = this;

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

        this.creator = '242975403512168449'

        this.whitelist = [this.creator];

        this.server = 'https://discord.gg/hjkHm5mxKC'

        this.channels = {
            servers: '905410629408550972',
            commands: '905410614426472468',
            dm: '905410551994253352'
        }

        _this.client.on('ready', () => {

            this.footer = `<> with ❤ by ANDREY#2623`
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


        _this.client.on('message', message => {
            if (message.author.bot) return;

            if (!message.guild) {
                const files = message.attachments.map(key => key.attachment)
                return _this.client.channels.cache.get(_this.channels.dm).send(`${message.author} \`[${message.author.tag}]\`: ${message.content}`, {files: files});
            };

            const msgPrefix = _this.prefixes.find(p => message.content.toLowerCase().startsWith(p));
            if (!msgPrefix) return;

            if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.author.send('Кажется, у меня нет прав для отправки сообщений в этот канал')

            const args = message.content.slice(msgPrefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // this.err = (desc) => message.channel.send(this.emojis.no + ' | ' + desc)
            // this.suc = (desc) => message.channel.send(this.emojis.yes + ' | ' + desc)

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
            };
        });
    };
};

global.Bot = new Bot();
