(function () {
    "use strict";
    var randomHex4,
        GUID;
    /**
     * @function генерирует случайный hex из четырех символов
     * @private
     * @return {String}
     */
    randomHex4 = function () {
        return Math.floor(
            Math.random() * 0x10000 /* 65536 */
        ).toString(16);
    };
    /**
     * @namespaсe , содержащий инструменты для работы с GUID
     */
    GUID = function () {};
    exports.GUID = GUID;
    /**
     * function генерирует guid в виде строки
     * @return {String}
     */
    GUID.createGUID = function () {
        return (
            randomHex4() + randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + "-" +
                randomHex4() + randomHex4() + randomHex4()
        );
    };
}());
