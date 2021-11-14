module.exports = {
    name: 'kromer',
    regex: /kromer/,
    hidden: true,
    run: async (message) => {
        const dir = 'Images/Kromer/';
        const filesLength = Bot.fs.readdirSync(dir).length;
        await message.channel.send({
          files: [`${dir}${Bot.random(1, filesLength)}.png`]
        });
    }
}
