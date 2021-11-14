module.exports = {
    name: 'user',
    regex: /user/,
    desc: 'Информация о пользователе',
    args: ['[@пользователь | тэг | ID]'],
    example: 'user @чел#1234',
    run: async (message, args) => {
      const matchArgs = new RegExp(args[0], 'i');
      let member = message.mentions.members.first() || message.guild.members.cache.find(m => args[0] && m.user.tag.match(matchArgs));

      try {
        if (!member && args[0]) member = message.guild.member(await Bot.client.users.fetch(args[0], 1, 1));
      } catch {
        return Bot.err('Пользователь не найден');
      }

      if (!args[0]) member = message.member;

      const statesTranslation = {
        web: 'Браузера 🌐',
        desktop: 'Клиента 🖥️',
        mobile: 'Телефона 📱'
      };

      const states = member.user.presence.clientStatus? Object.keys(member.user.presence.clientStatus).map(key => statesTranslation[key]) : ['Неизвестно или оффлайн ❔'];

      let desc = `${member} ${Config.emojis[member.user.presence.clientStatus? Object.values(member.user.presence.clientStatus)[0] : 'offline']} **\`${member.user.tag}\`**\n`;
      desc += `Аккаунт создан: **${Func.toMoscowTime(member.user.createdAt)}**\n`;
      if (member) desc += `Зашел на сервер: **${Func.toMoscowTime(member.joinedAt)}**\n`;
      desc += `\nСидит с: **${states.join(', ')}**\n`

      const embed = new Bot.Discord.MessageEmbed()
      .setAuthor(`Пользователь ${member.user.tag}`, member.user.avatarURL())
      .setColor(Config.colors.blurple)
      .setThumbnail(member.user.avatarURL({size: 1024, dynamic: true}))
      .setDescription(desc);
      await message.channel.send({embed});
    }
  };
