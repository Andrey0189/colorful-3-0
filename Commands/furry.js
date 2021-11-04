module.exports = {
    name: 'furry',
    regex: /furry/,
    hidden: true,
    run: async (message) => {
        const fs = require('fs');
        const dir = 'Images/Furry/';
        const filesLength = fs.readdirSync(dir).length;
        const randomInteger = (min, max) => {
            let rand = min - 0.5 + Math.random() * (max - min + 1);
            return Math.round(rand);
        }

        await message.channel.send({files: [`${dir}${randomInteger(1, filesLength)}.png`]});
    }
}
