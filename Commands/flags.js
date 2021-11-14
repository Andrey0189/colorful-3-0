module.exports = {
    name: 'flags',
    regex: /flag(s)?/,
    args: ['[количество флагов от 2 до 10 (по умолчанию 3)]'],
    desc: 'Миниигра "Угадай страну по флагу"',
    run: async (message, args) => {
        if(Bot.minigamePlayers.flags.some(item => { return (item.uid === message.author.id && item.cid === message.channel.id) })) return Bot.err("Ты уже запустил игру в этом канале");
        Bot.minigamePlayers.flags.push({"uid": message.author.id, "cid": message.channel.id});
        
        function removePlayerFromList() {
            function arrFilter(item) {
                return (item.uid !== message.author.id && item.cid !== message.channel.id)
            }
            Bot.minigamePlayers.flags = Bot.minigamePlayers.flags.filter(arrFilter)
        }

        var flagcount = parseInt(args[0]);
        if(!args[0] || isNaN(flagcount) || flagcount < 2 || flagcount > 10) { flagcount = 3 };
        
        function colFilter(input) {
            const parsedInput = parseInt(input)
            if(isNaN(parsedInput) || parsedInput < 1 || parsedInput > flagcount) return false;
            return true;
        }

        const countrylist = require("../countries.json");
        function getRandCountry() {
            return countrylist[Math.floor(Math.random() * countrylist.length)]
        }
        var countryarr = [];
        function addRandConToArr() {
            const rcon = getRandCountry();
            if(countryarr.includes(rcon)) { addRandConToArr() } else { countryarr.push(rcon) }
        }
        for(var i = 0; i < flagcount; i++) {
            addRandConToArr();
        }

        var countrysts = [];
        countryarr.forEach(country => countrysts.push((countryarr.indexOf(country) + 1).toString() + ". :flag_" + country.code + ":"));
        const ctoguess = countryarr[Math.floor(Math.random() * countryarr.length)];
        
        const embed = new Bot.Discord.MessageEmbed()
            .setTitle("Где " + ctoguess.name + "?")
            .setDescription(countrysts.join("\n"))
            .setFooter("Отправьте номер ответа в чат")
            .setColor(Bot.colors.blurple)
        message.channel.send(embed);
        
        const collector = new Bot.Discord.MessageCollector(message.channel, colFilter);
        const guessTimeout = setTimeout(() => {
            const timeembed = new Bot.Discord.MessageEmbed()
                .setTitle("Время вышло")
                .setDescription("Правильный ответом был :flag_" + ctoguess.code + ":")
                .setColor(Bot.colors.red)
            message.channel.send(timeembed);
            removePlayerFromList();
            collector.stop();
        }, 10000)
        collector.on("collect", msg => {
            if(message.author.id !== msg.author.id) return false;
            const answerIndex = parseInt(msg.content) - 1;
            if(countryarr[answerIndex].code === ctoguess.code) {
                const finalembed = new Bot.Discord.MessageEmbed()
                    .setTitle("Правильный ответ")
                    .setDescription("Ты правильно угадал флаг")
                    .setColor(Bot.colors.green)
                msg.channel.send(finalembed);
            } else {
                const finalembed = new Bot.Discord.MessageEmbed()
                    .setTitle("Неправильный ответ")
                    .setDescription("Правильный ответом был :flag_" + ctoguess.code + ":")
                    .setColor(Bot.colors.red)
                msg.channel.send(finalembed);
            }
            clearTimeout(guessTimeout);
            removePlayerFromList();
            collector.stop()
        });
    }
}
