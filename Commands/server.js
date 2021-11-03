module.exports = {
  name: 'server',
  regex: /server/,
  desc: 'Информация о сервере',
  args: ['[ID | название]'],
  run: async (message, args) => {
    const matchArgs = new RegExp(args[0], 'i')
    let guild = Bot.client.guilds.cache.find(g => g.id === args[0] || (args[0] && g.name.match(matchArgs)));
    if (args[0] && !guild) return Bot.err('Сервер не найден');
    if (!args[0]) guild = message.guild;

    const types = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']
    const translated = ['Нет', 'Нужен проверенный e-mail', 'Аккаунту должно быть больше 5 минут', 'Нужно быть на сервере больше 10 минут', 'Нужен подвтержденный номер телефона']


    let verifLvl
    for (let i = 0; i < types.length; i++) {
      if (types[i] === guild.verificationLevel) verifLvl = translated[i];
    };

    let bans = await guild.fetchBans().catch(err => err);
    if (bans.name) bans = 'Недостаточно прав';
    else bans = bans.size;

    calculateMembersStatus = (status) => guild.members.cache.filter(m => m.user.presence.status === status).size;
    const online = calculateMembersStatus('online');
    const dnd = calculateMembersStatus('dnd');
    const idle = calculateMembersStatus('idle');
    const offline = calculateMembersStatus('offline');

    calculateMembersClientStatus = (state) => guild.members.cache.filter(m => m.user.presence.clientStatus && Object.keys(m.user.presence.clientStatus).find(key => key === state)).size;
    const browser = calculateMembersClientStatus('web');
    const desktop = calculateMembersClientStatus('desktop');
    const mobile = calculateMembersClientStatus('mobile');
    const unknown = guild.members.cache.filter(m => !m.user.presence.clientStatus).size;

    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const people = guild.memberCount - bots;

    calculateChannels = (type) => guild.channels.cache.filter(ch => ch.type === type).size;
    const text = calculateChannels('text');
    const voice = calculateChannels('voice');

    const animated = guild.emojis.cache.filter(e => e.animated).size;
    const static = guild.emojis.cache.size - animated;

    let desc = `Создан **${Bot.toMoscowTime(guild.createdAt)}**\n`
    if (!args[0]) desc += `Вы зашли сюда: **${Bot.toMoscowTime(message.member.joinedAt)}\n**`
    desc += `Владелец: ${guild.owner} **\`${guild.owner.user.tag}\`**\n\n`;
    desc += `Участников: **\`${guild.memberCount}\`**\n`;
    desc += `${Bot.emojis.online} \`${online}\` | ${Bot.emojis.dnd} \`${dnd}\` | ${Bot.emojis.idle} \`${idle}\` | ${Bot.emojis.offline} \`${offline}\`\n`;
    desc += `🌐 \`${browser}\` | 🖥️ \`${desktop}\` | 📱 \`${mobile}\` | ❔ \`${unknown}\`\n`;
    desc += `👤 \`${people}\` | 🤖 \`${bots}\`\n\n`;
    desc += `Каналов: **\`${text + voice}\`**\n`;
    desc += `💬 \`${text}\` | 🔊 \`${voice}\`\n\n`;
    desc += `Эмодзи: **\`${static + animated}\`**\n`;
    desc += `PNG: \`${static}\` | GIF: \`${animated}\`\n\n`;
    desc += `Ролей: **\`${guild.roles.cache.size}\`**\n\n`;
    desc += `Уровень верификации: **${verifLvl}.**\n`;
    desc += `Количество банов: **\`${bans}\`**`;

    const embed = new Bot.Discord.MessageEmbed()
    .setAuthor(guild.name, message.author.avatarURL())
    .setColor(Bot.colors.main)
    .setThumbnail(guild.iconURL({size: 1024, dynamic: true}))
    .setDescription(desc)
    message.channel.send(embed);
  }
};
