(function () {
    $.fn.scramble = function (duration, interval, charset, uppercase) {
        if (typeof duration !== "number" || duration < 1000 || duration > 20000) {
            duration = 3000;
        }
        if (typeof interval !== "number" || interval < 5 || interval > 1000) {
            interval = 20;
        }
        const charsets = {
            numbers: "0123456789".split(""), alphabet: "abcdefghijklmnopqrstuvwxyz".split(""), get alphanumeric() {
                return this.numbers.concat(this.alphabet);
            }, punctuation: ["@", "#", "$", "%", "^", "&", "*", "(", ")"], get all() {
                return this.alphanumeric.concat(this.punctuation);
            },
        };
        if (!charset || !(charset in charsets)) {
            charset = "all";
        }
        const chars = charsets[charset];
        const upper = uppercase === true;
        const original = this.text();
        this.text("");

        const randomChar = () => {
            let c = chars[Math.floor(Math.random() * chars.length)];
            return upper ? c.toUpperCase() : c;
        };
        const arr = original.split("");
        const len = arr.length;
        let intervalCount = 0;
        let revealCount = 0;
        const magic = parseInt(duration / interval / len);
        const self = this;

        const timer = setInterval(() => {
            intervalCount++;
            const scrambled = Array.from({length: len}, () => randomChar());

            if (intervalCount % magic === 0) {
                revealCount++;
            }
            for (let i = 0; i < revealCount; i++) {
                scrambled[i] = arr[i];
            }
            self.text(scrambled.join(""));

            if (revealCount >= len) {
                clearInterval(timer);
            }
        }, interval);
        return this;
    };
})(jQuery);
