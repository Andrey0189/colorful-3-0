module.exports = {
    name: 'gentext',
    regex: /gen(text)?/,
    args: ['<текст>'],
    desc: 'Генерация текста с помощью Порфирьевича',
    run: async (message, args) => {
        const fetch = require("node-fetch");

        const gentext = async (args) => {
          const body = {prompt: args, length: 30};
          const res = await fetch("https://pelevin.gpt.dobro.ai/generate/", {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {'Content-Type': 'application/json', "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0"}
          });

          const gen = await res.json();

          if (!gen.error && res.ok) return Bot.randomElement(gen['replies']);
          else return 'Ошибка API';
        };


        if(!gen.error && res.ok) {
        const embed = new Bot.Discord.MessageEmbed()
        .setTitle('Генерация Текста')
        .setDescription(`**${args.join(" ")}** ${gentext(args.join(' '))}`)
        .setColor(Bot.colors.blurple)
        .setFooter('Порфирьевич', 'https://media.discordapp.net/attachments/520187790282063873/906998259233460284/porf.png')
        await message.channel.send(embed)
    }
}
