module.exports = {
    regex: /eval/,
    private: true,
    run: async (message, args) => {
      try {
        message.channel.send(`//Success ✅\n${eval(args.join(' '))}`, {code: 'js', split: '\n'});
      } catch (err) {
        message.channel.send(`//Error ❎\n${err}`, {code: 'js'});
      };
    }
  };
  