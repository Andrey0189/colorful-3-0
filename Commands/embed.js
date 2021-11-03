module.exports = {
    name: 'embed',
    regex: /embed/,
    args: ['<опции>'],
    desc: 'Отправить эмбед',
    example: 'embed {title: Лес}\n{desc: Лес — экологическая система, в которой главной жизненной формой являются деревья}\n{url: https://ru.wikipedia.org/wiki/Лес }\n{image: https://cdn.discordapp.com/attachments/496235143443382272/536469341525377025/1441200743_1427616465.png }\n{field: Опушка леса, value: Опушка леса — полоса перехода к смежному типу растительности}\n{color: #539b0c}\n{footer: Материалы взяты с википедии, icon: https://cdn.discordapp.com/attachments/492028897538605066/536471533720436746/Wikipedia-logo-v2.png }\n{author: Wikipedia, icon: https://cdn.discordapp.com/attachments/492028897538605066/536471533720436746/Wikipedia-logo-v2.png }\n{thumb: https://cdn.discordapp.com/attachments/492028897538605066/536472233015771136/s1200.png }',
    module: 'util',
    run: (message, args) => {
        let text = args.join(' ').replace(/\n/g, '\\n');
        let code = 'const embed = new Discord.MessageEmbed()';
        let embed = new Bot.Discord.MessageEmbed();
  
        let author = text.match(/{ ?author ?:(.*?)( ?, ?icon ?: ?(.*?)) ?}/i);
        if (author) {
            embed.setAuthor(author[1], author[3]);
            code += `\n.setAuthor('${author[1].trim()}', '${author[3]}')`;
        }
  
        let thumb = text.match(/{ ?thumb(nail)? ?: ?(.*?) ?}/i);
        if (thumb) {
            embed.setThumbnail(thumb[2]);
            code += `\n.setThumbnail('${thumb[2]}')`;
        }
  
        let title = text.match(/{ ?title ?:(.*?) ?}/im);
        if (title) {
            embed.setTitle(title[1]);
            code += `\n.setTitle('${title[1].trim()}')`;
        }
        
        let desc = text.match(/{ ?desc(ription)? ?:(.*?) ?}/i);
        if (desc) {
            embed.setDescription(desc[2].replace(/\\n/g, '\n'));
            code += `\n.setDescription('${desc[2].trim()}')`;
        }
        
        let color = text.match(/{ ?colou?r ?: ?(.*?) ?}/i);
        if (color) { 
            embed.setColor(color[1]);
            code += `\n.setColor('${color[1].trim()}')`;
        }
  
        let image = text.match(/{ ?image ?: ?(.*?) ?}/i);
        if (image) {
            embed.setImage(image[1]);
            code += `\n.setImage('${image[1]}')`;
        }
        
        let footer = text.match(/{ ?footer ?:(.*?)( ?, ?icon ?: ?(.*?))? ?}/i);
        if (footer) {
            embed.setFooter(footer[1], footer[3]);
            code += `\n.setFooter('${footer[1].trim()}', '${footer[3]}')`;
        }
  
        let url = text.match(/{ ?url ?: ?(.*?) ?}/im);
        if (url) {
            embed.setURL(url[1])
            code += `\n.setURL('${url[1]}')`;
        }
        
        let timestamp = text.match(/{ ?timestamp ?(: ?(.*?))? ?}/i);
        if (timestamp) {
            if (!timestamp[2]) embed.setTimestamp(new Date());
            else embed.setTimestamp(new Date(timestamp[2]));
            code += `\n.setTimestamp(${(timestamp[1]? timestamp[1] : null)})`;
        }
  
        let fields = text.match(/{ ?field ?:(.*?) ?, ?value ?:(.*?)( ?, ?inline)? ?}/gi);
        if (fields) {
            let fieldsCode = '';
            fields.forEach(field => {
                let fieldCode = '';
                if (field[1] && field[2]) {
                    let innerItem = field.match(/{ ?field ?:(.*?) ?, ?value ?:(.*?)( ?, ?inline)? ?}/i);
                    embed.addField(innerItem[1], innerItem[2].replace(/\\n/g, '\n'), (innerItem[3]? true : false));
                    fieldCode = `\n.addField('${innerItem[1].trim()}', '${innerItem[2].trim()}', ${(innerItem[3]? true : false)})`;
                }
                fieldsCode += fieldCode;
            });
            code += fieldsCode;
        };
  
        if (!args[0]) return message.channel.send(`Пример: \`\`\`${Bot.prefixes[0] + module.exports.example}\`\`\``);
        
        message.channel.send({embed}).catch(err => {
          const embed = new Bot.Discord.MessageEmbed()
          .setTitle('Ошибка:exclamation:')
          .setColor('ff5555')
          .setDescription(`\`\`\`js\n${err}\`\`\``)
          .setThumbnail('https://cdn.discordapp.com/emojis/412246952462254080.png?v=1');
          message.channel.send(embed);
        });
  
        if (message.guild.me.permissionsIn(message.channel).has('MANAGE_MESSAGES')) message.delete();
  
        if (message.content.length < 1970) message.author.send(`Скопировать:\n\`\`\`${message.content}\`\`\``);
        else message.author.send('Скопировать:\n```Ошибка: Ваше сообщение слишком большое```');
        code.replace(/`/g, '\`');
        code += ';\n\nmessage.channel.send(embed);';
        message.author.send(`Код для генерации:\n\`\`\`js\n${code}\n\`\`\``);
    }
  };