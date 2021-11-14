module.exports = {
    name: 'gentext',
    regex: /gen(text)?/,
    args: ['<текст>'],
    desc: 'Генерация текста с помощью Порфирьевича',
    run: async (message, args) => {
        const fetch = require("node-fetch");

        const gentext = async (args) => {
          const body = {prompt: args, length: 35};
          const res = await fetch("https://pelevin.gpt.dobro.ai/generate/", {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json', "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0"}
          });

          const gen = await res.json();

          if (!gen.error && res.ok) return Func.randomElement(gen['replies']);
          else return 'Ошибка API';
        };

        let startedText = args.join(' ');
        let generated = await gentext(startedText);

        let embed = new Bot.Discord.MessageEmbed()
        .setTitle('Генерация Текста')
        .setDescription(`**${startedText}** ${generated}`)
        .setColor(Config.colors.blurple)
        .setFooter('Порфирьевич', 'https://media.discordapp.net/attachments/520187790282063873/906998259233460284/porf.png')
        const botsMsg = await message.channel.send(embed);
        await Func.multipleReact(botsMsg, ['🔁', '⏭️']);

        const reactCollector = new Bot.Discord.ReactionCollector(botsMsg, (reaction, user) => user.id === message.author.id, {time: 3e5});

        reactCollector.on('collect', async (reaction, user) => {

          if (reaction.emoji.name === '🔁') {
            await reaction.users.remove(user);
            generated = await gentext(startedText);
            embed.setDescription(`**${startedText}** ${generated}`);
            botsMsg.edit({embed: embed});
          }

          else if (reaction.emoji.name === '⏭️') {
            await reaction.users.remove(user);
            startedText = startedText + generated;
            generated = await gentext(startedText);
            embed.setDescription(`**${startedText}** ${generated}`);
            botsMsg.edit({embed: embed});
          };
       });
    }
};
