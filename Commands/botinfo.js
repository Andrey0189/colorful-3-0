module.exports = {
  name: 'info',
  regex: /info/,
  desc: 'Информация о боте',
  run: async (message) => {
    const creators = Config.creators.map(id => `**${Bot.client.users.cache.get(id)}, \`${Bot.client.users.cache.get(id).tag}\`**`);

    const embed = new Bot.Discord.MessageEmbed()
    .setAuthor('Информация о боте', Bot.client.user.avatarURL())
    .addField('Базовая информация', `**Сервера: \`${Bot.client.guilds.cache.size}\`\nПользователи: \`${Bot.client.users.cache.size}\`\n\nОЗУ: \`${Math.round(process.memoryUsage().rss / 1024 / 1024 )}/1,024 MB\`**`)
    .addField('Разработчики', creators.join('\n'))
    .setTitle('Пригласить бота')
    .setURL(`https://discordapp.com/oauth2/authorize?client_id=${Bot.client.user.id}&scope=bot&permissions=608037953`)
    .setColor(Config.colors.blurple);
    await message.channel.send(embed);
  }
};
