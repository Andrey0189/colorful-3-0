module.exports = {
  1: '1⃣', 2: '2⃣', 3: '3⃣',
  4: '4⃣', 5: '5⃣', 6: '6⃣',
  7: '7⃣', 8: '8⃣', 9: '9️⃣',
  10: '🔟',
  name: 'poll',
  regex: /poll|vote/,
  args: ['<Вопрос; Вариант1; Вариант2; и т. д.>'],
  example: 'poll Пепси или кола?; Пепси; Кола; Водичка',
  desc: 'Голосование',
  module: 'util',
  run: (message, args) => {
    const poll = message.content.slice(Bot.prefixes[0].length).trim().split(/;+/g);

    if (!poll[1]) return Bot.err(`Нельзя создавать пустые голосования, лол.`);
    const question = args.join(' ').match(/(.*?);/g)[0].slice(0, -1);
    if (poll[11]) return Bot.err('Голосование нельзя делать с более чем 10 вариантами');

    let variants = '';
    let reactArray = [];

    for (let i = 1; i < poll.length && poll[i].length > 0; i++) {
      variants += `${module.exports[i]} ${poll[i]}\n`;
      reactArray.push(module.exports[i]);
    };

    message.channel.send(`**:bar_chart: ${question.trim()}**\n\n${variants}\n**Автор голосования - \`${message.author.tag}\`**`).catch(msg => {
      Bot.err('Лимит символов превышен. Пожалуйста, сделайте голосование более компактным');
    }).then(msg => {
      Func.multipleReact(msg, reactArray);
    });
  }
};
