class Func {
    constructor() {
        const _this = this;

        this.declOfNum = (number, titles) => {
            const cases = [2, 0, 1, 1, 1, 2];
            return titles[(number % 100 > 4 && number % 100 < 20)? 2 : cases[(number % 10 < 5)? number % 10 : 5]];
        };

        this.randomElement = arr => arr[Math.ceil(Math.random() * arr.length - 1)];

        this.toMoscowTime = (time) => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-');

        this.multipleReact = async (message, arr) => {
          if (0 in arr) await message.react(arr.shift()).then(() => _this.multipleReact(message, arr).catch());
        };

        this.addCommas = (int) => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
}

global.Func = new Func();
