module.exports = {
    regex: /eval/,
    private: true,
    run: async (message, args) => {
      try {

        const output = eval("(async () => {" + args.join(' ') + "})()");

        await message.channel.send(`//Success ✅\n${JSON.stringify(output, null, 2)}`, {code: 'js', split: '\n'});
      } catch (err) {
        await message.channel.send(`//Error ❎\n${err}`, {code: 'js'});
      }
    }
  };
