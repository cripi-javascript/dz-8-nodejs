var validate = function (event) {
    //это можно сказать копи паст...
    return !(typeof event.start === "undefined" ||
        typeof event.end === "undefined" ||
        typeof event.name === "undefined" ||
        typeof event.gps === "undefined" ||
        typeof event.gps.x === "undefined" ||
        typeof event.gps.y === "undefined" ||
        typeof event.stars === "undefined" ||
        typeof event.cost === "undefined" ||
        typeof event.parties === "undefined");
};
exports.validate = validate;
