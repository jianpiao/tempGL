var preventDoublePress = {
    lastPressTime: 1,
    reponTime: 1000,
    onPress(callback) {
        let curTime = new Date().getTime();
        if (curTime - this.lastPressTime > this.reponTime) {
            this.lastPressTime = curTime;
            callback();
        }
    },
};
module.exports = preventDoublePress;
