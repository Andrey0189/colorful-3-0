module.exports = {
    name: 'ipinfo',
    regex: /ip(info)?/,
    desc: 'Информация про IP адрес',
    run: (message, args) => {
        const fetch = require("node-fetch");
        if(!process.env.IPINFO_TOKEN) return message.channel.send("<:fuckyou:892838002466881576>");
        function validateIp(ip) {
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) || /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(ip)
        }
        if(!args[0] || !validateIp(args[0])) return message.channel.send("Дай мне IP адрес");
        async function getIpInfo() {
            const res = await fetch("https://ipinfo.io/" + encodeURIComponent(args[0]) + "?token=" + process.env.IPINFO_TOKEN);
            const ipinfo = await res.json();
            if(!ipinfo.error && res.ok) {
                if(ipinfo.bogon) return message.channel.send("Не");
                coordsForMap = ipinfo.loc ? ipinfo.loc.split(",") : [0, 0];
                const embed = new Bot.Discord.MessageEmbed()
                    .setTitle(ipinfo.ip)
                    .addField("Имя хоста", ipinfo.hostname ? ipinfo.hostname : "Нету", true)
                    .addField("Местоположение", ipinfo.loc ? (ipinfo.city + ", " + ipinfo.region + ", " + ipinfo.country + " :flag_" + ipinfo.country.toLowerCase() + ": (" + ipinfo.loc + ")") : "Нету", true)
                    .addField("Интернет провайдер", ipinfo.org ? ipinfo.org : "Нету", true)
                    .addField("Почтовый код", ipinfo.postal ? ipinfo.postal : "Нету", true)
                    .addField("Временная зона", ipinfo.timezone ? ipinfo.timezone : "Нету", true)
                    .setImage("https://tyler-demo.herokuapp.com/?greyscale=False&lat=" + coordsForMap[0] + "&lon=" + coordsForMap[1] + "&zoom=15&width=600&height=400")
                    .setColor(Bot.colors.blurple)
                message.channel.send(embed)
            } else {
                message.channel.send("Ошибка API")
            }
        }
        getIpInfo()
    }
}
