module.exports = {
    name: 'help',
    regex: /help/,
    args: ['[command]'],
    desc: 'Ты серьезно?',
    hidden: true,
    example: 'help embed',
    module: 'util',
    run: async (message, args) => {
      let cmdList = Bot.commands.filter(c => !c.private && !c.hidden);

      const creators = Config.creators.map(id => Bot.client.users.cache.get(id).tag);

      if (!args[0]) {
        await message.channel.send(`Привет.\n\n**Colorful** - это бот для Вашего сервера с несколькими полезными функциями\nНа данный момент у меня **\`${cmdList.length}\`** ${Func.declOfNum(cmdList.length, ['команда', 'команды', 'команд'])}\n\n**\`${Bot.prefixes[0]}help commands\`**\nСписок команд.\n\n**\`${creators.join(', ')}\`**\nРазработчики бота.\n\n⚠️ Это бета-версия версия, поэтому могут встречаться баги. Напишите разработчику, если вы нашли баг\n\nНаш сервер: ${Config.server}`)

      } else if (args[0] === 'commands') {
        cmdList = cmdList.map(cmd => `◽ **${Bot.prefixes[0] + cmd.name} ${cmd.args?`\`${cmd.args.join(' ')}\``:''} -** ${cmd.desc}`);

        const embed = new Bot.Discord.MessageEmbed()
        .setAuthor('Список команд', message.author.avatarURL())
        .setDescription(`Напишите ${Bot.prefixes[0]}help **\`<название-команды>\`** для помощи по отдельной команде\n**\`<...>\`** - Обязательный параметр.\n**\`[...]\`** - Необязательный параметр.\n**\`|\`** - Оператор "или"`)
        .setDescription(cmdList)
        .setColor(Config.colors.blurple)
        .setFooter(Config.footer)
        await message.channel.send(embed);

      } else {
        const helpCmd = Bot.commands.find(c => args[0].match(c.regex));
        if (!helpCmd) return Bot.err(`Команда ${args[0]} не найдена`)
        await message.channel.send(`**Команда:** ${Bot.prefixes[0] + helpCmd.name} ${helpCmd.args? `\`${helpCmd.args}\`` : ''}\n**Описание:** ${helpCmd.desc}\n**Пример:** ${helpCmd.example? '```' + Bot.prefixes[0] + helpCmd.example + '```' : 'Не найден'}`);
      }
    }
  };
