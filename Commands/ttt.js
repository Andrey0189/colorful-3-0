module.exports = {
  name: 'ttt',
  regex: /t(ic)?-?t(ac)?-?t(oe)?/,
  args: ['[user]'],
  desc: 'Крестики-нолики',
  example: 'https://media.discordapp.net/attachments/648115093850030091/668503609482149918/tttEx.gif',
  module: 'games',
  run: async (message, args) => {
    const gameField = new Array(9);
    const matchArgs = new RegExp(args[0], 'i')
    let opponent = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag.match(matchArgs) || m.id === args[0]);
    if (args[0] && !opponent) return Bot.err('Участник не найден');
    if (!args[0]) opponent = message.guild.me;

    if (opponent.id === message.author.id || (args[0] && opponent.user.bot)) return Bot.err('Вы не можете играть с ботами или с собой');

    let firstPlayer;
    const plr1 = {
      user: message.member,
      symbol: 'X'
    };
    const plr2 = {
      user: opponent,
      symbol: 'O'
    };
    let tttText = `Напишите номер поля внизу \`(1-9)\`. Напишите \`stop\`, чтобы остановить игру`;
    const tttText2 = `\`X\` - \`${message.author.username}\`\n\`O\` - \`${opponent.user.username}\``;

    const arrToMsg = (field) => {
      const arr = field.join().split(',').map((c, index) => c? c : index + 1);
      let msg = '';
      for (let i = 0; i < 9; i += 3) msg += `${arr[i]}|${arr[i + 1]}|${arr[i + 2]}\n`;
      return `\`\`\`css\n${msg}\n\`\`\``;
    };

    const calculatingWin = (field, symbol) => {
      for (let i = 0; i < 9; i += 3) if (field[i] === symbol && field[i + 1] === symbol && field[i + 2] === symbol) return true;
      for (let i = 0; i < 3; i++) if (field[i] === symbol && field[i + 3] === symbol && field[i + 6] === symbol) return true;
      for (let i = 2; i < 6; i += 2) if (field[4] === symbol && field[4 - i] === symbol && field[4 + i] === symbol) return true;
      return false;
    };

    const multiplayer = async (field, msgTtt, currentPlr) => {
      const otherPlr = currentPlr.user.id === message.author.id? plr2 : plr1;
      if (!field.includes(undefined)) tttText = `Ничья!`
      if (calculatingWin(field, otherPlr.symbol)) {
        tttText = `Победил!`;
        currentPlr.user = otherPlr.user;
      }
      await msgTtt.edit(`**${currentPlr.user} ${tttText}\n${tttText2}\n${arrToMsg(field)}**`);
      if (tttText.match(/побе|ничья/i)) return;
      const timer = setTimeout(() => {
        return message.channel.send(`**Время вышло! ${otherPlr} победил!**`);
      }, 6e4);
      const collector = new Bot.Discord.MessageCollector(message.channel, m => {
        const number = parseInt(m.content);
        return (m.author.id === currentPlr.user.id) && !(isNaN(number) || number > 9 || number < 1 || number - 1 in field)
        || (Bot.prefixes.find(p => m.content.startsWith(p)) || m.content.toLowerCase() === 'stop');
      }, { time: 6e4 });
      collector.on('collect', async msg => {
        clearTimeout(timer);
        await collector.stop();
        if (Bot.prefixes.find(p => msg.content.startsWith(p)) || msg.content.toLowerCase() === 'stop') return Bot.suc('Игра остановлена');

        msg.delete();

        const number = parseInt(msg.content);

        field[number - 1] = currentPlr.symbol;
        return multiplayer(field, msgTtt, otherPlr);
      })
    };

    const aiMoves = (field) => {
      const testField = field.join().split(',');
      const edges = [1, 3, 7, 9];
      const lines = [2, 4, 6, 8];
      let move = Bot.randomElement(edges.filter(n => !(n - 1 in field))) || Bot.randomElement(lines.filter(n => !(n - 1 in field)))
      testField.forEach((c, index) => {
        if (!c) {
          testField[index] = 'X';
          if (calculatingWin(testField, 'X')) move = index + 1;
          testField[index] = '';
        };
      });

      testField.forEach((c, index) => {
        if (!c) {
          testField[index] = 'O';
          if (calculatingWin(testField, 'O')) move = index + 1;
          testField[index] = '';
        };
      });

      return move;
    };

    const move = async (field, msgTtt, err) => {
      checkingForEnd = () => {
        if (!field.includes(undefined)) tttText = `Ничья!`
        if (calculatingWin(field, 'X')) {
          tttText = `${message.author}, Ты победил!`;
        };
        if (calculatingWin(field, 'O')) {
          tttText = `${message.author}, Ты проиграл! 😎`;
        };
      };

      checkingForEnd();

      if (firstPlayer.user.id === opponent.id || field.find(c => c === 'X') && field.includes(undefined) && !err && !tttText.match(/ты |ничья/i)) field[aiMoves(field) - 1] = 'O';
      if (!tttText.match(/ты п|ничья/i)) checkingForEnd()
      await msgTtt.edit(`**${tttText}\n${tttText2}\n${arrToMsg(field)}**`);
      if (tttText.match(/ты п|ничья/i)) return;
      // Bot.sendIn('661540288690651138', `**${arrToMsg(field)}**`);
      const timer = setTimeout(() => {
        return message.channel.send('Время вышло! Я победил 😎');
      }, 6e4);
      const collector = new Bot.Discord.MessageCollector(message.channel, m => {
        const number = parseInt(m.content);
        return (m.author.id === message.author.id) && !(isNaN(number) || number > 9 || number < 1 || number - 1 in field)
        || (Bot.prefixes.find(p => m.content.startsWith(p)) || m.content.toLowerCase() === 'stop');
      }, { time: 6e4 });
      collector.on('collect', async msg => {
        clearTimeout(timer);
        await collector.stop();
        if (Bot.prefixes.find(p => msg.content.startsWith(p)) || msg.content.toLowerCase() === 'stop') return Bot.suc('Игра остановлена');
        msg.delete();

        const number = parseInt(msg.content);

        field[number - 1] = 'X';
        return move(field, msgTtt);
      });
    };

      await message.channel.send(`Кто пойдет первым? \n**\`1. ${message.author.username}\n2. ${opponent.user.username}\`**`);
      const collector = new Bot.Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 6e4 });
      const timer = setTimeout(() => {
        return Bot.err('Время вышло!');
      }, 6e4);
      collector.on('collect', async msg => {
        clearTimeout(timer);
        collector.stop();

        const num = parseInt(msg.content);
        if (num === 1) firstPlayer = plr1;
        else if (num === 2) firstPlayer = plr2;
        else return Bot.err('Вы указали неверное число');

        if (opponent.user.bot) {
          const msgTtt = await message.channel.send('``` ```');
          return move(gameField, msgTtt);
        }
        else {
          await message.channel.send(`**${opponent}, Вы хотите поиграть в Крестики-нолики c \`${message.author.username}\`? (Да/Нет)**`);
          const collector = new Bot.Discord.MessageCollector(message.channel, m => m.author.id === opponent.id, { time: 3e5 });
          const timer = setTimeout(() => {
            return message.channel.send('Никто не ответил :(');
          }, 3e5);
          collector.on('collect', async msg => {
            clearTimeout(timer);
            collector.stop();
            if (['yes', 'да', '+'].includes(msg.content.toLowerCase())) {
              const msgTtt = await message.channel.send('``` ```');
              return multiplayer(gameField, msgTtt, firstPlayer);
            } else return message.reply(`Кажется, \`${opponent.user.username}\` не хочет играть с Вами :(`)
          });
        };
      });
  }
};
