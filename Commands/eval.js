module.exports = {
    regex: /eval/,
    private: true,
    run: async (message, args) => {
      try {
        await message.channel.send(`//Success ✅\n${eval(args.join(' '))}`, {code: 'js', split: '\n'});
      } catch (err) {
        await message.channel.send(`//Error ❎\n${err}`, {code: 'js'});
      }
    }
  };
