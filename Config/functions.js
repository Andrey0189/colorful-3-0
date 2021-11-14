    {

        declOfNum: (number, titles) => {
            const cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20)? 2 : cases[(number % 10 < 5)? number % 10 : 5]];
        },

        randomElement: arr => arr[Math.ceil(Math.random() * arr.length - 1)],

        toMoscowTime: time => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-'),

        multipleReact: async (message, arr) => {
          if (0 in arr) await message.react(arr.shift()).then(() => _this.multipleReact(message, arr).catch());
        },

        addCommas: (int) => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    };
