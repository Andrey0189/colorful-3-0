module.exports = {
    name: 'ping',
    regex: /ping|пин[кг]/,
    desc: 'Пинг',
    run: async (message) => {
        await message.channel.send(`**\`${Math.round(Bot.client.ws.ping)}\` ms**`);
    }
}
