module.exports = {
    name: 'anekdot',
    regex: /a(nek)?d(ot)?/,
    desc: 'Случайный анекдот',
    run: async (message, args) => {
        const fetch = require("node-fetch");
        async function anekdot() {
            const res = await fetch("https://www.anekdot.ru/rss/randomu.html", { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0" } });
            const anekText = await res.text();
            if(res.ok) {
                const anek = anekText.slice(138).split('\\",\\"')[0].replace(/<br>/gm, "\n").replace(/\\\\\"/gm, '"');
                const embed = new Bot.Discord.MessageEmbed()
                    .setTitle("Анекдот")
                    .setDescription(anek.slice(0, 4096))
                    .setColor(Config.colors.blurple)
                await message.channel.send(embed)
            } else {
                await message.channel.send("Ошибка API")
            }
        }
        await anekdot()
    }
}
