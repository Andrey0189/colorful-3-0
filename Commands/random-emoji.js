module.exports = {
    name: 'random-emoji',
    regex: /random-emoji|re/,
    desc: 'Случайный эмодзи с другого сервера',
    run: (message) => {
        const emojis = Bot.client.emojis.cache.filter(e => e.guild.id !== message.guild.id);
        const randomEmoji = emoji.random
        message.channel.send(randomEmoji);
    }
}
