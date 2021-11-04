module.exports = {
    name: 'random-emoji',
    regex: /random-emoji|re/,
    desc: 'Случайный эмодзи с другого сервера',
    run: async (message) => {
        const emojis = Bot.client.emojis.cache.filter(e => e.guild.id !== message.guild.id);
        const randomEmojiID = emojis.random().identifier
        await message.channel.send(`<:${randomEmojiID}>`);
    }
}
