module.exports = {
    name: 'gentext',
    regex: /gen(text)?/,
    args: ['<текст>'],
    desc: 'Генерация текста с помощью Порфирьевича',
    run: async (message, args) => {
        const fetch = require("node-fetch");
        const choose = (arr) => {
            let index = Math.floor(Math.random() * arr.length);
            return arr[index];
        }

        const body = {prompt: args.join(" "), length: 30};
        const res = await fetch("https://pelevin.gpt.dobro.ai/generate/", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json', "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0"}
        });
        const gen = await res.json();
        if(!gen.error && res.ok) {
            const embed = new Bot.Discord.MessageEmbed()
                .setTitle("Генерация Текста")
                .addField(args.join(" "), args.join(" ") + choose(gen['replies']), true)
                .setColor(Bot.colors.blurple)
                .setFooter('Порфирьевич')
            await message.channel.send(embed)
        } else {
            await message.channel.send("Ошибка API")
        }
    }
}
