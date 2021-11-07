module.exports = {
    regex: /eval/,
    private: true,
    run: async (message, args) => {
      try {

        const output = eval(`const verySussyFunction = async () => { ${args.join(' ')} }; x();`);

        await message.channel.send(`//Success ✅\n${output}`, {code: 'js', split: '\n'});
      } catch (err) {
        await message.channel.send(`//Error ❎\n${err}`, {code: 'js'});
      }
    }
  };
