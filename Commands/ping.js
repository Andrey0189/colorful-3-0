module.exports = {
    name: 'ping',
    regex: /ping|пин[кг]/,
    desc: 'Пинг',
    run: async (message) => {
    const embed = new Bot.Discord.MessageEmbed()
        .setAuthor('Pong!', message.author.avatarURL)
        .setDescription(`**Discrod API - \`${Math.round(Bot.client.ws.ping)} ms\`**`)
        .setFooter(`${Bot.name} ${Bot.version}`)
        .setColor(Bot.colors.blurple);
        await message.channel.send(embed);
    }
}
