/*global Model: false,
GUID:false,
 FieldsError:false,
 $:false
*/
(function (toExport) {
    "use strict";

/**
 * Создает новое событие в календаре
 * @class Событие в календаре
 * @augments Model 
 *
 * @field {Number} - id Индификационный номер объекта по идее тут должен быть GUID.js
 * @field {Object} - location объект содержащий локационные данные о событии + название события
 * @field {Number} - реитинг
 * @field {Number} - Цена посещения
*/
    var Event = function Event(data) {
        if (typeof data === "undefined") {
            Model.call(this, {
                "start": new Date(),
                "end" : new Date(),
                "gps" : {
                    "x": 0,
                    "y": 0
                },
                "name" : "Что-то",
                "stars" : 0,
                "cost" : 0,
                "parties" : [],
                "id" : GUID.createGUID()
            });
            return this;
        }
        var eventDefaultVal = new Event(),
            newEvent = this;
        Model.call(this, eventDefaultVal);
        Model.call(this, data);
        Event.isValidate(data).forEach(function (error) {
            newEvent[error.who] = eventDefaultVal[error.who];
        });
        return this;
    },
        dateValidator,
        isValidateTimeInterval,
        isValidateGps,
        isValidateName,
        isValidateStars,
        isValidateCost;

    toExport.Event = Event;
    Event.prototype = Object.create(Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

/**
 * @function Функция, проверяющая корректность даты
 *
 * @return {Boolean}
*/
    dateValidator = function (date) {
        if (Object.prototype.toString.call(date) === "[object Date]") {
            if (!isNaN(date.getTime())) {
                return true;
            }
        }
        return false;
    };
/**
 *
 * @function проверяет корректный ли параметр интервала времени события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    isValidateTimeInterval = function (event) {
        var errors = [];
        if (!event.start || !dateValidator(event.start)) {
            errors.push(new FieldsError("start", "Дата начала события задана не корректно", true));
        }
        if (!event.end || !dateValidator(event.end)) {
            errors.push(new FieldsError("end", "Дата конца событий задана не корректно", true));
        }
        if (errors.length === 0) {
            if (event.start.getTime() > event.end.getTime()) {
                errors.push(new FieldsError("start", "Дата начала и конца события перепутаны местами", true));
                errors.push(new FieldsError("end", "Дата начала и конца события перепутаны местами", true));
            }
        }

        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметры содержащие координаты события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    isValidateGps = function (event) {
        var errors = [];

        if (typeof event.gps === "undefined" || !$.isNumeric(event.gps.x)) {
            errors.push(new FieldsError("gps.x", "Координата X - не число"));
        }
        if (typeof event.gps === "undefined" || !$.isNumeric(event.gps.y)) {
            errors.push(new FieldsError("gps.y", "Координата Y - не число"));
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр названия события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    isValidateName = function (event) {
        var errors = [];
        if (event.name === "undefined" || event.name.length === 0 || event.name.length > 100) {
            errors.push(new FieldsError("name", "Название события должно содержать имя от 1 до 100 символов", true));
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр рейтинга события
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    isValidateStars = function (event) {
        var errors = [];
        if (typeof event.stars === "undefined" || !$.isNumeric(event.stars)) {
            errors.push(new FieldsError("stars", "В поле должно быть введено число"));
        } else {
            if (event.stars < 0 || event.stars > 5) {
                errors.push(new FieldsError("stars", "Количество звезд от 0 до 5"));
            } else {
                if (Math.floor(event.stars) !== event.stars) {
                    errors.push(new FieldsError("stars", "Количество звезд целое число"));
                }
            }
        }
        return errors;
    };
/**
 *
 * @function проверяет корректный ли параметр стоимости посещения
 * @param {Object} event
 * @return {Array} сообщения с ошибками
 */
    isValidateCost = function (event) {
        var errors = [];
        if (typeof event.cost === "undefined" || !$.isNumeric(event.cost)) {
            errors.push(new FieldsError("cost", "В этом поле должно быть число"));
        } else {
            if (event.cost < 0) {
                errors.push(new FieldsError("cost", "Цена за участие не может быть отрицательной"));
            }
        }
        return errors;
    };
/**
 * @function Проверяет объект на корректность
 *
 * @field {Object} event - то что проверяемый
 * @return {Array} сообщение с ошибками.
*/
    Event.isValidate = function (event) {
        return [].concat(
            isValidateTimeInterval(event),
            isValidateName(event),
            isValidateGps(event),
            isValidateCost(event),
            isValidateStars(event)
        );
    };
/**
 * @function Функция, печатающие значение рейтинга в звездочках
 *
 * @return {String} ,*,**,***,****,*****
*/
    Event.prototype.starsToString = function () {
        return new Array(this.stars + 1).join('*');
    };
}(window));