module.exports = {
    name: 'invite',
    regex: /inv[ite]/,
    desc: 'Ссылка на приглашение бота',
    run: async (message) => {
        await message.channel.send(`<https://discord.com/oauth2/authorize?client_id=${Bot.client.user.id}&scope=bot&permissions=608037953>`);
    }
}
